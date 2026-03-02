import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "../styles";

const backgroundImages = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1",
];

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);
  const [users, setUsers] = useState([]);

  // 🔄 Load all users from backend
  const loadUsers = async () => {
    const res = await fetch("https://fsd-backend-pai8.onrender.com/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 🔐 Logout
  const handleLogout = () => {
    setUser(null);
    navigate("/login-select");
  };

  // 🌄 Background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🧹 Clear one user history
  const clearUserHistory = async (id) => {
    await fetch(`https://fsd-backend-pai8.onrender.com/api/users/${id}`, {
      method: "DELETE",
    });
    loadUsers();
  };

  // 🧹 Clear all history
  const clearAllHistory = async () => {
    await fetch("https://fsd-backend-pai8.onrender.com/api/users", {
      method: "DELETE",
    });
    loadUsers();
  };

  if (!user) return null;

  // 💰 Calculate income
  const totalIncome = users.reduce((total, u) =>
    total +
    (u.borrowedBooks
      ? u.borrowedBooks.reduce(
          (sum, b) => sum + Number(b.amount || 0),
          0
        )
      : 0),
    0
  );

  return (
    <div style={{ ...styles.pageWrapper, position: "relative", minHeight: "100vh" }}>
      
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgroundImages[currentBg]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)",
          zIndex: -1,
        }}
      />

      <div style={styles.formBackground}>
        <div style={{ ...styles.formCard, background: "rgba(0,0,0,0.7)", color: "white" }}>

          {/* OWNER DASHBOARD */}
          {user.role === "Owner" && (
            <>
              <h1>👑 Owner Dashboard</h1>
              <p><strong>Email:</strong> {user.email}</p>

              <h3>💰 Annual Income</h3>
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>₹{totalIncome}</p>

              <button style={styles.mainButton} onClick={clearAllHistory}>
                Clear ALL Users History
              </button>

              {users.map((u) => (
                <div key={u._id} style={{ marginTop: "15px" }}>
                  <h3>{u.email}</h3>

                  <button
                    style={styles.mainButton}
                    onClick={() => clearUserHistory(u._id)}
                  >
                    Remove User
                  </button>

                  {u.borrowedBooks?.map((b, i) => (
                    <div key={i}>
                      <p>📘 {b.bookName}</p>
                      <p>Status: {b.status}</p>
                      <p>Amount: ₹{b.amount}</p>
                    </div>
                  ))}
                </div>
              ))}

              <button style={styles.mainButton} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {/* EMPLOYEE */}
          {user.role === "Employee" && (
            <>
              <h1>👨‍💼 Employee Dashboard</h1>

              {users.map((u) =>
                u.borrowedBooks?.map((b, i) => (
                  <div key={u._id + i}>
                    <p>User: {u.email}</p>
                    <p>📘 {b.bookName}</p>
                    <p>Status: {b.status}</p>
                  </div>
                ))
              )}

              <button style={styles.mainButton} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
