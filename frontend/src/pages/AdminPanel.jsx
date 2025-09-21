import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function getUsers() {
      try {
        const res = await api.get('/users'); // backend should have admin-only route
        setUsers(res.data.users || []);
      } catch (err) {
        console.error(err);
      }
    }
    getUsers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>
      <ul>
        {users.map(u => <li key={u.id}>{u.username} — {u.role}</li>)}
      </ul>
    </div>
  );
}
