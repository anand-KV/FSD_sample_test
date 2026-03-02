import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

const backgroundImages = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1",
];

function Payment() {
  const navigate = useNavigate();

  const [currentBg, setCurrentBg] = useState(0);
  const [rentDays, setRentDays] = useState(1);

  const [user, setUser] = useState(null);
  const [book, setBook] = useState(null);

  // 🔐 Fetch logged-in user & selected book from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("http://localhost:5000/api/current-user", {
          credentials: "include",
        });

        if (!userRes.ok) {
          navigate("/login");
          return;
        }

        const userData = await userRes.json();
        setUser(userData);

        const bookRes = await fetch("http://localhost:5000/api/selected-book", {
          credentials: "include",
        });

        if (!bookRes.ok) {
          navigate("/borrow");
          return;
        }

        const bookData = await bookRes.json();
        setBook(bookData);

      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  // 🎞 Background slideshow (UNCHANGED)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 💳 CONFIRM PAYMENT (MongoDB)
  const confirmPayment = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bookName: book.name,
          rentDays: rentDays,
          amount: 99.0,
        }),
      });

      if (!res.ok) {
        alert("Payment failed");
        return;
      }

      alert(`✅ Payment successful!\nBook: ${book.name}\nDays: ${rentDays}`);
      navigate("/borrow");

    } catch (err) {
      console.error(err);
      alert("Error processing payment");
    }
  };

  // 🔓 Logout (Session based)
  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  };

  if (!book) return null;

  return (
    <>
      {/* BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
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
        }}
      >
        <div
          style={{
            ...styles.formCard,
            background: "rgba(0,0,0,0.6)",
            color: "white",
          }}
        >
          <h2>💳 Payment</h2>

          <p><strong>User:</strong> {user?.email}</p>
          <p><strong>Book:</strong> {book.name}</p>

          <p>
            <strong>Rent Days:</strong>{" "}
            <select
              value={rentDays}
              onChange={(e) => setRentDays(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <option key={day} value={day}>
                  {day} day{day > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </p>

          <p><strong>Rent Amount:</strong> ₹99.00</p>

          <button
            style={{ ...styles.mainButton, marginTop: "12px" }}
            onClick={confirmPayment}
          >
            Confirm Payment
          </button>

          <button
            style={{ ...styles.mainButton, marginTop: "10px" }}
            onClick={() => navigate("/")}
          >
            🏠 Home
          </button>

          <button
            style={{ ...styles.mainButton, marginTop: "10px" }}
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

          <p style={styles.back} onClick={() => navigate(-1)}>
            ⬅ Cancel
          </p>
        </div>
      </div>
    </>
  );
}

export default Payment;
