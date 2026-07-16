import React, { useState, useEffect, useRef, useMemo } from "react";

// ---- Regions --------------------------------------------------------------
const REGIONS = {
  jabodetabek: {
    label: "All JABODETABEK",
    icon: "🗺️",
    center: [-6.3, 106.82],
    zoom: 10,
    bbox: [-6.75, 106.4, -6.05, 107.15],
  },
  jakarta: {
    label: "Jakarta",
    icon: "🏙️",
    center: [-6.2088, 106.8456],
    zoom: 12,
    bbox: [-6.37, 106.68, -6.09, 106.99],
  },
  bogor: {
    label: "Bogor",
    icon: "🌄",
    center: [-6.5971, 106.806],
    zoom: 12,
    bbox: [-6.72, 106.7, -6.5, 106.92],
  },
  depok: {
    label: "Depok",
    icon: "🌳",
    center: [-6.4025, 106.7942],
    zoom: 12,
    bbox: [-6.48, 106.7, -6.34, 106.92],
  },
  tangerang: {
    label: "Tangerang",
    icon: "🏘️",
    center: [-6.1783, 106.63],
    zoom: 12,
    bbox: [-6.32, 106.5, -6.05, 106.78],
  },
  bekasi: {
    label: "Bekasi",
    icon: "🏬",
    center: [-6.2383, 106.9756],
    zoom: 12,
    bbox: [-6.38, 106.86, -6.1, 107.12],
  },
};

// The widest bbox — fetched ONCE, then filtered client-side per region.
const MASTER_BBOX = REGIONS.jabodetabek.bbox;

// ---- Overpass -------------------------------------------------------------
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.osm.ch/api/interpreter",
];

