import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

const backgroundImages = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1",
];

function About() {
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
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImages[currentBg]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)",
          transition: "background-image 1s ease-in-out",
          zIndex: -1,
        }}
      />

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logo}>📚 MyLibrary</div>
        <nav style={styles.nav}>
          <button style={styles.navButton} onClick={() => navigate("/login-select")}>
            Login
          </button>
          <button style={styles.navButton} onClick={() => navigate("/register-select")}>
            Register
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <h1 style={styles.heroTitle}>About Our Library</h1>
          <p style={styles.heroSubtitle}>
            Discover our modern digital library management system that makes
            learning easier, faster, and more organized.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <center>
        <section style={styles.aboutSection}>
          <div style={styles.aboutContainer}>
            <p style={styles.aboutText}>
              Our Library Management System is a professional digital solution
              that streamlines library operations and enhances user experience.
              It centralizes management of books, users, and staff with
              efficiency, accuracy, and security.
            </p>

            <h2 style={styles.aboutSubTitle}>Library Facilities</h2>

            <div style={styles.facilitiesGrid}>
              <div style={styles.facilityCard}>📚 Comprehensive collection of books</div>
              <div style={styles.facilityCard}>💻 Digital library & e-books</div>
              <div style={styles.facilityCard}>🔍 Advanced search & catalog</div>
              <div style={styles.facilityCard}>🪑 Reading halls & study areas</div>
              <div style={styles.facilityCard}>👥 Group discussion rooms</div>
              <div style={styles.facilityCard}>⚙️ Automated book tracking</div>
              <div style={styles.facilityCard}>🤝 Staff assistance & support</div>
            </div>

            <h2 style={styles.aboutSubTitle}>Objective</h2>
            <p style={styles.aboutText}>
              Our goal is to modernize traditional library processes, reduce
              manual workload, improve resource accessibility, and maintain
              accurate records through technology-driven solutions.
            </p>

            <div style={{ textAlign: "center" }}>
              <button style={styles.mainButton} onClick={() => navigate("/")}>
                ⬅ Back to Home
              </button>
            </div>
          </div>
        </section>
      </center>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>© 2025 MyLibrary. All Rights Reserved.</p>
          <p>Follow us on: 📘 🐦 📸</p>
        </div>
      </footer>
    </div>
  );
}

export default About;
