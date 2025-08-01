import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './SportLocationsMap.css';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const SportLocationsMap = ({ sportData, onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Center map on India
  const indiaCenter = [20.5937, 78.9629];
  const zoom = 5;

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  return (
    <div className="map-container">
      <h2>Top {sportData.sport} Destinations in India</h2>
      <MapContainer center={indiaCenter} zoom={zoom} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {sportData.locations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinates}
            eventHandlers={{
              click: () => handleMarkerClick(location),
            }}
          >
            <Popup>
              <div>
                <h3>{location.name}</h3>
                <p><strong>State:</strong> {location.state}</p>
                <p><strong>Best Time to Visit:</strong> {location.bestTimeToVisit}</p>
                <button
                  className="view-details-btn"
                  onClick={() => handleMarkerClick(location)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {selectedLocation && (
        <div className="location-details">
          <h3>{selectedLocation.name}</h3>
          <img
            src={selectedLocation.imageUrl}
            alt={selectedLocation.name}
            className="location-image"
          />
          <p><strong>State:</strong> {selectedLocation.state}</p>
          <p>{selectedLocation.description}</p>
          <p><strong>Best Time to Visit:</strong> {selectedLocation.bestTimeToVisit}</p>
        </div>
      )}
    </div>
  );
};

export default SportLocationsMap;