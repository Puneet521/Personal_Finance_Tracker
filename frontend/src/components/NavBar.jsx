import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null; // hide if not logged in

  return (
    <nav style={{ padding: '10px', background: '#ddd' }}>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/transactions">Transactions</Link> |{" "}
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

