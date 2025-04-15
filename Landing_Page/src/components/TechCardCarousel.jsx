import React, { useRef } /* Removed useState if not used elsewhere */ from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
// import 'swiper/css/pagination'; // REMOVED Pagination CSS import
import 'swiper/css/navigation';

// Import required modules
import { Autoplay, /* Pagination, */ Navigation } from 'swiper/modules'; // REMOVED Pagination module

// Import your custom styles and the TechCard component
import './SwiperStyles.css';
import './TechCard.css';
import TechCard from './TechCard';

// --- Sample Data for the 3 Cards (Keep this as is) ---
const cardData = [
  {
    id: 1,
    category: 'AI GENERATION',
    title: 'Experiment with Gemini 2.0 Flash native image generation',
    imageSrc: 'https://via.placeholder.com/150/771796',
    link: '#card1'
  },
  {
    id: 2,
    category: 'DEVELOPMENT TOOLS',
    title: 'Explore new features in the latest React framework update',
    imageSrc: 'https://via.placeholder.com/150/24f355',
    link: '#card2'
  },
  {
    id: 3,
    category: 'CLOUD SERVICES',
    title: 'Leverage serverless functions for scalable applications',
    imageSrc: 'https://via.placeholder.com/150/d32776',
    link: '#card3'
  },
];
// --- End Sample Data ---


export default function TechCardCarousel() {
  // REMOVED refs for progress indicator
  // const progressCircle = useRef(null);
  // const progressContent = useRef(null);

  // REMOVED autoplay time left handler function
  // const onAutoplayTimeLeft = (s, time, progress) => { ... };

  return (
    <div className="swiper-container-wrapper">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        // pagination={{ // REMOVED pagination configuration
        //  clickable: true,
        // }}
        navigation={true} // Keep navigation arrows (or set to false if not needed)
        modules={[Autoplay, Navigation]} // REMOVED Pagination from modules array
        // onAutoplayTimeLeft={onAutoplayTimeLeft} // REMOVED handler prop
        className="mySwiper"
      >
        {cardData.map((card) => (
          <SwiperSlide key={card.id}>
            <TechCard
              category={card.category}
              title={card.title}
              imageSrc={card.imageSrc}
              link={card.link}
            />
          </SwiperSlide>
        ))}

        {/* REMOVED Autoplay Progress Indicator JSX Block */}
        {/*
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
        */}
      </Swiper>
    </div>
  );
}