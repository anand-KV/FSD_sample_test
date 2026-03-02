import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

const backgroundImages = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1",
];

function Home() {
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);
  const [user, setUser] = useState(null);
  const [system, setSystem] = useState({ users: [] });
  const [books, setBooks] = useState([]);

  // 🔁 Background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🔐 Fetch user, system users, and books from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Current logged-in user
        const userRes = await fetch("https://fsd-backend-pai8.onrender.com/api/current-user", {
          credentials: "include",
        });
        if (!userRes.ok) return;
        const userData = await userRes.json();
        setUser(userData);

        // All system users
        const systemRes = await fetch("https://fsd-backend-pai8.onrender.com/api/users", {
          credentials: "include",
        });
        const systemData = await systemRes.json();
        setSystem({ users: systemData });

        // All books
        const booksRes = await fetch("https://fsd-backend-pai8.onrender.com/api/books", {
          credentials: "include",
        });
        const booksData = await booksRes.json();
        setBooks(booksData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    await fetch("https://fsd-backend-pai8.onrender.com/api/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login-select");
  };

  // ✏️ Owner Update Info
  const handleOwnerUpdate = () => {
    navigate("/register"); // Or prefill form from backend
  };

  // 🔄 Employee: Update Book Availability
  const handleUpdateAvailability = async () => {
    if (books.length === 0) {
      alert("No books available to update");
      return;
    }

    const bookName = prompt("Enter book name to update availability:");
    if (!bookName) return;

    const book = books.find(
      (b) => b.name.toLowerCase() === bookName.toLowerCase()
    );

    if (!book) {
      alert("Book not found");
      return;
    }

    const newCount = prompt(`Enter new availability for "${book.name}":`);
    if (newCount === null || isNaN(newCount) || Number(newCount) < 0) {
      alert("Invalid availability number");
      return;
    }

    try {
      const res = await fetch("https://fsd-backend-pai8.onrender.com/api/books/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: book.name, available: Number(newCount) }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Availability updated for "${book.name}"`);
        setBooks((prev) =>
          prev.map((b) =>
            b._id === book._id ? { ...b, available: Number(newCount) } : b
          )
        );
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating availability");
    }
  };

  // 🔹 Filter users by role
  const employees = system.users.filter(
    (u) => u.role?.toLowerCase() === "employee"
  );
  const users = system.users.filter(
    (u) => u.role?.toLowerCase() === "user"
  );
  const role = user?.role?.toLowerCase();

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
        }}
      />

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logo}>📚 LMS</div>
        <nav style={styles.nav}>
          {!user ? (
            <>
              <button
                style={styles.navButton}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                style={styles.navButton}
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          ) : (
            <button style={styles.navButton} onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      {/* ================= OWNER HOME ================= */}
      {role === "owner" ? (
        <>
          <section style={{ padding: "80px 20px" }}>
            <div style={styles.heroContainer}>
              <h1 style={{ ...styles.heroTitle, color: "white" }}>
                Owner Control Panel
              </h1>
              <p style={{ ...styles.heroSubtitle, color: "rgba(255,255,255,0.9)" }}>
                Manage users, employees & important actions
              </p>

              <button
                style={{
                  ...styles.mainButton,
                  background: "rgba(255,255,255,0.85)",
                  color: "#000",
                }}
                onClick={handleOwnerUpdate}
              >
                ✏️ Update Owner Info
              </button>
            </div>
          </section>

          <section style={styles.featuresSection}>
            <div
              style={{ ...styles.featureCard, background: "rgba(0,0,0,0.45)", color: "white" }}
            >
              <h2>👤 Users</h2>
              <p>Total: {users.length}</p>
            </div>
            <div
              style={{ ...styles.featureCard, background: "rgba(0,0,0,0.45)", color: "white" }}
            >
              <h2>👨‍💼 Employees</h2>
              <p>Total: {employees.length}</p>
            </div>
            <div
              style={{ ...styles.featureCard, background: "rgba(0,0,0,0.45)", color: "white" }}
            >
              <h2>⚙️ System</h2>
              <button
                style={styles.mainButton}
                onClick={() => navigate("/dashboard")}
              >
                View Borrow History
              </button>
            </div>
          </section>
        </>
      ) : role === "employee" ? (
        /* ================= EMPLOYEE HOME ================= */
        <>
          <section style={{ padding: "80px 20px" }}>
            <div style={styles.heroContainer}>
              <h1 style={{ ...styles.heroTitle, color: "white" }}>
                Employee Workspace
              </h1>
              <p style={{ ...styles.heroSubtitle, color: "rgba(255,255,255,0.9)" }}>
                Track borrowings & manage book availability
              </p>
            </div>
          </section>

          <section style={styles.featuresSection}>
            <div
              style={{ ...styles.featureCard, background: "rgba(0,0,0,0.45)", color: "white" }}
            >
              <h2>📋 User Borrow Records</h2>
              <p>View all borrowed & returned books</p>
              <button
                style={styles.mainButton}
                onClick={() => navigate("/dashboard")}
              >
                View Records
              </button>
            </div>

            <div
              style={{ ...styles.featureCard, background: "rgba(0,0,0,0.45)", color: "white" }}
            >
              <h2>📚 Manage Books</h2>
              <button
                style={styles.mainButton}
                onClick={() => alert("Add Book feature")}
              >
                ➕ Add Book
              </button>
              <button
                style={{ ...styles.mainButton, marginTop: "10px" }}
                onClick={() => alert("Remove Book feature")}
              >
                ❌ Remove Book
              </button>
              <button
                style={{ ...styles.mainButton, marginTop: "10px" }}
                onClick={handleUpdateAvailability}
              >
                🔄 Update Availability
              </button>
            </div>

            <div
              style={{ ...styles.featureCard, background: "rgba(0,0,0,0.45)", color: "white" }}
            >
              <h2>🛠 Employee Tools</h2>
              <p>Daily operational tasks</p>
            </div>
          </section>
        </>
      ) : (
        /* ================= NORMAL USER HOME ================= */
        <>
          <section style={{ padding: "80px 20px" }}>
            <div style={styles.heroContainer}>
              <h1 style={{ ...styles.heroTitle, color: "white" }}>
                Library Management System
              </h1>
              <p style={{ ...styles.heroSubtitle, color: "rgba(255,255,255,0.9)" }}>
                A modern digital library portal for book lovers.
              </p>
              <button
                style={{
                  ...styles.mainButton,
                  background: "rgba(255,255,255,0.85)",
                  color: "#000",
                }}
                onClick={() => navigate("/about")}
              >
                About Us
              </button>
            </div>
          </section>

          <section style={styles.featuresSection}>
            <div
              style={{ ...styles.featureCard, background: "rgba(0,0,0,0.45)", color: "white" }}
              onClick={() => navigate("/search")}
            >
              <h2>🔍 Smart Book Search</h2>
              <p>Find any book instantly.</p>
            </div>

            <div
              style={{ ...styles.featureCard, background: "rgba(0,0,0,0.45)", color: "white" }}
              onClick={() => navigate("/facilities")}
            >
              <h2>👨‍💼 Facilities</h2>
              <p>Study rooms, quiet zones, and more.</p>
            </div>

            <div
              style={{ ...styles.featureCard, background: "rgba(0,0,0,0.45)", color: "white" }}
              onClick={() => navigate("/borrow")}
            >
              <h2>📘 Borrow & Track</h2>
              <p>Borrow, return & locate books.</p>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer
        style={{
          ...styles.footer,
          background: "rgba(0,0,0,0.6)",
          color: "white",
        }}
      >
        <div style={styles.footerContent}>
          <p><b>Contact Us</b></p>
          <p>Email: support@lmsapp.com | Phone: +91 8089109818</p>
          <p>© 2025 Library Management System</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
