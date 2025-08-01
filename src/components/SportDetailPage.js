import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SportLocationsMap from './SportLocationsMap';
import './SportDetailPage.css';

// Import all location data files
import boatingLocations from '../data/boating-loc.json';
 import trekkingLocations from '../data/trekking-locations.json';
import cavingLocations from '../data/caving-locations.json';
import skyDivingLocations from '../data/Sky-Diving-loc.json';
import surfingLocations from '../data/Surfing-loc.json';
import waterRaftingLocations from '../data/Water-Rafting-loc.json';
import zipLiningLocations from '../data/zip-lining-locations.json';
import mountainBikingLocations from '../data/mountain-biking-locations.json';
import duneBashingLocations from '../data/dune-bashing-locations.json';
import hangGlidingLocations from '../data/hang-gliding-locations.json';
import kiteLandboardingLocations from '../data/kite-landboarding-locations.json';
import mountainClimbingLocations from '../data/mountain-climbing-locations.json';
import parachuteDivingLocations from '../data/parachute-diving-locations.json';
import scubaDivingLocations from '../data/Scuba-Diving-loc.json';
import skiingLocations from '../data/Skiing-loc.json';
// Import other sport location data files as needed

const SportDetailPage = () => {
  const { sportName } = useParams();
  const [sportData, setSportData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // Map the URL parameter to the correct data file
    const getSportData = () => {
      switch (sportName.toLowerCase().replace(/-/g, ' ')) {
        case 'boating':
          return boatingLocations;
        case 'trekking':
          return trekkingLocations;
         case 'caving':
          return cavingLocations;
          case 'sky diving':
            return skyDivingLocations;
        case 'surfing':
            return surfingLocations;
        case 'water rafting':
            return waterRaftingLocations;
        case 'zip lining':
            return zipLiningLocations;
        case 'mountain biking':
            return mountainBikingLocations;
            case 'dune bashing':
              return duneBashingLocations;
          case 'hang gliding':
              return hangGlidingLocations;
          case 'kite landboarding':
              return kiteLandboardingLocations;
          case 'mountain climbing':
              return mountainClimbingLocations;
          case 'parachute diving':
              return parachuteDivingLocations;
          case 'scuba diving':
              return scubaDivingLocations;
          case 'skiing':
              return skiingLocations;
        // Add cases for other sports
        default:
          return null;
      }
    };

    setSportData(getSportData());
  }, [sportName]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    // Scroll to location details on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.querySelector('.location-details').scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  if (!sportData) {
    return <div className="loading">Loading sport information...</div>;
  }

  return (
    <div className="sport-detail-page">
      <div className="sport-header">
        <Link to="/sports" className="back-button">← Back to Sports</Link>
        <h1>{sportData.sport} in India</h1>
        <p className="intro-text">
          Discover the best destinations for {sportData.sport.toLowerCase()} across India.
          Click on the markers to view details about each location.
        </p>
      </div>

      <SportLocationsMap
        sportData={sportData}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default SportDetailPage;