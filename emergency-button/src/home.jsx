import { useState } from "react";
import "./App.css";

// Indonesian emergency service numbers
const SERVICES = [
  {
    key: "police",
    name: "Police",
    desc: "Polisi",
    icon: "🚔",
    number: "110",
    color: "#1f4e91",
  },
  {
    key: "ambulance",
    name: "Ambulance",
    desc: "Ambulans",
    icon: "🚑",
    number: "118",
    color: "#c62828",
  },
  {
    key: "fire",
    name: "Fire Fighter",
    desc: "Pemadam Kebakaran",
    icon: "🚒",
    number: "113",
    color: "#d84315",
  },
];

function Home() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const service = SERVICES[idx];
  const prev = () => setIdx((i) => (i - 1 + SERVICES.length) % SERVICES.length);
  const next = () => setIdx((i) => (i + 1) % SERVICES.length);

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
            setIdx(0);
            setOpen(true);
          }}
        >
          CALL
        </button>

        <p style={styles.hint}>Tap CALL to choose a service</p>
      </div>

      {/* --- Modal / Carousel popup --- */}
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

              {/* The card is an <a href="tel:..."> so tapping it calls */}
              <a
                href={`tel:${service.number}`}
                style={{
                  ...styles.serviceCard,
                  background: `linear-gradient(160deg, ${service.color}, #000)`,
                }}
              >
                <div style={styles.serviceIcon}>{service.icon}</div>
                <div style={styles.serviceName}>{service.name}</div>
                <div style={styles.serviceDesc}>{service.desc}</div>

                <div style={styles.numberPill}>
                  <span style={{ fontSize: 14, opacity: 0.85 }}>📞</span>
                  <span style={styles.numberText}>{service.number}</span>
                </div>

                <div style={styles.tapHint}>TAP TO CALL</div>
              </a>

              <button style={styles.arrow} onClick={next} aria-label="Next">
                ›
              </button>
            </div>

            {/* Dots indicator */}
            <div style={styles.dots}>
              {SERVICES.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setIdx(i)}
                  aria-label={s.name}
                  style={{
                    ...styles.dot,
                    background: i === idx ? "#a12b2b" : "#ccc",
                    transform: i === idx ? "scale(1.25)" : "scale(1)",
                  }}
                />
              ))}
            </div>

            {/* Quick-select mini row */}
            <div style={styles.miniRow}>
              {SERVICES.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setIdx(i)}
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

      {/* Small keyframes needed for the modal + card float */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .service-card-anim { animation: floatCard 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ---------- inline styles (kept in one place for readability) ----------
const styles = {
  screen: {
    width: "100%",
    maxWidth: 480,
    margin: "0 auto",
    padding: "16px 20px 24px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },

  // Top red card
  alertCard: {
    width: "100%",
    background: "linear-gradient(135deg, #a12b2b 0%, #700909 100%)",
    borderRadius: 18,
    padding: "18px 20px",
    color: "#fff",
    position: "relative",
    boxShadow: "0 8px 20px rgba(112,9,9,.25)",
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

  // Modal
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
    color: "#fff",
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
    filter: "drop-shadow(0 4px 6px rgba(0,0,0,.35))",
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 800,
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
    fontWeight: 900,
    letterSpacing: 1,
  },
  tapHint: {
    marginTop: 6,
    fontSize: 11,
    letterSpacing: 1.5,
    opacity: 0.9,
    fontWeight: 700,
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
};

export default Home;
