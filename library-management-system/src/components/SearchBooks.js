import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

const backgroundImages = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1",
];

function SearchBooks({ user }) {
  const [query, setQuery] = useState("");
  const [currentBg, setCurrentBg] = useState(0);
  const [message, setMessage] = useState("");
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  // 🔁 Background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 📚 Load books from MongoDB
  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(query.toLowerCase())
  );

  const addToCart = async (book) => {
    if (book.available <= 0) {
      setMessage("❌ Book not available");
      return;
    }

    try {
      // 1️⃣ Reduce book availability
      await fetch(`http://localhost:5000/api/books/${book._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          available: book.available - 1,
        }),
      });

      // 2️⃣ Add book to user's borrowedBooks
      await fetch(`http://localhost:5000/api/users/${user._id}/borrow`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookName: book.name,
          status: "Borrowed",
          amount: 0,
          purchaseDate: new Date().toLocaleDateString(),
          returnDaysLeft: 7,
        }),
      });

      setMessage(`✅ "${book.name}" added to cart`);

      // Refresh books
      const updated = await fetch("http://localhost:5000/api/books");
      const updatedData = await updated.json();
      setBooks(updatedData);

    } catch (error) {
      console.error(error);
      setMessage("❌ Error adding book");
    }
  };

  return (
    <div
      style={{
        ...styles.pageWrapper,
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
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
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <header style={styles.header}>
        <div style={styles.logo}>📚 LMS</div>
        <nav style={styles.nav}>
          <button style={styles.navButton} onClick={() => navigate("/")}>
            Home
          </button>
        </nav>
      </header>

      <div style={styles.formBackground}>
        <div style={styles.formCard}>
          <h2>🔍 Smart Book Search</h2>

          <input
            style={styles.input}
            placeholder="Search book name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book._id} style={{ marginBottom: "15px" }}>
                <p>
                  📘 {book.name} <br />
                  <small>Available: {book.available}</small>
                </p>

                <button
                  style={styles.mainButton}
                  disabled={book.available === 0}
                  onClick={() => addToCart(book)}
                >
                  ➕ Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p>No books found</p>
          )}

          {message && (
            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <p>{message}</p>
              <button
                style={styles.mainButton}
                onClick={() => navigate("/borrow")}
              >
                🛒 View Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBooks;
