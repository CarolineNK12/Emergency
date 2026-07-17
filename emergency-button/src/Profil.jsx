import React, { useState } from "react";

// 🔧 Change this if your Flask backend runs on a different host/port
const API_BASE = "http://localhost:5000";

const Profil = () => {
  const [currentView, setCurrentView] = useState("guest");
  // Modal views: 'none' | 'login' | 'signup' | 'account' | 'changepw'
  const [modalView, setModalView] = useState("none");
  const [showFamilyDropdown, setShowFamilyDropdown] = useState(false);

  // Auth form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [familyType, setFamilyType] = useState("Mother");
  const [familyNumber, setFamilyNumber] = useState("");

  // Change-password fields
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // UI feedback
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Logged-in user info (needed by change-password endpoint)
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [userData, setUserData] = useState({
    name: "Shandy Afrian Mashuri",
    email: "shandy@gmail.com",
    emergencyContact: { relation: "Mom", number: "0812 3459 3987" },
  });

  const clearFeedback = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };
  const closeModal = () => {
    setModalView("none");
    clearFeedback();
    setOldPw("");
    setNewPw("");
    setConfirmPw("");
  };

  // ------------------- BACKEND CALLS -------------------
  const handleLogin = async () => {
    clearFeedback();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Login failed");
        return;
      }
      setUserData({
        name: data.user.name,
        email: data.user.email,
        emergencyContact: data.user.emergencyContact,
      });
      setLoggedInEmail(data.user.email);
      setCurrentView("profile");
      setPassword("");
      closeModal();
    } catch {
      setErrorMsg("Cannot reach server. Is the Flask backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    clearFeedback();
    if (!fullName || !email || !password || !familyNumber) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          familyType,
          familyNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Sign up failed");
        return;
      }
      setUserData({
        name: data.user.name,
        email: data.user.email,
        emergencyContact: data.user.emergencyContact,
      });
      setLoggedInEmail(data.user.email);
      setCurrentView("profile");
      setPassword("");
      closeModal();
    } catch {
      setErrorMsg("Cannot reach server. Is the Flask backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    clearFeedback();
    if (!oldPw || !newPw || !confirmPw) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    if (newPw !== confirmPw) {
      setErrorMsg("New password and confirmation do not match");
      return;
    }
    if (newPw.length < 5) {
      setErrorMsg("New password must be at least 5 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loggedInEmail || userData.email,
          oldPassword: oldPw,
          newPassword: newPw,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to change password");
        return;
      }
      setSuccessMsg("Password updated successfully!");
      setOldPw("");
      setNewPw("");
      setConfirmPw("");
    } catch {
      setErrorMsg("Cannot reach server. Is the Flask backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <h1 style={styles.titleText}>Profile</h1>
      </div>

      {/* ===== GUEST ===== */}
      {currentView === "guest" && (
        <div style={styles.scrollContainer}>
          <div style={styles.card}>
            <div style={styles.figmaHeaderContainer}>
              <span style={styles.greetingText}>Hello, Guest!</span>
              <div style={styles.avatar} />
            </div>
            <button
              style={styles.redButton}
              onClick={() => {
                setModalView("login");
                clearFeedback();
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
                clearFeedback();
                setShowFamilyDropdown(false);
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* ===== LOGGED IN ===== */}
      {currentView === "profile" && (
        <div style={styles.scrollContainer}>
          <div style={styles.card}>
            <div style={styles.avatarContainer}>
              <div style={styles.avatarLoggedIn} />
              <span style={styles.profileName}>{userData.name}</span>
            </div>

            {/* ✅ Now has onClick */}
            <button
              style={styles.menuButton}
              onClick={() => {
                clearFeedback();
                setModalView("account");
              }}
            >
              👤 Account Details &gt;
            </button>

            {/* ✅ Now has onClick */}
            <button
              style={styles.menuButton}
              onClick={() => {
                clearFeedback();
                setModalView("changepw");
              }}
            >
              🔒 Change Password &gt;
            </button>

            <div style={styles.emergencyBox}>
              <span style={styles.emergencyHeader}>
                Please Call This Number
              </span>
              <a
                style={styles.phoneIconContainer}
                href={`tel:${userData.emergencyContact.number}`}
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
                setLoggedInEmail("");
              }}
            >
              Log Out to Guest Mode
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL OVERLAY ===== */}
      {modalView !== "none" && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={closeModal}>
              ✕
            </button>

            {/* --- LOGIN --- */}
            {modalView === "login" && (
              <div style={styles.modalForm}>
                <h2 style={styles.formTitle}>Let's login you up</h2>
                <p style={styles.formSubtitle}>Welcome back</p>

                <div style={styles.demoBanner}>
                  💡 Demo: <b>shandy@gmail.com</b> / <b>12345</b>
                </div>

                <label style={styles.label}>Gmail</label>
                <input
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {errorMsg && <div style={styles.errorMsg}>{errorMsg}</div>}

                <button
                  style={{ ...styles.redButton, opacity: loading ? 0.6 : 1 }}
                  disabled={loading}
                  onClick={handleLogin}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <button
                  style={styles.switchButton}
                  onClick={() => {
                    setModalView("signup");
                    clearFeedback();
                  }}
                >
                  Are you new here? <span style={styles.linkText}>Sign Up</span>
                </button>
              </div>
            )}

            {/* --- SIGN UP --- */}
            {modalView === "signup" && (
              <div style={styles.modalForm}>
                <h2 style={styles.formTitle}>Let's sign you up</h2>
                <p style={styles.formSubtitle}>Welcome</p>

                <label style={styles.label}>Full Name</label>
                <input
                  style={styles.input}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <label style={styles.label}>Gmail</label>
                <input
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label style={styles.label}>Family and Siblings</label>
                {!showFamilyDropdown ? (
                  <div
                    style={styles.dropdownTrigger}
                    onClick={() => setShowFamilyDropdown(true)}
                  >
                    <span>{familyType || "Type"}</span>
                    <span>▼</span>
                  </div>
                ) : (
                  <div style={styles.dropdownContainer}>
                    {["Mother", "Father", "Siblings"].map((t) => (
                      <button
                        key={t}
                        style={styles.dropdownItem}
                        onClick={() => {
                          setFamilyType(t);
                          setShowFamilyDropdown(false);
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}

                <label style={styles.label}>Number</label>
                <input
                  style={styles.input}
                  value={familyNumber}
                  onChange={(e) => setFamilyNumber(e.target.value)}
                />

                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {errorMsg && <div style={styles.errorMsg}>{errorMsg}</div>}

                <button
                  style={{ ...styles.redButton, opacity: loading ? 0.6 : 1 }}
                  disabled={loading}
                  onClick={handleSignUp}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>

                <button
                  style={styles.switchButton}
                  onClick={() => {
                    setModalView("login");
                    clearFeedback();
                  }}
                >
                  Already have an account?{" "}
                  <span style={styles.linkText}>Login</span>
                </button>
              </div>
            )}

            {/* --- ACCOUNT DETAILS --- */}
            {modalView === "account" && (
              <div style={styles.modalForm}>
                <h2 style={styles.formTitle}>Account Details</h2>
                <p style={styles.formSubtitle}>Your registered information</p>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Full Name</span>
                  <span style={styles.detailValue}>{userData.name}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Email</span>
                  <span style={styles.detailValue}>
                    {userData.email || loggedInEmail || "—"}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Emergency Relation</span>
                  <span style={styles.detailValue}>
                    {userData.emergencyContact.relation}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Emergency Number</span>
                  <span style={styles.detailValue}>
                    {userData.emergencyContact.number}
                  </span>
                </div>

                <button
                  style={{ ...styles.redButton, marginTop: 16 }}
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            )}

            {/* --- CHANGE PASSWORD --- */}
            {modalView === "changepw" && (
              <div style={styles.modalForm}>
                <h2 style={styles.formTitle}>Change Password</h2>
                <p style={styles.formSubtitle}>
                  Signed in as: <b>{loggedInEmail || userData.email}</b>
                </p>

                <label style={styles.label}>Current Password</label>
                <input
                  type="password"
                  style={styles.input}
                  value={oldPw}
                  onChange={(e) => setOldPw(e.target.value)}
                />

                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  style={styles.input}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />

                <label style={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  style={styles.input}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                />

                {errorMsg && <div style={styles.errorMsg}>{errorMsg}</div>}
                {successMsg && (
                  <div style={styles.successMsg}>{successMsg}</div>
                )}

                <button
                  style={{ ...styles.redButton, opacity: loading ? 0.6 : 1 }}
                  disabled={loading}
                  onClick={handleChangePassword}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
    padding: "30px 0",
  },
  card: {
    width: "88%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    borderRadius: "28px",
    border: "1px solid #777",
    padding: "30px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginBottom: "40px",
    boxSizing: "border-box",
  },
  figmaHeaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginBottom: "25px",
    gap: "16px",
  },
  avatar: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    backgroundColor: "#700909",
  },
  greetingText: { fontSize: "22px", fontWeight: "bold", color: "#000" },
  avatarContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: "20px",
  },
  avatarLoggedIn: {
    width: "45px",
    height: "45px",
    borderRadius: "22.5px",
    backgroundColor: "#d32f2f",
    marginRight: "12px",
  },
  profileName: { fontSize: "16px", fontWeight: "bold", color: "#000" },
  redButton: {
    backgroundColor: "#cc1111",
    width: "100%",
    padding: "14px 0",
    borderRadius: "25px",
    margin: "4px 0",
    color: "#fff",
    border: "none",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  orText: {
    fontSize: "15px",
    color: "#cc1111",
    margin: "8px 0",
    fontWeight: "600",
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
    fontWeight: 600,
  },
  demoBanner: {
    width: "100%",
    backgroundColor: "#fff3f3",
    border: "1px dashed #d32f2f",
    borderRadius: 8,
    padding: 8,
    fontSize: 12,
    color: "#d32f2f",
    marginBottom: 15,
    textAlign: "center",
    boxSizing: "border-box",
  },
  label: {
    fontSize: 12,
    color: "#000",
    alignSelf: "flex-start",
    marginBottom: 6,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 42,
    border: "1px solid #ccc",
    borderRadius: 20,
    padding: "0 16px",
    marginBottom: 14,
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none",
  },
  dropdownTrigger: {
    width: "100%",
    height: 42,
    border: "1px solid #ccc",
    borderRadius: 20,
    padding: "0 16px",
    marginBottom: 14,
    fontSize: 14,
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
    borderRadius: 20,
    padding: 10,
    marginBottom: 14,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  dropdownItem: {
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    padding: "10px 0",
    fontSize: 15,
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },
  switchButton: {
    background: "none",
    border: "none",
    fontSize: 12,
    color: "#000",
    marginTop: 12,
    cursor: "pointer",
    fontWeight: 500,
  },
  linkText: { color: "#d32f2f", fontWeight: "bold" },
  menuButton: {
    width: "100%",
    padding: "12px 18px",
    backgroundColor: "#e8e8e8",
    borderRadius: 25,
    border: "none",
    margin: "6px 0",
    textAlign: "left",
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  emergencyBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    border: "1px solid #ccc",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 15,
    boxSizing: "border-box",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  emergencyHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    textDecoration: "underline",
  },
  phoneIconContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#d32f2f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    textDecoration: "none",
    boxShadow: "0 4px 10px rgba(211,47,47,0.4)",
  },
  phoneIcon: { fontSize: 30 },
  emergencyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    margin: "4px 0",
  },
  emergencyNumber: { fontSize: 15, color: "#000", fontWeight: 600 },
  logoutButton: {
    background: "none",
    border: "none",
    marginTop: 18,
    color: "#666",
    fontSize: 13,
    textDecoration: "underline",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: 16,
    boxSizing: "border-box",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    width: "min(380px, 100%)",
    maxWidth: 380,
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
    top: 15,
    right: 18,
    background: "none",
    border: "none",
    fontSize: 22,
    color: "#888",
    cursor: "pointer",
    fontWeight: "bold",
  },
  detailRow: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  detailLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: { fontSize: 15, color: "#000", fontWeight: 600, marginTop: 2 },
  errorMsg: {
    width: "100%",
    background: "#ffe8e8",
    color: "#a12b2b",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 12,
    marginBottom: 10,
    border: "1px solid #f5c2c2",
    boxSizing: "border-box",
  },
  successMsg: {
    width: "100%",
    background: "#e8f7ee",
    color: "#1e7d3a",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 12,
    marginBottom: 10,
    border: "1px solid #b7e0c1",
    boxSizing: "border-box",
  },
};

export default Profil;
