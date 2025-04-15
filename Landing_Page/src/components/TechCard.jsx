import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import './TechCard.css'; // Styles for the card itself

// Default image if none provided
const defaultImage = 'path/to/default/placeholder.jpg';

// Modified to accept props
function TechCard({ category, title, imageSrc, link = "#" }) {
  return (
    <>
    
    <div className="tech-card-container">
      <div className="tech-card-image-section">
        <img
          src={imageSrc || defaultImage}
          alt={title || 'Tech Card Image'}
          className="tech-card-image"
        />
      </div>
      <div className="tech-card-content-section">
        <p className="tech-card-category">{category || 'TECHNOLOGY'}</p>
        <h3 className="tech-card-title">{title || 'Card Title Placeholder'}</h3>
        <a href={link} className="tech-card-icon-button" aria-label="Learn More">
          {/* <FiExternalLink size={24} /> */}
        </a>
      </div>
    </div>
    </>
  );
}

export default TechCard;