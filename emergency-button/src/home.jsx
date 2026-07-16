import { useState } from "react";
import "./App.css";

const SERVICES = [
  {
    key: "police",
    name: "Police",
    desc: "Police Department",
    icon: "👮",
    number: "110",
  },
  {
    key: "ambulance",
    name: "Ambulance",
    desc: "Medical Services",
    icon: "🏥",
    number: "118",
  },
  {
    key: "fire",
    name: "Fire Fighter",
    desc: "Fire Department",
    icon: "🚒",
    number: "113",
  },
];

function Home() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [isFlickering, setIsFlickering] = useState(false);

  const service = SERVICES[idx];
  const prev = () => handleIndexChange((idx - 1 + SERVICES.length) % SERVICES.length);
  const next = () => handleIndexChange((idx + 1) % SERVICES.length);

  // Triggers the flicker transition state when changing selections
  const handleIndexChange = (newIdx) => {
    setIsFlickering(true);
    setIdx(newIdx);
    setTimeout(() => {
      setIsFlickering(false);
    }, 250); // Matches the short keyframe animation timing
  };

  const leftIdx = (idx - 1 + SERVICES.length) % SERVICES.length;
  const rightIdx = (idx + 1) % SERVICES.length;
  const orderedServices = [
    { ...SERVICES[leftIdx], originalIndex: leftIdx, position: "left" },
    { ...SERVICES[idx], originalIndex: idx, position: "center" },
    { ...SERVICES[rightIdx], originalIndex: rightIdx, position: "right" }
  ];

  return (
    <div style={styles.screen}>
      {/* --- Emergency Alert Card (top) --- */}
      <div style={styles.alertCard}>
        <div style={styles.alertBadge}>Emergency Alert</div>
        <h2 style={styles.alertTitle}>
          Help is always
          <br />
          there for you
        </h2>
        <span style={styles.tag247}>⏰ 24/7 Service</span>
      </div>

      {/* --- Emergency Button section --- */}
      <div style={styles.callSection}>
        <h1 style={styles.callTitle}>Emergency Button</h1>

        <button
          className="sosbutton"
          onClick={() => {
            setOpen(true);
          }}
        >
          CALL
        </button>

        <p style={styles.hint}>Tap CALL to open choose service overlay</p>
      </div>

      {/* --- HIGHLY FOCUSED SLIDER SECTION WITH SELECTION FLICKER --- */}
      <div style={styles.inlineBoxesContainer}>
        <h3 style={styles.carouselTitle}>Instant Options</h3>
        <p style={styles.carouselSub}>
          Tap the left or right cards to switch focus, or tap the prominent center card to call
        </p>

        <div style={styles.sliderFlexWrapper}>
          {orderedServices.map((item) => {
            const isCenter = item.position === "center";
            return (
              <a
                key={item.key}
                href={isCenter ? `tel:${item.number}` : undefined}
                onClick={(e) => {
                  if (!isCenter) {
                    e.preventDefault();
                    handleIndexChange(item.originalIndex);
                  }
                }}
                className={isFlickering ? "flicker-anim" : ""}
                style={{
                  ...styles.panicBoxCard,
                  borderColor: isCenter ? "#a12b2b" : "#e5e4e7",
                  background: isCenter ? "#fff5f5" : "#ffffff",
                  // Enhanced scale ratio: side cards are kept significantly more compact
                  width: isCenter ? "38%" : "25%", 
                  height: isCenter ? "150px" : "95px", 
                  opacity: isCenter ? 1 : 0.35,
                  zIndex: isCenter ? 2 : 1,
                  padding: isCenter ? "16px 8px" : "8px 4px",
                  boxShadow: isCenter ? "0 6px 14px rgba(161,43,43,0.12)" : "none"
                }}
              >
                <div style={{ ...styles.boxIcon, fontSize: isCenter ? "34px" : "22px" }}>{item.icon}</div>
                <div style={{ ...styles.boxName, fontSize: isCenter ? "14px" : "11px", fontWeight: isCenter ? "700" : "500" }}>{item.name}</div>
                <div style={{ 
                  ...styles.boxNumberText, 
                  fontSize: isCenter ? "16px" : "13px", 
                  color: isCenter ? "#a12b2b" : "#999" 
                }}>
                  {item.number}
                </div>
                {isCenter && <div style={styles.tapToCallTag}>TAP TO DIAL</div>}
              </a>
            );
          })}
        </div>
      </div>

      {/* --- Original Modal Popup Overlay (Updated for crisp bold white readability) --- */}
      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <h3 style={styles.modalTitle}>Choose emergency service</h3>
            <p style={styles.modalSub}>
              Use ‹ / › to switch, then tap the card to call
            </p>

            <div style={styles.carousel}>
              <button style={styles.arrow} onClick={prev} aria-label="Previous">
                ‹
              </button>

              <a
                href={`tel:${service.number}`}
                style={{
                  ...styles.serviceCard,
                  background: `linear-gradient(160deg, #1f4e91, #080d1a)`,
                }}
              >
                <div style={styles.serviceIcon}>{service.icon}</div>
                {/* Text attributes forced to bold white for clear layout legibility */}
                <div style={{ ...styles.serviceName, color: "#ffffff", fontWeight: "bold" }}>{service.name}</div>
                <div style={{ ...styles.serviceDesc, color: "#ffffff", fontWeight: "bold" }}>{service.desc}</div>

                <div style={styles.numberPill}>
                  <span style={{ fontSize: 14, color: "#fff", fontWeight: "bold" }}>📞</span>
                  <span style={{ ...styles.numberText, color: "#ffffff", fontWeight: "bold" }}>{service.number}</span>
                </div>

                <div style={{ ...styles.tapHint, color: "#ffffff", fontWeight: "bold" }}>TAP TO CALL</div>
              </a>

              <button style={styles.arrow} onClick={next} aria-label="Next">
                ›
              </button>
            </div>

            <div style={styles.dots}>
              {SERVICES.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => handleIndexChange(i)}
                  aria-label={s.name}
                  style={{
                    ...styles.dot,
                    background: i === idx ? "#a12b2b" : "#ccc",
                    transform: i === idx ? "scale(1.25)" : "scale(1)",
                  }}
                />
              ))}
            </div>

            <div style={styles.miniRow}>
              {SERVICES.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => handleIndexChange(i)}
                  style={{
                    ...styles.miniBtn,
                    borderColor: i === idx ? "#a12b2b" : "#ddd",
                    background: i === idx ? "#fff5f5" : "#fff",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <span style={styles.miniLabel}>{s.name}</span>
                  <span style={styles.miniNum}>{s.number}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles injection for selection flicker logic */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cardFlicker {
          0% { opacity: 0.3; transform: scale(0.92); filter: brightness(1.2); }
          50% { opacity: 0.8; filter: brightness(0.9); }
          100% { opacity: 1; }
        }
        .flicker-anim {
          animation: cardFlicker 0.22s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
}

const styles = {
  screen: {
    width: "100%",
    maxWidth: 480,
    margin: "0 auto",
    padding: "16px 20px 100px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  alertCard: {
    width: "100%",
    background: "linear-gradient(135deg, #a12b2b 0%, #700909 100%)",
    borderRadius: 18,
    padding: "18px 20px",
    color: "#fff",
    position: "relative",
    boxShadow: "0 8px 20px rgba(112,9,9,.25)",
    boxSizing: "border-box"
  },
  alertBadge: {
    display: "inline-block",
    background: "rgba(255,255,255,.18)",
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  alertTitle: {
    margin: 0,
    fontSize: 22,
    lineHeight: 1.2,
    fontWeight: 800,
    color: "#fff",
  },
  tag247: {
    position: "absolute",
    bottom: 12,
    right: 14,
    background: "#fff",
    color: "#a12b2b",
    borderRadius: 999,
    padding: "4px 10px",
    fontSize: 11,
    fontWeight: 700,
    boxShadow: "0 2px 5px rgba(0,0,0,.1)",
  },
  callSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    marginTop: 8,
  },
  callTitle: {
    margin: 0,
    color: "#700909",
    fontSize: 22,
    fontWeight: 800,
  },
  hint: {
    margin: 0,
    fontSize: 12,
    color: "#666",
  },
  inlineBoxesContainer: {
    width: "100%",
    border: "1px solid #e5e4e7",
    borderRadius: 22,
    padding: "20px 14px 24px 14px",
    backgroundColor: "#fff",
    boxShadow: "rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    boxSizing: "border-box"
  },
  carouselTitle: {
    margin: "0 0 4px 0",
    fontSize: 18,
    fontWeight: 800,
    color: "#700909",
    textAlign: "center",
  },
  carouselSub: {
    margin: "0 0 20px 0",
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: "140%"
  },
  sliderFlexWrapper: {
    display: "flex",
    width: "100%",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
    height: "160px",
  },
  panicBoxCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    border: "1px solid #ddd",
    textDecoration: "none",
    color: "#333333",
    cursor: "pointer",
    boxSizing: "border-box",
    transition: "all 0.28s cubic-bezier(0.4, 0, 0.2, 1)"
  },
  boxIcon: {
    lineHeight: 1,
    marginBottom: 4,
    transition: "font-size 0.28s ease"
  },
  boxName: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 2,
    whiteSpace: "nowrap",
    transition: "font-size 0.28s ease"
  },
  boxNumberText: {
    fontWeight: "800",
    transition: "all 0.28s ease"
  },
  tapToCallTag: {
    fontSize: "8px",
    fontWeight: "bold",
    color: "#a12b2b",
    marginTop: "6px",
    letterSpacing: "0.5px",
  },
  carousel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "#fff",
    fontSize: 24,
    lineHeight: 1,
    cursor: "pointer",
    color: "#a12b2b",
    fontWeight: 700,
    boxShadow: "0 2px 5px rgba(0,0,0,.08)",
  },
  serviceCard: {
    flex: 1,
    minHeight: 220,
    borderRadius: 20,
    textDecoration: "none",
    padding: "18px 14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    boxShadow: "0 10px 20px rgba(0,0,0,.15)",
    cursor: "pointer",
    userSelect: "none",
  },
  serviceIcon: {
    fontSize: 68,
    lineHeight: 1,
  },
  serviceName: {
    fontSize: 20,
    marginTop: 4,
  },
  serviceDesc: {
    fontSize: 12,
    opacity: 0.85,
  },
  numberPill: {
    marginTop: 8,
    background: "rgba(255,255,255,.18)",
    borderRadius: 999,
    padding: "6px 14px",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  numberText: {
    fontSize: 22,
    letterSpacing: 1,
  },
  tapHint: {
    marginTop: 6,
    fontSize: 11,
    letterSpacing: 1.5,
    opacity: 0.9,
  },
  dots: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginBottom: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    border: "none",
    padding: 0,
    cursor: "pointer",
    transition: "transform .15s ease",
  },
  miniRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
  },
  miniBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: "8px 4px",
    borderRadius: 12,
    border: "1px solid #ddd",
    cursor: "pointer",
    background: "#fff",
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#333",
  },
  miniNum: {
    fontSize: 12,
    fontWeight: 800,
    color: "#a12b2b",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.55)",
    backdropFilter: "blur(3px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    animation: "fadeIn .2s ease-out",
  },
  modal: {
    width: "100%",
    maxWidth: 380,
    background: "#fff",
    borderRadius: 22,
    padding: "20px 18px 22px",
    position: "relative",
    boxShadow: "0 20px 40px rgba(0,0,0,.35)",
    animation: "popIn .25s ease-out",
  },
  close: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "none",
    background: "#f2f2f2",
    color: "#333",
    fontSize: 22,
    lineHeight: 1,
    cursor: "pointer",
  },
  modalTitle: {
    margin: "4px 0 4px",
    fontSize: 18,
    fontWeight: 800,
    color: "#700909",
    textAlign: "center",
  },
  modalSub: {
    margin: "0 0 16px",
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
};

export default Home;