async function fetchOverpass(query) {
  let lastErr = null;
  for (const url of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(url, { method: "POST", body: query });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Overpass sometimes returns 200 with a "remark" runtime error → treat as failure
      if (data.remark && (!data.elements || data.elements.length === 0)) {
        throw new Error(`Overpass remark: ${data.remark}`);
      }
      return data.elements || [];
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("All Overpass mirrors failed");
}

// ---- Google Maps helpers --------------------------------------------------
const gmapsSearchUrl = (loc) =>
  `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}(${encodeURIComponent(
    loc.details,
  )})`;

const gmapsDirectionsUrl = (loc, from) =>
  from
    ? `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${loc.lat},${loc.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;

// ---- Utils ----------------------------------------------------------------
function loadOnce(src, isCss) {
  return new Promise((resolve, reject) => {
    const attr = isCss ? "href" : "src";
    if (
      document.querySelector(`${isCss ? "link" : "script"}[${attr}="${src}"]`)
    ) {
      return resolve();
    }
    const el = isCss
      ? document.createElement("link")
      : document.createElement("script");
    if (isCss) {
      el.rel = "stylesheet";
      el.href = src;
    } else {
      el.src = src;
      el.async = true;
    }
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function inBbox(loc, bbox) {
  const [s, w, n, e] = bbox;
  return loc.lat >= s && loc.lat <= n && loc.lng >= w && loc.lng <= e;
}

const CATEGORY_META = {
  hospital: { name: "Hospital", icon: "🏥", key: "hospital", color: "#e74c3c" },
  clinic: { name: "Hospital", icon: "🏥", key: "hospital", color: "#e74c3c" },
  police: {
    name: "Police Station",
    icon: "👮",
    key: "police",
    color: "#3498db",
  },
  fire_station: {
    name: "Fire Station",
    icon: "🚒",
    key: "fire",
    color: "#e67e22",
  },
};

const CATEGORY_FILTERS = [
  { key: "all", label: "All", icon: "📍" },
  { key: "hospital", label: "Hospital", icon: "🏥" },
  { key: "police", label: "Police", icon: "👮" },
  { key: "fire", label: "Fire", icon: "🚒" },
];

// ---- Component ------------------------------------------------------------
export default function Maps() {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const meMarkerRef = useRef(null);

  const [regionKey, setRegionKey] = useState("jabodetabek");
  const region = REGIONS[regionKey];
  const isSummary = regionKey === "jabodetabek";

  const [allLocations, setAllLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [reloadTick, setReloadTick] = useState(0);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [me, setMe] = useState(null);
  const [locating, setLocating] = useState(false);

  // 1) Load Leaflet + fetch JABODETABEK-wide data ONCE
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErrorMsg("");

    async function init() {
      try {
        await loadOnce(
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
          true,
        );
        await loadOnce(
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
          false,
        );
      } catch {
        if (!cancelled) {
          setErrorMsg("Could not load map library.");
          setLoading(false);
        }
        return;
      }
      if (cancelled) return;
      const L = window.L;

      if (!mapRef.current) {
        const map = L.map(mapDivRef.current, {
          center: region.center,
          zoom: region.zoom,
          minZoom: 8,
          zoomControl: true,
          attributionControl: false,
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);
        mapRef.current = map;
      }

      const [s, w, n, e] = MASTER_BBOX;
      const bbox = `${s},${w},${n},${e}`;
      const q = `
        [out:json][timeout:60];
        (
          node["amenity"~"^(hospital|police|fire_station)$"](${bbox});
          way["amenity"~"^(hospital|police|fire_station)$"](${bbox});
        );
        out center tags;
      `;

      let elements = [];
      try {
        elements = await fetchOverpass(q);
      } catch {
        if (!cancelled) {
          setErrorMsg("Could not fetch real places. Please try again.");
          setLoading(false);
        }
        return;
      }

      const seen = new Set();
      const items = elements
        .map((el) => {
          const meta = CATEGORY_META[el.tags?.amenity];
          if (!meta) return null;
          const details = el.tags?.name;
          if (!details) return null;
          const lat = el.lat ?? el.center?.lat;
          const lng = el.lon ?? el.center?.lon;
          if (lat == null || lng == null) return null;
          return {
            id: `${el.type}-${el.id}`,
            name: meta.name,
            icon: meta.icon,
            color: meta.color,
            category: meta.key,
            details,
            lat,
            lng,
            hours: el.tags?.opening_hours || "Open 24 hours",
          };
        })
        .filter(Boolean)
        .filter((i) => {
          const k = `${i.category}:${i.details}`;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });

      if (cancelled) return;
      setAllLocations(items);
      setLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [reloadTick]); // no regionKey here — one fetch only

  // 2) When region changes → just fly the map, no re-fetch
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo(region.center, region.zoom, { duration: 0.8 });
    }
    setActiveId(null);
    setQuery("");
    setFilter("all");
  }, [regionKey]);

  // 3) Filter master list to the current region's bbox + enrich with distance
  const regionalLocations = useMemo(() => {
    const from = me || { lat: region.center[0], lng: region.center[1] };
    const filtered = isSummary
      ? allLocations
      : allLocations.filter((l) => inBbox(l, region.bbox));
    return filtered
      .map((l) => ({
        ...l,
        distance:
          distanceKm(from.lat, from.lng, l.lat, l.lng).toFixed(1) + " km",
        distanceNum: distanceKm(from.lat, from.lng, l.lat, l.lng),
      }))
      .sort((a, b) => a.distanceNum - b.distanceNum);
  }, [allLocations, regionKey, me]);

  // Counts per category for the current region
  const counts = useMemo(
    () => ({
      all: regionalLocations.length,
      hospital: regionalLocations.filter((l) => l.category === "hospital")
        .length,
      police: regionalLocations.filter((l) => l.category === "police").length,
      fire: regionalLocations.filter((l) => l.category === "fire").length,
    }),
    [regionalLocations],
  );

  // 4) Apply search + category filter
  const visibleLocations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return regionalLocations.filter((l) => {
      if (filter !== "all" && l.category !== filter) return false;
      if (!q) return true;
      return (
        l.details.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      );
    });
  }, [regionalLocations, query, filter]);

  // 5) Render markers whenever visible set changes
  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!map || !L) return;

    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    visibleLocations.forEach((loc) => {
      let marker;
      if (isSummary) {
        // Lightweight dots for the huge JABODETABEK overview
        marker = L.circleMarker([loc.lat, loc.lng], {
          radius: 5,
          fillColor: loc.color,
          color: "#fff",
          weight: 1,
          fillOpacity: 0.9,
        }).addTo(map);
      } else {
        const emojiIcon = L.divIcon({
          html: `<div style="font-size:26px;line-height:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.4));">${loc.icon}</div>`,
          className: "",
          iconSize: [30, 30],
          iconAnchor: [15, 28],
          popupAnchor: [0, -24],
        });
        marker = L.marker([loc.lat, loc.lng], { icon: emojiIcon }).addTo(map);
      }
      marker.bindPopup(
        `<div style="font-family:sans-serif;font-size:12px;color:#000;min-width:150px;">
           <strong style="color:#a12b2b;font-size:13px;display:block;">${loc.name}</strong>
           <span>${loc.details}</span><br/>
           <a href="${gmapsSearchUrl(loc)}" target="_blank" rel="noopener"
              style="color:#a12b2b;text-decoration:underline;">Open in Google Maps</a>
         </div>`,
      );
      marker.on("click", () => {
        setActiveId(loc.id);
        map.flyTo([loc.lat, loc.lng], 17, { duration: 0.8 });
      });
      markersRef.current[loc.id] = marker;
    });
  }, [visibleLocations, isSummary]);

  // "Use my location"
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const you = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMe(you);
        setLocating(false);
        const map = mapRef.current;
        const L = window.L;
        if (map && L) {
          if (meMarkerRef.current) map.removeLayer(meMarkerRef.current);
          meMarkerRef.current = L.marker([you.lat, you.lng], {
            icon: L.divIcon({
              html: `<div style="width:16px;height:16px;background:#2b7bff;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 2px #2b7bff88;"></div>`,
              className: "",
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            }),
          })
            .addTo(map)
            .bindPopup("You are here");
          map.flyTo([you.lat, you.lng], 15, { duration: 0.8 });
        }
      },
      () => {
        setLocating(false);
        alert("Couldn't get your location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleLocationClick = (loc) => {
    setActiveId(loc.id);
    const map = mapRef.current;
    const marker = markersRef.current[loc.id];
    if (map) map.flyTo([loc.lat, loc.lng], 17, { duration: 0.8 });
    if (marker) marker.openPopup();
  };

  const chipStyle = (active, accent = "#a12b2b") => ({
    padding: "6px 12px",
    borderRadius: 999,
    border: active ? `2px solid ${accent}` : "1px solid #000",
    background: active ? accent : "#fff",
    color: active ? "#fff" : "#000",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  });

  return (
    <div className="maps-screen">
      <div className="maps-top-accent">
        <h1 className="maps-main-title">Maps</h1>
      </div>

      <div className="maps-body-content">
        {/* Interactive map */}
        <div
          className="maps-graphic-wrapper"
          style={{ position: "relative", width: "100%", height: "260px" }}
        >
          <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />

          {loading && (
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                background: "#fff",
                padding: "4px 8px",
                fontSize: 12,
                borderRadius: 6,
                zIndex: 500,
                border: "1px solid #ccc",
              }}
            >
              Loading real places…
            </div>
          )}

          <button
            onClick={handleUseMyLocation}
            disabled={locating}
            title="Use my location"
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              zIndex: 500,
              background: "#fff",
              border: "1px solid #a12b2b",
              color: "#a12b2b",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: locating ? "wait" : "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,.15)",
            }}
          >
            {locating
              ? "Locating…"
              : me
                ? "📍 My location"
                : "📍 Use my location"}
          </button>
        </div>

        {/* Region selector */}
        <div style={{ width: "100%", marginTop: 16, marginBottom: 8 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#333",
              marginBottom: 6,
              textAlign: "center",
            }}
          >
            REGION
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {Object.entries(REGIONS).map(([key, r]) => (
              <button
                key={key}
                onClick={() => setRegionKey(key)}
                style={chipStyle(regionKey === key, "#0b5aa8")}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* JABODETABEK: summary card only */}
        {isSummary ? (
          <div style={{ width: "100%", marginTop: 8 }}>
            <div
              style={{
                border: "1px solid #000",
                borderRadius: 14,
                padding: 16,
                background: "#fff",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  color: "#700909",
                  fontWeight: 700,
                }}
              >
                JABODETABEK Summary
              </h2>
              <p style={{ margin: "6px 0 16px", fontSize: 13, color: "#555" }}>
                Real emergency locations across Jakarta, Bogor, Depok, Tangerang
                & Bekasi
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 32 }}>🏥</div>
                  <div
                    style={{ fontSize: 26, fontWeight: 800, color: "#e74c3c" }}
                  >
                    {loading ? "…" : counts.hospital}
                  </div>
                  <div style={{ fontSize: 12 }}>Hospitals</div>
                </div>
                <div>
                  <div style={{ fontSize: 32 }}>👮</div>
                  <div
                    style={{ fontSize: 26, fontWeight: 800, color: "#3498db" }}
                  >
                    {loading ? "…" : counts.police}
                  </div>
                  <div style={{ fontSize: 12 }}>Police</div>
                </div>
                <div>
                  <div style={{ fontSize: 32 }}>🚒</div>
                  <div
                    style={{ fontSize: 26, fontWeight: 800, color: "#e67e22" }}
                  >
                    {loading ? "…" : counts.fire}
                  </div>
                  <div style={{ fontSize: 12 }}>Fire Stations</div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 16,
                  fontSize: 12,
                  color: "#a12b2b",
                  fontWeight: 600,
                }}
              >
                Pick a specific region above to see the list ↑
              </div>
            </div>

            {!loading && errorMsg && (
              <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
                <div style={{ marginBottom: 10 }}>{errorMsg}</div>
                <button
                  onClick={() => setReloadTick((t) => t + 1)}
                  style={{
                    background: "#a12b2b",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 20,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Search input */}
            <div className="maps-search-box" style={{ marginTop: 16 }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search in ${region.label} (e.g. RSPAD, polsek, damkar…)`}
                className="maps-search-input"
              />
              <div className="maps-search-icon-under">🔍</div>
            </div>

            {/* Category filter chips — counts are per REGION */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                width: "100%",
                marginBottom: 16,
                justifyContent: "center",
              }}
            >
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={chipStyle(filter === f.key)}
                >
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                  <span style={{ opacity: 0.75 }}>({counts[f.key]})</span>
                </button>
              ))}
            </div>

            {/* Location cards */}
            <div className="maps-scroll-feed">
              {visibleLocations.map((location) => (
                <div
                  key={location.id}
                  className="maps-list-item-card"
                  onClick={() => handleLocationClick(location)}
                  style={{
                    cursor: "pointer",
                    borderColor:
                      activeId === location.id ? "#a12b2b" : "#000000",
                    borderWidth: activeId === location.id ? "2px" : "1px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <a
                    href={gmapsSearchUrl(location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Open in Google Maps"
                    className="maps-item-icon-frame"
                    style={{ textDecoration: "none" }}
                  >
                    <span style={{ fontSize: "32px" }}>{location.icon}</span>
                  </a>

                  <div className="maps-item-details-stack">
                    <h3 className="maps-item-title">{location.name}</h3>
                    <p className="maps-item-hours-text">{location.details}</p>
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
                        href={gmapsDirectionsUrl(location, me)}
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

              {!loading && errorMsg && (
                <div
                  style={{ textAlign: "center", padding: 20, color: "#666" }}
                >
                  <div style={{ marginBottom: 10 }}>{errorMsg}</div>
                  <button
                    onClick={() => setReloadTick((t) => t + 1)}
                    style={{
                      background: "#a12b2b",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 20,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !errorMsg && visibleLocations.length === 0 && (
                <div
                  style={{ textAlign: "center", padding: 20, color: "#666" }}
                >
                  No results
                  {query ? ` for "${query}"` : ""}
                  {filter !== "all"
                    ? ` in ${CATEGORY_FILTERS.find((f) => f.key === filter).label}`
                    : ""}{" "}
                  in {region.label}.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
