import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

function EmployeeDashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        // ✅ Get current logged-in employee
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

        // ✅ Check role
        if (userData.role !== "employee") {
          navigate("/login");
          return;
        }

        setUser(userData);

        // ✅ Get books list
        const booksRes = await fetch("https://fsd-backend-pai8.onrender.com/api/books", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (booksRes.ok) {

          const booksData = await booksRes.json();

          setBooks(Array.isArray(booksData) ? booksData : []);

        } else {

          setBooks([]);

        }

      } catch (error) {

        console.error("Error loading employee dashboard:", error);

        navigate("/login");

      }

    };

    fetchData();

  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (

    <div style={{ ...styles.pageWrapper, padding: "40px" }}>

      <h1>👨‍💼 Employee Workspace</h1>

      <p>Welcome {user.name}</p>

      <div style={styles.featuresSection}>

        <div style={styles.featureCard}>
          <h2>📚 Total Books</h2>
          <p>{books.length}</p>
        </div>

        <div
          style={styles.featureCard}
          onClick={() => navigate("/manage-books")}
        >
          <h2>🔄 Update Availability</h2>
        </div>

        <div
          style={styles.featureCard}
          onClick={() => navigate("/borrow-records")}
        >
          <h2>📋 View Borrow Records</h2>
        </div>

      </div>

    </div>

  );

}

export default EmployeeDashboard;