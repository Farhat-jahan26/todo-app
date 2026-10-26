"use client";
import { useState } from "react";
import Link from "next/link";
import { auth } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import styles from "../login/login.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "If an account exists for this email, a reset link has been sent. Please check your inbox and spam folder."
      );
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again after some time.");
      } else {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot Password</h1>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px", textAlign: "center" }}>
          Enter your registered email and we will send you a reset link.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          {message && (
            <p style={{ color: "green", fontSize: "14px", marginBottom: "12px" }}>{message}</p>
          )}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className={styles.switchText}>
          <Link href="/login" style={{ color: "inherit", textDecoration: "none" }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}