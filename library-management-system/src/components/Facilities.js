import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

const backgroundImages = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1",
];

function Facilities() {
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        ...styles.pageWrapper,
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgroundImages[currentBg]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <header style={styles.header}>
        <div style={styles.logo}>📚 LMS</div>
        <nav style={styles.nav}>
          <button
            style={styles.navButton}
            onClick={() => navigate("/")}
          >
            Home
          </button>
          </nav>
      </header>

      {/* CONTENT */}
      <div
        style={{
          ...styles.aboutBackground,
          background: "transparent",
        }}
      >
        <div
          style={{
            ...styles.aboutContainer,
            background: "rgba(0,0,0,0.6)",
            color: "white",
          }}
        >
          <h2 style={styles.aboutTitle}>🏫 Library Facilities</h2>
          <ul style={{...styles.aboutText, listStyleType: "none"}}>
            <li>📖 Silent Study Rooms</li>
            <li>💻 Digital Computer Lab</li>
            <li>📶 Free Wi-Fi</li>
            <li>🪑 Comfortable Reading Zones</li>
            <li>☕ Refreshment Area</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Facilities;
