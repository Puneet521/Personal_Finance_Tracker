import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <nav className="app-nav">
      <div className="nav-left">
        <span className="brand">Personal Finance Tracker</span>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
         {user.role === "admin" && (
        <Link to="/users" style={{ margin: "0 10px", color: "#fff" }}>User Management</Link>
      )}
      </div>
      <div className="nav-right">
        <span className="role-tag">{user.role}</span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
