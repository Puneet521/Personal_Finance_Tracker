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

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      // backend: { token, user }
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={submit} autoComplete="off">
        <h1>Personal Finance Tracker</h1>
        <p className="subtitle">Sign in to continue</p>
        {error && <div className="error">{error}</div>}

        <label>Username</label>
        <input name="username" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} placeholder="Username" required />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} placeholder="Password" required />

        <button type="submit" className="btn-login">Login</button>
      </form>
    </div>
  );
}
