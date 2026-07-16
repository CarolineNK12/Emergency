import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

const Profil = () => {
  // Navigation state: 'guest' | 'login' | 'signup' | 'profile'
  const [currentView, setCurrentView] = useState("guest");

  // User Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [familyType, setFamilyType] = useState("Mother");
  const [familyNumber, setFamilyNumber] = useState("");

  // Logged in user data
  const [userData, setUserData] = useState({
    name: "Shandy Adrian Mashuri",
    emergencyContact: {
      relation: "Mom",
      number: "0812 3456 7890",
    },
  });

  const handleLogin = () => {
    // For hackathon demo: instantly switch to profile view
    setCurrentView("profile");
  };

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
  };

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* ================= GUEST VIEW ================= */}
        {currentView === "guest" && (
          <View style={styles.card}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar} />
              <Text style={styles.greetingText}>Hello Guest</Text>
            </View>

            <TouchableOpacity
              style={styles.redButton}
              onPress={() => setCurrentView("login")}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>Or</Text>

            <TouchableOpacity
              style={styles.redButton}
              onPress={() => setCurrentView("signup")}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= LOGIN VIEW ================= */}
        {currentView === "login" && (
          <View style={styles.card}>
            <Text style={styles.formTitle}>Let's log you in</Text>
            <Text style={styles.formSubtitle}>Welcome back</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.redButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCurrentView("signup")}>
              <Text style={styles.switchText}>
                Don't have an account?{" "}
                <Text style={styles.linkText}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= SIGN UP VIEW ================= */}
        {currentView === "signup" && (
          <View style={styles.card}>
            <Text style={styles.formTitle}>Let's sign you up</Text>
            <Text style={styles.formSubtitle}>Welcome</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#888"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Email"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Family / Siblings (e.g., Mom, Dad)</Text>
            <TextInput
              style={styles.input}
              placeholder="Type (Mother / Father / Sibling)"
              placeholderTextColor="#888"
              value={familyType}
              onChangeText={setFamilyType}
            />

            <Text style={styles.label}>Emergency Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="0812 xxx xxx"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={familyNumber}
              onChangeText={setFamilyNumber}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#888"
              secureTextEntry
            />

            <TouchableOpacity style={styles.redButton} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCurrentView("login")}>
              <Text style={styles.switchText}>
                Already have an account?{" "}
                <Text style={styles.linkText}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= LOGGED IN PROFILE VIEW ================= */}
        {currentView === "profile" && (
          <View style={styles.card}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, styles.activeAvatar]} />
              <Text style={styles.profileName}>{userData.name}</Text>
            </View>

            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuButtonText}>👤 Account Details &gt;</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuButtonText}>🔒 Change Password &gt;</Text>
            </TouchableOpacity>

            {/* Emergency Call Box */}
            <View style={styles.emergencyBox}>
              <Text style={styles.emergencyHeader}>
                Please Call This Number
              </Text>
              <TouchableOpacity style={styles.phoneIconContainer}>
                <Text style={styles.phoneIcon}>📞</Text>
              </TouchableOpacity>
              <Text style={styles.emergencyName}>
                {userData.emergencyContact.relation}
              </Text>
              <Text style={styles.emergencyNumber}>
                {userData.emergencyContact.number}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => setCurrentView("guest")}
            >
              <Text style={styles.logoutText}>Log Out to Guest Mode</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
  },
  titleContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: "#a12b2b",
    width: "100%",
    alignItems: "center",
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#a12b2b",
    textDecorationLine: "underline",
  },
  scrollContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#a12b2b",
    marginRight: 10,
  },
  activeAvatar: {
    backgroundColor: "#0284C7", // Blue avatar when logged in
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  redButton: {
    backgroundColor: "#d32f2f",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    fontSize: 14,
    color: "#a12b2b",
    marginVertical: 5,
    fontWeight: "600",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d32f2f",
    alignSelf: "flex-start",
  },
  formSubtitle: {
    fontSize: 14,
    color: "#666",
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: "#333",
    alignSelf: "flex-start",
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  switchText: {
    fontSize: 12,
    color: "#666",
    marginTop: 10,
  },
  linkText: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  menuButton: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginVertical: 5,
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  emergencyBox: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    alignItems: "center",
    marginTop: 15,
  },
  emergencyHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  phoneIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  phoneIcon: {
    fontSize: 28,
  },
  emergencyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  emergencyNumber: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    marginTop: 15,
  },
  logoutText: {
    color: "#888",
    fontSize: 12,
    textDecorationLine: "underline",
  },
});

export default Profil;
