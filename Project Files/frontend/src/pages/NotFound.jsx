import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.header}>404</h1>
      <h2 style={styles.subheader}>Page Not Found</h2>
      <p style={styles.text}>
        Oops! The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary" style={styles.btn}>
        Return to Home Page
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
    textAlign: 'center',
    padding: '20px',
  },
  header: {
    fontSize: '120px',
    fontWeight: '800',
    color: 'var(--primary)',
    lineHeight: '1',
    letterSpacing: '-2px',
  },
  subheader: {
    fontSize: '32px',
    color: 'var(--secondary)',
    margin: '12px 0 16px 0',
  },
  text: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    maxWidth: '480px',
    marginBottom: '28px',
  },
  btn: {
    padding: '12px 24px',
  },
};

export default NotFound;
