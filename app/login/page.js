"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{isSignup ? "Sign Up" : "Login"}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          {!isSignup && (
            <p style={{ textAlign: "right", fontSize: "14px", margin: "0 0 12px" }}>
              <Link href="/forgot-password" style={{ color: "#4f46e5", textDecoration: "none" }}>
                Forgot password?
              </Link>
            </p>
          )}
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p onClick={() => setIsSignup(!isSignup)} className={styles.switchText}>
          {isSignup ? "Already have an account? Login" : "New here? Sign up"}
        </p>
      </div>
    </div>
  );
}