import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";

const Sidebar = ({ currentChatId, onNewChat, onChatSelect }) => {
  const [extended, setExtended] = useState(false);
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem('recentChats') || '[]');
    setRecentChats(chats);
  }, [currentChatId]);

  const getChatTitle = (chatId) => {
    const messages = JSON.parse(localStorage.getItem(`chat_${chatId}`)) || [];
    const firstMessage = messages.find(m => m.sender === "user")?.text || "New Chat";
    return firstMessage.length > 25 
      ? `${firstMessage.substring(0, 25)}...` 
      : firstMessage;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`Sidebar ${extended ? 'extended' : ''}`}>
      <div className="top">
        <img 
          onClick={() => setExtended(!extended)} 
          className="menu" 
          src={assets.menu_icon} 
          alt="Menu" 
        />
        <div className="new-chat" onClick={onNewChat}>
          <img src={assets.plus_icon} alt="New chat" />
          {extended && <p>New chat</p>}
        </div>
        
        {extended && (
          <div className="recent">
            <p className="recent-title">Recent Chats</p>
            {recentChats.map(chat => (
              <div 
                key={chat.id}
                className={`recent-entry ${currentChatId === chat.id ? 'active' : ''}`}
                onClick={() => onChatSelect(chat.id)}
              >
                <img src={assets.message_icon} alt="Chat" />
                <div className="chat-info">
                  <p className="chat-title">{getChatTitle(chat.id)}</p>
                  <p className="chat-time">{formatTime(chat.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="Help" />
          {extended && <p>Help</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="History" />
          {extended && <p>Activity</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="Settings" />
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;