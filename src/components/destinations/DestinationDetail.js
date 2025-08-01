import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TravelMap from '../../maps/MapComponent';
import destinations from '../../data/destinations';
import './DestinationDetail.css'; // Move styles to external CSS file

const DestinationDetail = () => {
  const { destinationId } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = () => {
      const foundDestination = destinations.find(dest => dest.id === parseInt(destinationId));

      if (foundDestination) {
        setDestination(foundDestination);
      } else {
        setError('Oops! The requested destination was not found.');
      }

      setLoading(false);
    };

    fetchDestination();
  }, [destinationId]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!destination) return null;

  return (
    <div className="destination-detail">
      <Header destination={destination} />
      
      <div className="container">
        <FullExperiencePackage destination={destination} />
        <OptimalTimingPackage destination={destination} />
        <CurrencyGuidePackage destination={destination} />
        <EssentialFacts destination={destination} />
        
        <div className="map-section">
          <TravelMap destination={destination} />
        </div>
        
        <TravelTips destination={destination} />
        <CallToAction />
      </div>
    </div>
  );
};

// Loading Component
const LoadingState = () => (
  <div className="loading-container">
    Loading destination details...
  </div>
);

// Error Component
const ErrorState = ({ error }) => (
  <div className="error-container">
    {error}
  </div>
);

// Header Component
const Header = ({ destination }) => (
  <div className="header-section">
    <h1 className="page-title">Our Destination</h1>
    <p className="intro-text">
      We know that planning a trip can be a lot of work. That's where we come in.
      Whether it's your first time visiting {destination.name} or you've traveled there before, 
      it takes time, local knowledge and experience to create an amazing journey. It can be 
      overwhelming when you don't know where to start, what to see and how far in advance 
      you should be planning these experiences.
    </p>
    <p className="intro-text">
      Whether you need just a bit of guidance or are looking for the full travel package, 
      we can help. We look forward to hearing from you and creating a trip to {destination.name} 
      you'll remember for years to come.
    </p>
  </div>
);

// Full Experience Package Component
const FullExperiencePackage = ({ destination }) => {
  const includesItems = [
    // 'COMPREHENSIVE ITINERARY PLANNING',
    // 'ACCOMMODATION BOOKING ASSISTANCE',
    // 'LOCAL ATTRACTION RECOMMENDATIONS',
    // 'CULTURAL EXPERIENCE GUIDANCE',
    // 'RESTAURANT & DINING SUGGESTIONS',
    // 'TRANSPORTATION COORDINATION'
  ];

  return (
    <div className="service-section">
      <div className="package-container">
        <div 
          className="package-image-section"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL + destination.mainImage || "/assets/default-destination.jpg"})`
          }}
        />
        <div className="package-content-section">
          <div className="testimonial-quote">
            "The smartest thing I did was to research {destination.name} thoroughly. The destination 
            brought its fantastic culture and experiences to enhance my journey. I was able to explore, 
            discover and immerse myself in everything this incredible place had to offer."
          </div>
          <h2 className="package-title">FULL DESTINATION EXPERIENCE</h2>
          <p className="package-description">
            {destination.description}
          </p>
          <IncludesList title="Includes:" items={includesItems} />
        </div>
      </div>
    </div>
  );
};

// Optimal Timing Package Component
const OptimalTimingPackage = ({ destination }) => {
  const timingItems = [
    // destination.bestTimeToVisit || "Information not available",
    // 'SEASONAL WEATHER PATTERNS',
    // 'LOCAL FESTIVALS & EVENTS',
    // 'CROWD LEVELS & PRICING'
  ];

  return (
    <div className="service-section">
      <div className="package-container">
        <div className="package-content-section">
          <h2 className="package-title">OPTIMAL TRAVEL TIMING</h2>
          <p className="package-description">
            The timing of your visit can make all the difference in your travel experience. 
            We provide you with detailed information about the best seasons to visit, weather 
            patterns, and local events to help you plan the perfect trip to {destination.name}.
          </p>
          <IncludesList title="Best Time to Visit:" items={timingItems} />
        </div>
        <div 
          className="package-image-section"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL + destination.mainImage || "/assets/default-destination.jpg"})`
          }}
        />
      </div>
    </div>
  );
};

// Currency Guide Package Component
const CurrencyGuidePackage = ({ destination }) => {
  const currencyItems = [
    destination.currency || "Information not available",
    'EXCHANGE RATES',
    'PAYMENT METHODS',
    'BUDGET PLANNING'
  ];

  return (
    <div className="service-section">
      <div className="package-container">
        <div 
          className="package-image-section"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL + destination.mainImage || "/assets/default-destination.jpg"})`
          }}
        />
        <div className="package-content-section">
          <div className="testimonial-quote">
            "I've traveled to {destination.name} multiple times and can say it's incredible! 
            The destination is diverse, offers amazing experiences, rich in culture and is 
            just a pleasure to explore!"
          </div>
          <h2 className="package-title">CURRENCY & BUDGET GUIDE</h2>
          <p className="package-description">
            Understanding the local currency and planning your budget is essential for a smooth 
            travel experience. We provide comprehensive information to help you manage your 
            finances during your stay.
          </p>
          <IncludesList title="Currency Information:" items={currencyItems} />
        </div>
      </div>
    </div>
  );
};

// Reusable Includes List Component
const IncludesList = ({ title, items }) => (
  <div>
    <p className="includes-title">{title}</p>
    <ul className="includes-list">
      {items.map((item, index) => (
        <li key={index} className="includes-item">
          <span className="includes-bullet">-</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

// Essential Facts Component
const EssentialFacts = ({ destination }) => (
  <div className="facts-section">
    <h3 className="facts-title">Essential Facts About {destination.name}</h3>
    <ul className="facts-list">
      {destination.facts && destination.facts.length > 0 ? (
        destination.facts.map((fact, index) => (
          <li key={index} className="fact-item">
            <span className="fact-bullet">-</span>
            {fact}
          </li>
        ))
      ) : (
        <li className="fact-item">
          <span className="fact-bullet">-</span>
          No facts available for this destination.
        </li>
      )}
    </ul>
  </div>
);

// Travel Tips Component
const TravelTips = ({ destination }) => {
  const tips = [
    {
      icon: '🛂',
      title: 'Visa Requirements',
      text: 'Check visa requirements for your nationality before traveling.'
    },
    {
      icon: '🚇',
      title: 'Getting Around',
      text: 'Research local transportation options to navigate efficiently.'
    },
    {
      icon: '🌡️',
      title: 'Weather',
      text: 'Check seasonal weather patterns and pack accordingly.'
    },
    {
      icon: '💰',
      title: 'Budget',
      text: 'Plan your expenses based on local costs and currency exchange rates.'
    }
  ];

  return (
    <div className="tips-section">
      <h2 className="tips-title">Travel Essentials for {destination.name}</h2>
      <div className="tips-grid">
        {tips.map((tip, index) => (
          <TipCard key={index} {...tip} />
        ))}
      </div>
    </div>
  );
};

// Tip Card Component
const TipCard = ({ icon, title, text }) => (
  <div className="tip-card">
    <div className="tip-icon">{icon}</div>
    <h3 className="tip-title">{title}</h3>
    <p className="tip-text">{text}</p>
  </div>
);

// Call to Action Component
const CallToAction = () => (
  <div className="cta-section">
    <h2 className="cta-title">Start Your Adventure!</h2>
    <p className="cta-subtitle">Call Us</p>
    <p className="cta-contact">Plan Your Journey Today</p>
  </div>
);

export default DestinationDetail; 