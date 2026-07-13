import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { forgotPassword } = useContext(AuthContext);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    setSubmitting(true);
    setResetMessage('');
    setTempPassword('');

    try {
      const data = await forgotPassword(email);
      showToast('Password reset generated!', 'success');
      setResetMessage(data.message);
      if (data.tempPassword) {
        setTempPassword(data.tempPassword);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Password reset request failed';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <div className="card" style={styles.card}>
        <h2 style={styles.header}>Reset Password</h2>
        <p style={styles.subheader}>
          Enter your registered email address. We will generate a temporary login password for you.
        </p>

        {resetMessage && (
          <div style={styles.alertBox}>
            <p style={styles.alertText}>{resetMessage}</p>
            {tempPassword && (
              <div style={styles.tempPassBox}>
                <span style={styles.tempLabel}>Temporary Password:</span>
                <code style={styles.tempVal}>{tempPassword}</code>
              </div>
            )}
          </div>
        )}

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

          <button type="submit" className="btn btn-primary" style={styles.btn} disabled={submitting}>
            {submitting ? 'Generating...' : 'Reset Password'}
          </button>
        </form>

        <p style={styles.backLink}>
          Remembered your password? <Link to="/login">Back to Sign In</Link>
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
  btn: {
    width: '100%',
    marginTop: '12px',
    padding: '12px',
  },
  alertBox: {
    backgroundColor: 'var(--warning-light)',
    padding: '16px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--warning)',
    marginBottom: '20px',
  },
  alertText: {
    fontSize: '14px',
    color: 'var(--text-main)',
  },
  tempPassBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid rgba(0,0,0,0.1)',
  },
  tempLabel: {
    fontSize: '13px',
    fontWeight: '600',
  },
  tempVal: {
    fontSize: '15px',
    backgroundColor: '#ffffff',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid var(--border)',
    fontWeight: '700',
    color: 'var(--primary)',
  },
  backLink: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
};

export default ForgotPassword;
