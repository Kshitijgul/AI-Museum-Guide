from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# CORS configuration - adjust for your React app's origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("No GEMINI_API_KEY set in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize the Gemini model
model = genai.GenerativeModel('gemini-pro')

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    chat_history: list[dict] = []  # Format: [{"role": "user|model", "content": "message"}]

class ChatResponse(BaseModel):
    response: str
    chat_history: list[dict]

@app.get("/")
def read_root():
    return {"message": "Chatbot API is running"}

@app.post("/chat")
async def chat_with_gemini(request: ChatRequest):
    try:
        # Start a chat session with history if available
        chat = model.start_chat(history=request.chat_history)
        
        # Send message to Gemini
        response = await chat.send_message_async(request.message)
        
        # Format the response
        return ChatResponse(
            response=response.text,
            chat_history=chat.history
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))