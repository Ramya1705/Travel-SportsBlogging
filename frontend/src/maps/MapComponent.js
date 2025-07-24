// src/components/maps/MapComponent.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapComponent.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const TravelMap = ({ destination }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('all');
  
  // Filter places by category
  const filteredPlaces = destination.mustVisitPlaces.filter(place => {
    if (currentCategory === 'all') return true;
    return place.category === currentCategory;
  });
  
  // Get unique categories
  const categories = ['all', ...new Set(destination.mustVisitPlaces.map(place => place.category))];
  
  const getMapCenter = () => {
    if (filteredPlaces.length > 0) {
      // Calculate average position
      const latSum = filteredPlaces.reduce((sum, place) => sum + place.location.lat, 0);
      const lngSum = filteredPlaces.reduce((sum, place) => sum + place.location.lng, 0);
      return [latSum / filteredPlaces.length, lngSum / filteredPlaces.length];
    }
    // Default center
    return [1.3521, 103.8198];  // Singapore's center coordinates
  };
  
  return (
    <div className="travel-map-section">
      <div className="container">
        <h2>Must-Visit Places in {destination.name}</h2>
        
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${currentCategory === category ? 'active' : ''}`}
              onClick={() => setCurrentCategory(category)}
            >
              {category === 'all' ? 'All Places' : category}
            </button>
          ))}
        </div>
        
        <div className="map-container">
          <MapContainer center={getMapCenter()} zoom={12} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredPlaces.map(place => (
              <Marker 
                key={place.id} 
                position={[place.location.lat, place.location.lng]}
                eventHandlers={{
                  click: () => {
                    setSelectedPlace(place);
                  },
                }}
              >
                <Popup>
                  <div>
                    <h3>{place.name}</h3>
                    <p>{place.category}</p>
                    <button className="popup-button" onClick={() => setSelectedPlace(place)}>View Details</button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        <div className="places-list">
          <h3>Top Attractions</h3>
          <div className="places-grid">
            {filteredPlaces.map(place => (
              <div key={place.id} className="place-card" onClick={() => setSelectedPlace(place)}>
                <div className="place-image" style={{ backgroundImage: `url(${place.image})` }}>
                  <div className="place-category">{place.category}</div>
                </div>
                <div className="place-info">
                  <h4>{place.name}</h4>
                  <p className="place-description">{place.description.substring(0, 80)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedPlace && (
        <div className="place-modal">
          <div className="place-modal-content">
            <span className="close-button" onClick={() => setSelectedPlace(null)}>&times;</span>
            <div className="place-modal-header" style={{ backgroundImage: `url(${selectedPlace.image})` }}>
              <div className="place-modal-title">
                <h2>{selectedPlace.name}</h2>
                <span className="place-category-tag">{selectedPlace.category}</span>
              </div>
            </div>
            <div className="place-modal-body">
              <p className="place-full-description">{selectedPlace.description}</p>
              
              <div className="place-details">
                <div className="detail-item">
                  <h4>Visitor Tips</h4>
                  <p>{selectedPlace.tips}</p>
                </div>
                <div className="detail-item">
                  <h4>Entry Fee</h4>
                  <p>{selectedPlace.entryFee}</p>
                </div>
                <div className="detail-item">
                  <h4>Opening Hours</h4>
                  <p>{selectedPlace.openingHours}</p>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="visit-button primary">Plan Your Visit</button>
                <button className="visit-button secondary" onClick={() => {
                  window.open(`https://www.google.com/maps/search/?api=1&query=${selectedPlace.location.lat},${selectedPlace.location.lng}`, '_blank');
                }}>View on Google Maps</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelMap;