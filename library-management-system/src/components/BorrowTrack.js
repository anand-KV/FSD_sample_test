import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

const backgroundImages = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1",
];

function BorrowTrack({ user }) {
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);
  const [cartBooks, setCartBooks] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Load Cart from MongoDB (fixed with useCallback)
  const loadCart = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `https://fsd-backend-pai8.onrender.com/api/cart/${user.email}`
      );
      const data = await response.json();
      setCartBooks(data);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  }, [user]);

  // Load cart when user changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Remove from cart
  const removeFromCart = async (bookName) => {
    try {
      await fetch("http://localhost:5000/remove-from-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          bookName
        })
      });

      loadCart();
    } catch (err) {
      console.error("Error removing book:", err);
    }
  };

  // Borrow book
  const handleBuy = async (book) => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await fetch("http://localhost:5000/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          book
        })
      });

      alert("Book borrowed successfully!");
      loadCart();
    } catch (err) {
      console.error("Error borrowing book:", err);
    }
  };

  return (
    <div
      style={{
        ...styles.pageWrapper,
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden"
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgroundImages[currentBg]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)",
          zIndex: -1
        }}
      />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>📚 LMS</div>
        <nav style={styles.nav}>
          <button style={styles.navButton} onClick={() => navigate("/")}>
            Home
          </button>
        </nav>
      </header>

      {/* Content */}
      <div style={styles.formBackground}>
        <div style={styles.formCard}>
          <h2>📘 Borrow & Track</h2>

          <button
            style={{ ...styles.mainButton, marginBottom: "15px" }}
            onClick={() => {
              loadCart();
              setShowCart(!showCart);
            }}
          >
            🛒 {showCart ? "Hide Cart" : "View Cart"}
          </button>

          {showCart && (
            <>
              {cartBooks.length === 0 ? (
                <p>No books in cart</p>
              ) : (
                cartBooks.map((book, index) => (
                  <div key={index} style={{ marginBottom: "12px" }}>
                    <p>✔ {book.name}</p>

                    <button
                      style={{ ...styles.mainButton, marginRight: "8px" }}
                      onClick={() => handleBuy(book)}
                    >
                      💳 Borrow
                    </button>

                    <button
                      style={styles.mainButton}
                      onClick={() => removeFromCart(book.name)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BorrowTrack;
