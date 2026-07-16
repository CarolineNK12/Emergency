import React from 'react';
import { Map } from "@/components/ui/map"; // Imported mapcn interactive Map engine

const locationData = [
  {
    id: 1,
    name: 'Hospital',
    icon: '🏥', 
    hours: 'Open 24 hours',
    distance: '0.5 km',
  },
  {
    id: 2,
    name: 'Police Station',
    icon: '👮', 
    hours: 'Open 24 hours',
    distance: '0.8 km',
  },
  {
    id: 3,
    name: 'Fire Station',
    icon: '🚒', 
    hours: 'Open 24 hours',
    distance: '1.5 km',
  },
];

export default function Maps() {
  return (
    <div className="maps-screen">
      {/* Red Header Bar Header Accent matching your image styling */}
      <div className="maps-top-accent">
        <h1 className="maps-main-title">Maps</h1>
      </div>

      <div className="maps-body-content">
        {/* Interactive Map Wrapper Box Container */}
        <div className="maps-graphic-wrapper">
          
          {/* Dynamic Interactive map engine replacing the broken image snapshot */}
          <Map center={[106.8307, -6.1768]} zoom={14} />

          {/* Floating Location Badge Popover Tooltip */}
          <div className="maps-callout-badge">
            <span className="maps-red-pin">📍</span>
            <span className="maps-callout-text">Gambir, DKI Jakarta</span>
          </div>
        </div>

        {/* Input Search Block */}
        <div className="maps-search-box">
          <input
            type="text"
            placeholder="Search location"
            className="maps-search-input"
          />
          <div className="maps-search-icon-under">🔍</div>
        </div>

        {/* Dynamic Cards Grid Iteration */}
        <div className="maps-scroll-feed">
          {locationData.map((location) => (
            <div key={location.id} className="maps-list-item-card">
              <div className="maps-item-icon-frame">
                <span style={{ fontSize: '32px' }}>{location.icon}</span>
              </div>
              
              <div className="maps-item-details-stack">
                <h3 className="maps-item-title">{location.name}</h3>
                <p className="maps-item-hours-text">{location.hours}</p>
                <a href="#details" className="maps-item-details-link">Details</a>
              </div>

              <div className="maps-item-distance-tag">
                <span style={{ marginRight: '2px' }}>📍</span>
                {location.distance}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}