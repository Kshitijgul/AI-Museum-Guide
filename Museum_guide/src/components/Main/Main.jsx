import React, { useState, useEffect, useRef } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";

const Main = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(); // Automatically send after speech recognition
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    } else {
      console.warn("Speech recognition not supported in this browser");
    }
  }, []);

  const handleSend = async () => {
    if (input.trim() === "") return;
    
    // Add user message to chat
    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    try {
      // Send to backend API
      const response = await fetch("YOUR_BACKEND_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage = { text: data.answer, sender: "ai" };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { text: "Sorry, I couldn't process your request.", sender: "ai" };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  

  return (
    <div className="main">
      <div className="nav">
        <p>AI Museum Guide</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        <div className="greet">
          <p>
            <span>Hello, Researcher</span>
          </p>
          <p>What can I help you with?</p>
        </div>
        
        {/* Chat messages display */}
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        
        {/* Sample question cards */}
        <div className="cards">
          <div className="card" onClick={() => {
            setInput("Can you tell me about Chhatrapati Shivaji Maharaj?");
            inputRef.current.focus();
          }}>
            <p>Can you tell me about Chhatrapati Shivaji Maharaj?</p>
            <img src={assets.history_icon} alt="" />
          </div>
          <div className="card" onClick={() => {
            setInput("What are the museum's opening hours?");
            inputRef.current.focus();
          }}>
            <p>What are the museum's opening hours?</p>
            <img src={assets.history_icon} alt="" />
          </div>
          <div className="card" onClick={() => {
            setInput("Tell me about the current exhibitions");
            inputRef.current.focus();
          }}>
            <p>Tell me about the current exhibitions</p>
            <img src={assets.history_icon} alt="" />
          </div>
        </div>
        
        <div className="main-bottom">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Ask me about anything here" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              ref={inputRef}
            />
            <div className="images">
              <img 
                src={assets.mic_icon} 
                alt="Mic" 
                onClick={toggleSpeechRecognition}
                style={{ opacity: isListening ? 1 : 0.5 }}
              />
              <img 
                src={assets.send_icon} 
                alt="Send" 
                onClick={handleSend}
              />
            </div>
          </div>
          <p className="bottom-info">
            Our model will provide answers based on the museum's data
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;