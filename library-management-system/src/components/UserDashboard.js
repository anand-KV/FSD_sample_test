import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {

  const fetchUser = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {

      const res = await fetch("https://fsd-backend-pai8.onrender.com/api/users/me", {

        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      if (!res.ok) {
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (data.role.toLowerCase() !== "user") {
        navigate("/login");
        return;
      }

      setUser(data);

    } catch (error) {

      console.error(error);
      navigate("/login");

    }

  };

  fetchUser();

}, [navigate]);

  if (!user) return null;

  return (
    <div style={{ ...styles.pageWrapper, padding: "40px" }}>
      <h1>📚 Welcome {user.name}</h1>
      <p>Email: {user.email}</p>

      <div style={styles.featuresSection}>
        <div style={styles.featureCard} onClick={() => navigate("/search")}>
          <h2>🔍 Search Books</h2>
        </div>

        <div style={styles.featureCard} onClick={() => navigate("/borrow")}>
          <h2>📘 Borrow Books</h2>
        </div>

        <div style={styles.featureCard} onClick={() => navigate("/history")}>
          <h2>📋 Borrow History</h2>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;