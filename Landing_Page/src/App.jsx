import React from "react";
import "./App.css"; // <-- Import the CSS file
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import TechCard from "./components/TechCard";
import TechCardCarousel from "./components/TechCardCarousel";
import Logo from "./assets/Logo.png";

function App() {
  return (
    // Add the className here
    <div className="app-background">
      <div className="navbar-title">
        {/* <img src={Logo} alt="" /> */}
        <p>AI Museum Guide</p>
      </div>
      <div className="Main">
        <p>
          Explore the History and Future of Artificial Intelligence – One Chat
          at a Time.{" "}
        </p>
        <h1>Welcome to the AI Museum</h1>
        <h4>
          Meet your virtual guide, Muse, the AI-powered chatbot ready to answer
          your questions and take you through a journey of innovation.
        </h4>
        <button className="chat-button">
          {" "}
          {/* Added className */}
          <span>Chat with Muse</span>{" "}
          {/* Optional: wrap text in span for potential specific styling */}
          <IoArrowForwardCircleSharp size={24} />{" "}
          {/* Control size directly here (e.g., 22px) */}
        </button>
      </div>
      <div>
        <h1>Features</h1>
        <TechCardCarousel />
      </div>
    </div>
  );
}

export default App;
