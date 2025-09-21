import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />; // not logged in

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <div style={{ padding: 20 }}>Access denied (insufficient permissions)</div>;
  }
  return children;
}
