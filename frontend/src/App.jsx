import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/NavBar';
import React, { Suspense, lazy } from 'react';

const Login = lazy(() => import('./pages/login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Users = lazy(() => import('./pages/Users'));
const Categories = lazy(() => import('./pages/categories'));

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/users" element={<Users />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

