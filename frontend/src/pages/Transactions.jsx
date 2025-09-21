import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ amount: "", type: "expense", category_id: "", description: "" });
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchData = useCallback(async () => {
    try {
      const txUrl = user.role === "admin" ? "/transactions" : "/transactions/my";
      const [txRes, catRes] = await Promise.all([
        api.get(txUrl),
        // try /categories then fallback to /search/categories
        api.get("/categories").catch(()=>api.get("/search/categories"))
      ]);
      setTransactions(txRes.data.transactions || []);
      // categories response might be { categories: [...] } or rows
      const cats = catRes.data.categories || catRes.data || [];
      setCategories(cats);
    } catch (err) {
      console.error("Fetch transactions error:", err);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // filtered & paginated view
  const filtered = useMemo(() => {
    if (!query) return transactions;
    const q = query.toLowerCase();
    return transactions.filter(t =>
      String(t.amount).includes(q) ||
      (t.type || "").toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q) ||
      (String(t.category_id) || "").includes(q)
    );
  }, [transactions, query]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // helpers
  const catName = (id) => {
    const c = categories.find(x => x.id === id || String(x.id) === String(id));
    return c ? c.name : id;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (user.role === "read-only") return alert("Read-only cannot add");
    try {
      const res = await api.post("/transactions", { ...form, amount: Number(form.amount), category_id: Number(form.category_id) });
      setTransactions(prev => [res.data.transaction, ...prev]);
      setForm({ amount: "", type: "expense", category_id: "", description: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add");
    }
  };

  const handleDelete = async (id) => {
    if (user.role === "read-only") return;
    if (!confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(prev => prev.filter(t=>t.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // open inline edit
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: "", type: "", category_id: "", description: "" });

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditForm({ amount: t.amount, type: t.type, category_id: t.category_id, description: t.description || "" });
  };

  const submitEdit = async (id) => {
    if (user.role === "read-only") return;
    try {
      const res = await api.put(`/transactions/${id}`, { ...editForm, amount: Number(editForm.amount), category_id: Number(editForm.category_id) });
      setTransactions(prev => prev.map(p => p.id === id ? res.data.transaction : p));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="container">
      <h2>Transactions</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Search..." value={query} onChange={e=>{setQuery(e.target.value); setPage(1)}} />
      </div>

      {/* Add */}
      {user.role !== "read-only" && (
        <form onSubmit={handleAdd} className="form-row">
          <input placeholder="Amount" value={form.amount} onChange={e=>setForm(s=>({...s, amount:e.target.value}))} required />
          <select value={form.type} onChange={e=>setForm(s=>({...s, type:e.target.value}))}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select value={form.category_id} onChange={e=>setForm(s=>({...s, category_id:e.target.value}))} required>
            <option value="">Category</option>
            {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Description" value={form.description} onChange={e=>setForm(s=>({...s, description:e.target.value}))} />
          <button type="submit">Add</button>
        </form>
      )}

      {/* List */}
      <div>
        {paged.length === 0 ? <div>No transactions</div> : (
          paged.map(t => (
            <div key={t.id} className="transaction-item">
              <div style={{ width: "65%" }}>
                <div><strong>{t.type.toUpperCase()}</strong> • ₹ {t.amount}</div>
                <small>{catName(t.category_id)} • {t.description}</small>
              </div>
              <div style={{ textAlign: "right" }}>
                <div>{new Date(t.created_at).toLocaleString()}</div>

                {editingId === t.id ? (
                  <>
                    <div className="edit-row">
                      <input value={editForm.amount} onChange={e=>setEditForm(s=>({...s, amount:e.target.value}))} />
                      <select value={editForm.type} onChange={e=>setEditForm(s=>({...s, type:e.target.value}))}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                      <select value={editForm.category_id} onChange={e=>setEditForm(s=>({...s, category_id:e.target.value}))}>
                        {categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <input value={editForm.description} onChange={e=>setEditForm(s=>({...s, description:e.target.value}))} />
                      <button onClick={()=>submitEdit(t.id)}>Save</button>
                      <button onClick={()=>setEditingId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    {user.role !== "read-only" && <button onClick={()=>startEdit(t)}>Edit</button>}
                    {user.role !== "read-only" && <button onClick={()=>handleDelete(t.id)}>Delete</button>}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <button disabled={page === 1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <div>Page {page} / {Math.max(1, Math.ceil(filtered.length / pageSize))}</div>
        <button disabled={page >= Math.ceil(filtered.length / pageSize)} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
}
