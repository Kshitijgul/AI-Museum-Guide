import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Main.css";
import { assets } from "../../assets/assets";

const API_BASE = 'http://192.168.0.110:5000';

const languageOptions = [
  { code: 'English', name: 'English' },
  { code: 'Hindi', name: 'Hindi' },
  { code: 'Marathi', name: 'Marathi' },
  { code: 'Bengali', name: 'Bengali' },
  { code: 'Tamil', name: 'Tamil' },
  { code: 'Telugu', name: 'Telugu' },
  { code: 'Gujarati', name: 'Gujarati' },
  { code: 'Kannada', name: 'Kannada' },
  { code: 'Malayalam', name: 'Malayalam' },
  { code: 'Punjabi', name: 'Punjabi' },
  { code: 'Odia', name: 'Odia' },
  { code: 'Urdu', name: 'Urdu' },
  { code: 'Spanish', name: 'Spanish' },
  { code: 'French', name: 'French' },
  { code: 'German', name: 'German' }
];


const Main = () => {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ENGLISH');
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize with a new chat
  useEffect(() => {
    if (!currentChatId) {
      setShowLanguagePopup(true);
    }
  }, []);

  // Load messages for current chat
  useEffect(() => {
    if (currentChatId) {
      const savedMessages = localStorage.getItem(`chat_${currentChatId}`);
      setMessages(savedMessages ? JSON.parse(savedMessages) : []);
    }
  }, [currentChatId]);

  // Save messages when they change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(messages));
      updateRecentChats();
    }
  }, [messages, currentChatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const createNewChat = (languageCode = 'ENGLISH') => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    setMessages([]);
    setInput("");
    setSelectedLanguage(languageCode);
    
    // Add to recent chats
    const newChat = {
      id: newChatId,
      timestamp: new Date().toISOString(),
      language: languageCode
    };
    const recentChats = JSON.parse(localStorage.getItem('recentChats') || '[]');
    localStorage.setItem('recentChats', JSON.stringify([newChat, ...recentChats]));
  };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setShowLanguagePopup(false);
    createNewChat(languageCode);
  };

  const updateRecentChats = () => {
    const recentChats = JSON.parse(localStorage.getItem('recentChats') || '[]');
    const chatIndex = recentChats.findIndex(chat => chat.id === currentChatId);
    
    if (chatIndex >= 0) {
      recentChats[chatIndex].timestamp = new Date().toISOString();
      recentChats[chatIndex].preview = messages.find(m => m.sender === "user")?.text || "New Chat";
      localStorage.setItem('recentChats', JSON.stringify(recentChats));
    }
  };

  const handleSend = async (messageToSend = input) => {
    const trimmedMessage = messageToSend.trim();
    if (trimmedMessage === "" || isLoading) return;

    setIsLoading(true);
    const userMessage = { 
      text: trimmedMessage, 
      sender: "user",
      timestamp: new Date()
    };
    const currentMessages = [...messages, userMessage];

    setMessages(currentMessages);
    setInput("");

    try {
      const response = await fetch(`${API_BASE}/ask/translate/${selectedLanguage}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: trimmedMessage,
          chat_history: currentMessages.map(msg => ({
            role: msg.sender === "user" ? "user" : "model",
            content: msg.text,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      let botText = data.translated || data.response || 'Received an unexpected response from the server.';
      
      const botReply = { 
        text: botText, 
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botReply]);

    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [
        ...prev,
        {
          text: `Error: ${error.message || "Something went wrong. Please try again."}`,
          sender: "ai",
          timestamp: new Date()
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };
  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCardClick = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ... (rest of your existing functions: toggleSpeechRecognition, handleKeyPress, handleCardClick, formatTime)

  return (
    <div className="app-container">
      <Sidebar 
        currentChatId={currentChatId}
        onNewChat={() => setShowLanguagePopup(true)}
        onChatSelect={(id) => setCurrentChatId(id)}
      />
      
      {/* Language Selection Popup */}
      {showLanguagePopup && (
        <div className="language-popup-overlay">
          <div className="language-popup">
            <h3>Select Conversation Language</h3>
            <div className="language-options">
              {languageOptions.map((lang) => (
                <div 
                  key={lang.code}
                  className={`language-option ${selectedLanguage === lang.code ? 'selected' : ''}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  {lang.name}
                </div>
              ))}
            </div>
            <button 
              className="confirm-button"
              onClick={() => handleLanguageSelect(selectedLanguage)}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <div className="main">
      <div className="main">
        <div className="nav">
          <p>AI Museum Guide</p>
          <img src={assets.user_icon} alt="User" />
        </div>

        <div className="main-container">
          {messages.length === 0 ? (
            <>
              <div className="greet">
                <p><span>Hello, Researcher</span></p>
                <p>What can I help you with?</p>
              </div>
              <div className="cards">
                <div className="card" onClick={() => handleCardClick("Can you tell me about Chhatrapati Shivaji Maharaj?")}>
                  <p>Can you tell me about Chhatrapati Shivaji Maharaj?</p>
                  <img src={assets.history_icon} alt="History" />
                </div>
                <div className="card" onClick={() => handleCardClick("What are the museum's opening hours?")}>
                  <p>What are the museum's opening hours?</p>
                  <img src={assets.history_icon} alt="History" />
                </div>
                <div className="card" onClick={() => handleCardClick("Tell me about the current exhibitions")}>
                  <p>Tell me about the current exhibitions</p>
                  <img src={assets.history_icon} alt="History" />
                </div>
              </div>
            </>
          ) : (
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  <p>{message.text}</p>
                  <span className="timestamp">{formatTime(new Date(message.timestamp))}</span>
                </div>
              ))}
              {isLoading && (
                <div className="message ai loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          <div className="main-bottom">
            <div className="search-box">
              <input
                type="text"
                placeholder={isListening ? "Listening..." : "Ask me about anything here"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                ref={inputRef}
                disabled={isLoading}
              />
              <div className="images">
                {recognitionRef.current && (
                  <img
                    src={assets.mic_icon}
                    alt="Mic"
                    onClick={toggleSpeechRecognition}
                    className={`mic-icon ${isListening ? 'active' : ''}`}
                    style={{ 
                      cursor: isLoading ? 'not-allowed' : 'pointer', 
                      opacity: isLoading ? 0.5 : 1 
                    }}
                  />
                )}
                <img
                  src={assets.send_icon}
                  alt="Send"
                  onClick={() => handleSend()}
                  style={{ 
                    cursor: isLoading || input.trim() === "" ? 'not-allowed' : 'pointer', 
                    opacity: isLoading || input.trim() === "" ? 0.5 : 1 
                  }}
                />
              </div>
            </div>
            <p className="bottom-info">
              Our model will provide answers based on the museum's data.
            </p>
          </div>
        </div>
      </div>
        {/* ... rest of your existing JSX ... */}
      </div>
    </div>
  );
};

export default Main;