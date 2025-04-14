# backend/app.py
import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure CORS to allow requests from your React frontend
# Replace 'http://localhost:3000' with the actual origin of your React app if different
CORS(app, resources={r"/chat": {"origins": "http://localhost:5176"}})

# Configure the Gemini API key
try:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("API key not found. Make sure GOOGLE_API_KEY is set in your .env file.")
    genai.configure(api_key=api_key)
except ValueError as e:
    print(f"Error: {e}")
    # Handle the error appropriately, maybe exit or provide a default behavior
    # For now, we'll print the error and continue, but API calls will fail.

# Initialize the Gemini Model (using a recommended model)
# Check the Gemini documentation for the latest model names
try:
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
except Exception as e:
    print(f"Error initializing Gemini model: {e}")
    model = None # Set model to None if initialization fails

@app.route('/chat', methods=['POST'])
def chat():
    if not model:
        return jsonify({"error": "Gemini model not initialized. Check API key and configuration."}), 500

    try:
        data = request.get_json()
        user_message = data.get('message')

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Optional: Include chat history if you want context (more advanced)
        # history = data.get('history', [])
        # chat_session = model.start_chat(history=history)
        # response = chat_session.send_message(user_message)

        # Simple generation without history
        response = model.generate_content(user_message)

        # Check if the response has the expected structure
        if response and response.parts:
             bot_reply = response.text # Accessing text directly might be simpler if available
        # Fallback if text attribute is not directly available (structure might vary)
        elif response and hasattr(response, 'text'):
             bot_reply = response.text
        else:
             # Handle cases where the response structure is unexpected or empty
             print("Warning: Unexpected response format from Gemini API:", response)
             # Extract text safely if possible, otherwise provide a default message
             try:
                 # Attempt to find text within parts if they exist
                 if response.parts:
                      bot_reply = "".join(part.text for part in response.parts if hasattr(part, 'text'))
                 else:
                     bot_reply = "Sorry, I couldn't process that."
             except AttributeError:
                 bot_reply = "Sorry, I received an unexpected response format."


        return jsonify({"reply": bot_reply})

    except Exception as e:
        print(f"Error during chat generation: {e}")
        # Log the full traceback for debugging if needed
        # import traceback
        # traceback.print_exc()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    # Runs the Flask development server
    # Make sure the port matches what the frontend expects (default is 5000)
    app.run(debug=True, port=5000)