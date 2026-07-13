import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.navContainer}>
        <Link to="/" className="navbar-brand" style={styles.logo}>
          <span>🏠</span> HouseHunt
        </Link>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>Home</Link>
          
          {user ? (
            <>
              {user.role === 'renter' && (
                <>
                  <Link to="/renter-dashboard" style={styles.link}>Dashboard</Link>
                  <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
                </>
              )}
              {user.role === 'owner' && (
                <>
                  <Link to="/owner-dashboard" style={styles.link}>Owner Dashboard</Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin-dashboard" style={styles.link}>Admin Panel</Link>
                </>
              )}
              
              <div style={styles.userInfo}>
                <span style={styles.username}>Hello, <strong>{user.name}</strong> ({user.role})</span>
                <button onClick={handleLogout} className="btn btn-secondary" style={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ marginRight: '8px' }}>Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#0a0d14',
    borderBottom: '1px solid #1a2233',
    padding: '16px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    textDecoration: 'none',
    fontSize: '22px',
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: '#a0aec0',
    fontSize: '15px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginLeft: '10px',
    paddingLeft: '16px',
    borderLeft: '1px solid #1a2233',
  },
  username: {
    fontSize: '14px',
    color: '#ffffff',
  },
  logoutBtn: {
    padding: '6px 12px',
    fontSize: '13px',
  }
};

export default Navbar;
