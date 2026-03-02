import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "../styles";

const backgroundImages = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1",
];

function RegisterSelect({ setRole }) {
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);

  // Background slideshow interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Make body transparent
  useEffect(() => {
    document.body.style.margin = 0;
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
    document.body.style.background = "transparent";

    return () => {
      document.body.style.background = "";
      document.body.style.margin = "";
      document.body.style.height = "";
      document.body.style.width = "";
    };
  }, []);

  const handleSelect = (selectedRole) => {
    setRole(selectedRole);
    navigate("/register");
  };

  return (
    <>
      {/* FULLSCREEN BACKGROUND */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${backgroundImages[currentBg]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)",
          zIndex: -1,
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          ...styles.pageWrapper,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100vw",
          backgroundColor: "transparent",
        }}
      >
        <div style={styles.roleCard}>
          <h2 style={{ marginBottom: "20px", color: "#f9f9fcff" }}>
            Select Registration Type
          </h2>

          <button style={styles.roleButton} onClick={() => handleSelect("User")}>
            👤 User Registration
          </button>

          <button style={styles.roleButton} onClick={() => handleSelect("Employee")}>
            🧑‍💼 Employee Registration
          </button>

          <button style={styles.roleButton} onClick={() => handleSelect("Owner")}>
            👑 Owner Registration
          </button>

          <p
            style={{
              marginTop: "15px",
              color: "#f9fafcff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            ⬅ Back
          </p>
        </div>
      </div>
    </>
  );
}

export default RegisterSelect;
