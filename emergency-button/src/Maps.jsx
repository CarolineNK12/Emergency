import React, { useState } from "react";

// Coordinates around Gambir, DKI Jakarta
const locationData = [
  {
    id: 1,
    name: "Hospital",
    icon: "🏥",
    hours: "Open 24 hours",
    distance: "0.5 km",
    lng: 106.8325,
    lat: -6.1762,
    details: "RSPAD Gatot Soebroto",
  },
  {
    id: 2,
    name: "Police Station",
    icon: "👮",
    hours: "Open 24 hours",
    distance: "0.8 km",
    lng: 106.829,
    lat: -6.1715,
    details: "Polsek Metro Gambir",
  },
  {
    id: 3,
    name: "Fire Station",
    icon: "🚒",
    hours: "Open 24 hours",
    distance: "1.5 km",
    lng: 106.819,
    lat: -6.1802,
    details: "Suku Dinas Gulkarmat Gambir",
  },
];

// Helpers to build Google Maps URLs
const gmapsSearchUrl = (loc) =>
  `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}(${encodeURIComponent(
    loc.details,
  )})`;

const gmapsDirectionsUrl = (loc) =>
  `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}&destination_place_id=${encodeURIComponent(
    loc.details,
  )}`;

export default function Maps() {
  const [activeLocation, setActiveLocation] = useState(locationData[0]);

  // Build an OpenStreetMap embed URL that recenters on the active location.
  // A small bounding box (~0.01 deg ≈ ~1 km) keeps a good zoom level.
  const d = 0.008;
  const bbox = [
    activeLocation.lng - d,
    activeLocation.lat - d,
    activeLocation.lng + d,
    activeLocation.lat + d,
  ].join(",");
  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${activeLocation.lat},${activeLocation.lng}`;

  const handleLocationClick = (location) => setActiveLocation(location);

  return (
    <div className="maps-screen">
      {/* Header */}
      <div className="maps-top-accent">
        <h1 className="maps-main-title">Maps</h1>
      </div>

      <div className="maps-body-content">
        {/* Map (OpenStreetMap iframe, no API key needed) */}
        <div
          className="maps-graphic-wrapper"
          style={{ position: "relative", width: "100%", height: "190px" }}
        >
          <iframe
            key={activeLocation.id} /* reload iframe when location changes */
            title="map"
            src={osmSrc}
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              display: "block",
            }}
            loading="lazy"
          />

          {/* Floating "Open in Google Maps" button for the active location */}
          <a
            href={gmapsSearchUrl(activeLocation)}
            target="_blank"
            rel="noopener noreferrer"
            className="maps-callout-badge"
            style={{
              zIndex: 10,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <span className="maps-red-pin">📍</span>
            <span className="maps-callout-text">
              {activeLocation.details} — Open in Google Maps
            </span>
          </a>
        </div>

        {/* Search input (visual only, same as before) */}
        <div className="maps-search-box">
          <input
            type="text"
            placeholder="Search location"
            className="maps-search-input"
          />
          <div className="maps-search-icon-under">🔍</div>
        </div>

        {/* Location cards */}
        <div className="maps-scroll-feed">
          {locationData.map((location) => (
            <div
              key={location.id}
              className="maps-list-item-card"
              onClick={() => handleLocationClick(location)}
              style={{
                cursor: "pointer",
                borderColor:
                  activeLocation.id === location.id ? "#a12b2b" : "#000000",
                borderWidth: activeLocation.id === location.id ? "2px" : "1px",
                transition: "all 0.2s ease",
              }}
            >
              <div className="maps-item-icon-frame">
                <span style={{ fontSize: "32px" }}>{location.icon}</span>
              </div>

              <div className="maps-item-details-stack">
                <h3 className="maps-item-title">{location.name}</h3>
                <p className="maps-item-hours-text">{location.hours}</p>

                {/* Two links: view on Google Maps, and get directions */}
                <div style={{ display: "flex", gap: 10, marginTop: 3 }}>
                  <a
                    href={gmapsSearchUrl(location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="maps-item-details-link"
                    style={{ fontSize: 13 }}
                  >
                    View on Google Maps
                  </a>
                  <a
                    href={gmapsDirectionsUrl(location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="maps-item-details-link"
                    style={{ fontSize: 13, color: "#a12b2b" }}
                  >
                    Directions
                  </a>
                </div>
              </div>

              <div className="maps-item-distance-tag">
                <span style={{ marginRight: "2px" }}>📍</span>
                {location.distance}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
