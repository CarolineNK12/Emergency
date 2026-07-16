import React, { useState } from "react";

const Profil = () => {
  // Main view state: 'guest' | 'profile'
  const [currentView, setCurrentView] = useState("guest");

  // Pop-up modal state: 'none' | 'login' | 'signup'
  const [modalView, setModalView] = useState("none");

  // Interactive Dropdown state for Sign Up
  const [showFamilyDropdown, setShowFamilyDropdown] = useState(false);

  // Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [familyType, setFamilyType] = useState("Mother");
  const [familyNumber, setFamilyNumber] = useState("");

  // Demo Account & Logged-in User Data
  const [userData, setUserData] = useState({
    name: "Shandy Afrian Mashuri",
    emergencyContact: {
      relation: "Mom",
      number: "0812 3459 3987",
    },
  });

  // Handle Login (Checks for demo account or loads default demo data)
  const handleLogin = () => {
    if (email === "shandy@gmail.com" || email === "") {
      setUserData({
        name: "Shandy Afrian Mashuri",
        emergencyContact: {
          relation: "Mom",
          number: "0812 3459 3987",
        },
      });
    }
    setCurrentView("profile");
    setModalView("none");
  };

  // Handle Sign Up
  const handleSignUp = () => {
    if (fullName && familyNumber) {
      setUserData({
        name: fullName,
        emergencyContact: {
          relation: familyType || "Family",
          number: familyNumber,
        },
      });
    }
    setCurrentView("profile");
    setModalView("none");
  };

  return (
    <div style={styles.container}>
      {/* Title Header */}
      <div style={styles.titleContainer}>
        <h1 style={styles.titleText}>Profile</h1>
      </div>

      <div style={styles.scrollContainer}>
        {/* ================= GUEST VIEW ================= */}
        {currentView === "guest" && (
          <div style={styles.card}>
            <div style={styles.avatarContainer}>
              <div style={styles.avatar} />
              <span style={styles.greetingText}>Hello Guest</span>
            </div>

            <button
              style={styles.redButton}
              onClick={() => {
                setModalView("login");
                setShowFamilyDropdown(false);
              }}
            >
              Login
            </button>

            <span style={styles.orText}>Or</span>

            <button
              style={styles.redButton}
              onClick={() => {
                setModalView("signup");
                setShowFamilyDropdown(false);
              }}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* ================= LOGGED IN PROFILE VIEW ================= */}
        {currentView === "profile" && (
          <div style={styles.card}>
            <div style={styles.avatarContainer}>
              <div style={styles.avatar} />
              <span style={styles.profileName}>{userData.name}</span>
            </div>

            <button style={styles.menuButton}>👤 Account Details &gt;</button>
            <button style={styles.menuButton}>🔒 Change Password &gt;</button>

            {/* Emergency Call Box */}
            <div style={styles.emergencyBox}>
              <span style={styles.emergencyHeader}>
                Please Call This Number
              </span>
              <a
                href={`tel:${userData.emergencyContact.number}`}
                style={styles.phoneIconContainer}
              >
                <span style={styles.phoneIcon}>📞</span>
              </a>
              <span style={styles.emergencyName}>
                {userData.emergencyContact.relation}
              </span>
              <span style={styles.emergencyNumber}>
                {userData.emergencyContact.number}
              </span>
            </div>

            <button
              style={styles.logoutButton}
              onClick={() => {
                setCurrentView("guest");
                setEmail("");
                setPassword("");
              }}
            >
              Log Out to Guest Mode
            </button>
          </div>
        )}
      </div>

      {/* ================= POP-UP MODAL OVERLAY ================= */}
      {modalView !== "none" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            {/* Close Button [X] */}
            <button
              style={styles.closeButton}
              onClick={() => setModalView("none")}
            >
              ✕
            </button>

            {/* LOGIN POPUP */}
            {modalView === "login" && (
              <div style={styles.modalForm}>
                <h2 style={styles.formTitle}>Let's login you up</h2>
                <p style={styles.formSubtitle}>Welcome back</p>

                <div style={styles.demoBanner}>
                  💡 Demo Account: <b>shandy@gmail.com</b> / <b>12345</b>
                </div>

                <label style={styles.label}>Gmail</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="Your Gmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button style={styles.redButton} onClick={handleLogin}>
                  Login
                </button>

                <button
                  style={styles.switchButton}
                  onClick={() => setModalView("signup")}
                >
                  Are you new here? <span style={styles.linkText}>Sign Up</span>
                </button>
              </div>
            )}

            {/* SIGN UP POPUP */}
            {modalView === "signup" && (
              <div style={styles.modalForm}>
                <h2 style={styles.formTitle}>Let's sign you up</h2>
                <p style={styles.formSubtitle}>Welcome</p>

                <label style={styles.label}>Full Name</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <label style={styles.label}>Gmail</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="Your Gmail"
                />

                {/* --- Interactive Dropdown for Family and Siblings --- */}
                <label style={styles.label}>Family and Siblings</label>
                {!showFamilyDropdown ? (
                  <div
                    style={styles.dropdownTrigger}
                    onClick={() => setShowFamilyDropdown(true)}
                  >
                    <span style={{ color: familyType ? "#333" : "#888" }}>
                      {familyType || "Type"}
                    </span>
                    <span>▼</span>
                  </div>
                ) : (
                  <div style={styles.dropdownContainer}>
                    <button
                      style={styles.dropdownItem}
                      onClick={() => {
                        setFamilyType("Mother");
                        setShowFamilyDropdown(false);
                      }}
                    >
                      Mother
                    </button>
                    <button
                      style={styles.dropdownItem}
                      onClick={() => {
                        setFamilyType("Father");
                        setShowFamilyDropdown(false);
                      }}
                    >
                      Father
                    </button>
                    <button
                      style={styles.dropdownItem}
                      onClick={() => {
                        setFamilyType("Siblings");
                        setShowFamilyDropdown(false);
                      }}
                    >
                      Siblings
                    </button>
                  </div>
                )}

                <label style={styles.label}>Number</label>
                <input
                  style={styles.input}
                  type="tel"
                  placeholder="Family or Siblings Number"
                  value={familyNumber}
                  onChange={(e) => setFamilyNumber(e.target.value)}
                />

                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Enter Password"
                />

                <button style={styles.redButton} onClick={handleSignUp}>
                  Sign Up
                </button>

                <button
                  style={styles.switchButton}
                  onClick={() => setModalView("login")}
                >
                  Already have an account?{" "}
                  <span style={styles.linkText}>Login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// CSS-in-JS Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "80vh",
    backgroundColor: "#fff",
    fontFamily: "sans-serif",
    position: "relative",
  },
  titleContainer: {
    paddingTop: "30px",
    paddingBottom: "20px",
    borderBottom: "3px solid #a12b2b",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  titleText: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#a12b2b",
    textDecoration: "underline",
    margin: 0,
  },
  scrollContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 0",
  },
  card: {
    width: "85%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    border: "1px solid #ccc",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "40px",
    boxSizing: "border-box",
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: "20px",
  },
  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "22.5px",
    backgroundColor: "#d32f2f",
    marginRight: "12px",
  },
  greetingText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#000",
  },
  profileName: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
  redButton: {
    backgroundColor: "#d32f2f",
    width: "100%",
    padding: "12px 0",
    borderRadius: "25px",
    alignItems: "center",
    margin: "8px 0",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(211, 47, 47, 0.3)",
  },
  orText: {
    fontSize: "14px",
    color: "#d32f2f",
    margin: "6px 0",
    fontWeight: "bold",
  },
  formTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#d32f2f",
    alignSelf: "flex-start",
    margin: "0 0 4px 0",
  },
  formSubtitle: {
    fontSize: "13px",
    color: "#333",
    alignSelf: "flex-start",
    margin: "0 0 15px 0",
    fontWeight: "600",
  },
  demoBanner: {
    width: "100%",
    backgroundColor: "#fff3f3",
    border: "1px dashed #d32f2f",
    borderRadius: "8px",
    padding: "8px",
    fontSize: "12px",
    color: "#d32f2f",
    marginBottom: "15px",
    textAlign: "center",
    boxSizing: "border-box",
  },
  label: {
    fontSize: "12px",
    color: "#000",
    alignSelf: "flex-start",
    marginBottom: "6px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: "42px",
    border: "1px solid #ccc",
    borderRadius: "20px",
    padding: "0 16px",
    marginBottom: "14px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },
  /* --- DROPDOWN STYLES --- */
  dropdownTrigger: {
    width: "100%",
    height: "42px",
    border: "1px solid #ccc",
    borderRadius: "20px",
    padding: "0 16px",
    marginBottom: "14px",
    fontSize: "14px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "20px",
    padding: "10px",
    marginBottom: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  dropdownItem: {
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "10px 0",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },
  switchButton: {
    background: "none",
    border: "none",
    fontSize: "12px",
    color: "#000",
    marginTop: "12px",
    cursor: "pointer",
    fontWeight: "500",
  },
  linkText: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  menuButton: {
    width: "100%",
    padding: "12px 18px",
    backgroundColor: "#e8e8e8",
    borderRadius: "25px",
    border: "none",
    margin: "6px 0",
    textAlign: "left",
    fontSize: "15px",
    fontWeight: "bold",
    color: "#000",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  emergencyBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "20px",
    border: "1px solid #ccc",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "15px",
    boxSizing: "border-box",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  emergencyHeader: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#000",
    marginBottom: "12px",
    textDecoration: "underline",
  },
  phoneIconContainer: {
    width: "65px",
    height: "65px",
    borderRadius: "32.5px",
    backgroundColor: "#d32f2f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
    textDecoration: "none",
    boxShadow: "0 4px 10px rgba(211, 47, 47, 0.4)",
  },
  phoneIcon: {
    fontSize: "30px",
  },
  emergencyName: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#000",
    margin: "4px 0",
  },
  emergencyNumber: {
    fontSize: "15px",
    color: "#000",
    fontWeight: "600",
  },
  logoutButton: {
    background: "none",
    border: "none",
    marginTop: "18px",
    color: "#666",
    fontSize: "13px",
    textDecoration: "underline",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "25px",
    padding: "25px",
    width: "88%",
    maxWidth: "380px",
    position: "relative",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    maxHeight: "90vh",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "18px",
    background: "none",
    border: "none",
    fontSize: "22px",
    color: "#888",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Profil;
