import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Placeholder: Will implement full navigation later
const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '1rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container flex flex-between">
        <div className="flex">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ color: '#667eea', margin: 0 }}>🎌 AnimeVoting</h1>
          </Link>
        </div>
        
        <nav className="flex" style={{ gap: '1rem', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/vote" className="btn btn-outline">Vote</Link>
              <Link to="/leaderboard" className="btn btn-outline">Leaderboard</Link>
              <span style={{ color: '#666' }}>
                Welcome, {user?.username || 'User'}!
              </span>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;