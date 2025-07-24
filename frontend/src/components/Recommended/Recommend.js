import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import './recommend.css';

import Destination1 from "../../assets/Destination1.png";
import Destination2 from "../../assets/Destination2.png";
import Destination3 from "../../assets/Destination3.png";
import Destination4 from "../../assets/Destination4.png";
import Destination5 from "../../assets/Destination5.png";
import Destination6 from "../../assets/Destination6.jpg";
import Destination7 from "../../assets/Destination7.jpg";
import Destination8 from "../../assets/maldives.jpg";
import Destination9 from "../../assets/blog3.jpg";
import Destination10 from "../../assets/Destination10.jpg";
import Destination11 from "../../assets/Destination11.jpg";
import Destination12 from "../../assets/Destination12.jpeg";

import info1 from "../../assets/info1.png";
import info2 from "../../assets/info2.png";

function Recommend() {
  const data = [
    { id: 1, image: Destination1, title: "Singapore", subTitle: "Singapore, officially the Republic of Singapore, is a" },
    { id: 2, image: Destination2, title: "Thailand", subTitle: "Thailand is a Southeast Asian country. It's known for" },
    { id: 3, image: Destination3, title: "Paris", subTitle: "Paris, France's capital, is a major European city and" },
    { id: 4, image: Destination4, title: "New Zealand", subTitle: "New Zealand is an island country in the" },
    { id: 5, image: Destination5, title: "Bora Bora", subTitle: "The main island, located northwest, surrounded by a lagoon and a barrier reef." },
    { id: 6, image: Destination6, title: "Denmark", subTitle: "Denmark is a Nordic country in the south-central portion of Northern Europe with a" },
    { id: 7, image: Destination7, title: "Australia", subTitle: "Among the spectacular Australian tourist attractions, Bondi Beach is home to one of" },
    { id: 8, image: Destination8, title: "Maldives", subTitle: "The Maldives is the smallest country in Asia. Including the sea, the territory spans" },
    { id: 9, image: Destination9, title: "Taj Mahal", subTitle: "Taj Mahal is famous for its beauty and is one of the wonders of the world." },
    { id: 10, image: Destination10, title: "Dubai", subTitle: "Dubai is the most populous city in the United Arab Emirates (UAE) and the capital of" },
    { id: 11, image: Destination11, title: "Pyramids", subTitle: "The largest and most famous of all the pyramids, the Great Pyramid at Giza, was" },
    { id: 12, image: Destination12, title: "Great Wall of China", subTitle: "Great Wall of China, an extensive bulwark erected in ancient China, one of the largest" }
  ];

  const [travel, setTravel] = useState(1);

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Capturing the World's Wonders</h1>
          <p className="hero-subtitle">Discover and explore the most exciting destinations around the globe</p>
        </div>
        <div className="hero-overlay"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-container">
        <div className="nav-tabs">
          {["Featured Destination", "Popular Guides", "Find Epic Tours & Experiences", "Long Term Slow Travel"].map((pkg, index) => (
            <button
              key={index}
              className={`nav-tab ${travel === index + 1 ? "active" : ""}`}
              onClick={() => setTravel(index + 1)}
            >
              {pkg}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {data.map((destination) => (
          <div key={destination.id} className="event-card">
            {/* Image */}
            <Link to={`/destinations/${destination.id}`} className="card-image-link">
              <div className="card-image-container">
                <img src={destination.image} alt={destination.title} className="card-image" />
                <div className="image-overlay">
                  <div className="overlay-content">
                    <span className="view-details">View Details</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Content */}
            <div className="card-content">
              <div className="card-header">
                <h3 className="card-title">{destination.title}</h3>
                <div className="card-badge">Featured</div>
              </div>
              
              <p className="card-description">{destination.subTitle}</p>

              <div className="card-info">
                <div className="info-icons">
                  <img src={info1} alt="Info 1" className="info-icon" />
                  <img src={info2} alt="Info 2" className="info-icon" />
                </div>
              </div>

              {/* Explore Button */}
              <Link to={`/destinations/${destination.id}`} className="explore-link">
                <button className="explore-btn">
                  <span>Explore {destination.title}</span>
                  <svg className="btn-arrow" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Recommend;
