import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form); 
      // Backend returns { token, user }
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        // Backend sends proper messages (rate limit, invalid credentials, etc.)
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={submit} autoComplete="off">
        <h1 className="title">Personal Finance Tracker</h1>
        <p className="subtitle">Sign in to continue</p>

        {error && <div className="error">{error}</div>}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Enter your username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Enter your password"
          required
        />

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
