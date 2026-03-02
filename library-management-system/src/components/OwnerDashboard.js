import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

function OwnerDashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {

  const fetchData = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Get current user
      const userRes = await fetch("https://fsd-backend-pai8.onrender.com/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!userRes.ok) {
        navigate("/login");
        return;
      }

      const userData = await userRes.json();

      if (userData.role !== "owner") {
        navigate("/login");
        return;
      }

      setUser(userData);

      // Get users
      const usersRes = await fetch("https://fsd-backend-pai8.onrender.com/api/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      }

      // Get books (optional)
      const booksRes = await fetch("https://fsd-backend-pai8.onrender.com/api/books", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(Array.isArray(booksData) ? booksData : []);
      }

    } catch (error) {

      console.error(error);
      navigate("/login");

    }

  };

  fetchData();

}, [navigate]);

  if (!user) return null;

  const employees = users.filter(u => u.role === "employee");
  const normalUsers = users.filter(u => u.role === "user");

  return (

    <div style={{ ...styles.pageWrapper, padding: "40px" }}>

      <h1>👑 Owner Control Panel</h1>

      <p>Welcome {user.name}</p>

      <div style={styles.featuresSection}>

        <div style={styles.featureCard}>
          <h2>👤 Total Users</h2>
          <p>{normalUsers.length}</p>
        </div>

        <div style={styles.featureCard}>
          <h2>👨‍💼 Employees</h2>
          <p>{employees.length}</p>
        </div>

        <div style={styles.featureCard}>
          <h2>📚 Total Books</h2>
          <p>{books.length}</p>
        </div>

      </div>

      <div style={{ marginTop: "30px" }}>

        <button
          style={styles.mainButton}
          onClick={() => navigate("/manage-users")}
        >
          Manage Users
        </button>

        <button
          style={{ ...styles.mainButton, marginLeft: "10px" }}
          onClick={() => navigate("/system-settings")}
        >
          System Settings
        </button>

      </div>

    </div>

  );

}

export default OwnerDashboard;