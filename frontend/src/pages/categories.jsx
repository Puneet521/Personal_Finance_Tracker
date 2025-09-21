import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Categories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data.categories));
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    if (user.role !== "admin") return alert("Only admin can add categories");
    const res = await api.post("/categories", { name });
    setCategories(prev => [...prev, res.data.category]);
    setName("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Categories</h2>
      {user.role === "admin" && (
        <form onSubmit={addCategory}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" />
          <button type="submit">Add</button>
        </form>
      )}
      <ul>
        {categories.map(c => <li key={c.id}>{c.name}</li>)}
      </ul>
    </div>
  );
}
