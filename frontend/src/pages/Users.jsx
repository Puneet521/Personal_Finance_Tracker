// frontend/src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: "", password: "", role: "user" });
  const [error, setError] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create new user
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setForm({ username: "", password: "", role: "user" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create user");
    }
  };

  // Update role
  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="users-page">
      <h2>User Management</h2>

      {/* Create User Form */}
      <form className="user-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="read-only">Read-only</option>
        </select>
        <button type="submit">Create User</button>
      </form>

      {error && <div className="error">{error}</div>}

      {/* User Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="read-only">Read-only</option>
                </select>
              </td>
              <td>{u.created_at ? new Date(u.created_at).toLocaleString() : "N/A"}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
