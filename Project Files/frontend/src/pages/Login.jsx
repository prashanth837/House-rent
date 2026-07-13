import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validations
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const data = await login(email, password);
      showToast(`Welcome back, ${data.name}!`, 'success');

      // Role-based redirection
      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/renter-dashboard');
      }
    } catch (error) {
      console.error('Login error detail:', error);
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <div className="card" style={styles.card}>
        <h2 style={styles.header}>Sign In</h2>
        <p style={styles.subheader}>Welcome back to HouseHunt. Find or manage properties.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <div style={styles.passHeader}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={styles.forgot}>Forgot Password?</Link>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={styles.btn} disabled={submitting}>
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.registerLink}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
  },
  card: {
    maxWidth: '440px',
    width: '100%',
    padding: '40px',
  },
  header: {
    fontSize: '28px',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subheader: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    marginBottom: '24px',
    textAlign: 'center',
  },
  passHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgot: {
    fontSize: '13px',
  },
  btn: {
    width: '100%',
    marginTop: '12px',
    padding: '12px',
  },
  registerLink: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
};

export default Login;
