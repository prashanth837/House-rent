import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('renter');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validations
    if (!name || !email || !password || !confirmPassword || !phone) {
      showToast('All fields are required', 'error');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      showToast('Please enter a valid phone number (10-15 digits)', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const data = await register(name, email, password, phone, role);
      showToast(`Account registered successfully as ${role}!`, 'success');

      // Role-based routing
      if (data.role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/renter-dashboard');
      }
    } catch (error) {
      console.error('Registration error detail:', error);
      const errMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <div className="card" style={styles.card}>
        <h2 style={styles.header}>Create Account</h2>
        <p style={styles.subheader}>Join HouseHunt as a property owner or a renter today.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>

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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="10-15 digits"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">I want to...</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={submitting}
              >
                <option value="renter">Rent Properties</option>
                <option value="owner">List & Rent My Properties</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={styles.btn} disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={styles.loginLink}>
          Already have an account? <Link to="/login">Sign in here</Link>
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
    padding: '40px 20px',
  },
  card: {
    maxWidth: '560px',
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
  btn: {
    width: '100%',
    marginTop: '16px',
    padding: '12px',
  },
  loginLink: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
};

export default Register;
