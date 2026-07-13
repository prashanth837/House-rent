import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../components/Toast';

const UserDashboard = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const fetchRenterBookings = async () => {
    try {
      const response = await api.get('/bookings/renter');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast('Failed to load bookings history', 'error');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchRenterBookings();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone) {
      showToast('Name and phone number are required', 'error');
      return;
    }

    if (password && password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setUpdatingProfile(true);

    try {
      const payload = { name, phone };
      if (password) {
        payload.password = password;
      }
      await updateProfile(payload);
      showToast('Profile updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to update profile';
      showToast(errMsg, 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
    <div className="container section">
      <h1 style={styles.dashboardTitle}>Renter Dashboard</h1>
      <p style={styles.dashboardSubtitle}>Manage your profile details and view your housing bookings.</p>

      <div style={styles.dashboardGrid}>
        {/* Profile Card */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={styles.cardTitle}>Update Profile</h3>
          <form onSubmit={handleProfileSubmit} style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={updatingProfile}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={user?.email}
                disabled
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
              />
              <small style={{ color: 'var(--text-muted)' }}>Email cannot be changed.</small>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={updatingProfile}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password (leave empty to keep current)</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={updatingProfile}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={updatingProfile}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
              disabled={updatingProfile}
            >
              {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Bookings Card */}
        <div className="card">
          <h3 style={styles.cardTitle}>My Bookings History</h3>
          {loadingBookings ? (
            <Spinner />
          ) : bookings.length === 0 ? (
            <div style={styles.noBookings}>
              <p>You have not submitted any property booking requests yet.</p>
            </div>
          ) : (
            <div className="table-container" style={{ marginTop: '16px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>City</th>
                    <th>Rent</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Date Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        {booking.property ? (
                          <strong>{booking.property.name}</strong>
                        ) : (
                          <span style={{ color: 'var(--danger)' }}>Deleted Property</span>
                        )}
                      </td>
                      <td>{booking.property ? booking.property.city : 'N/A'}</td>
                      <td>{booking.property ? `$${booking.property.rent}` : 'N/A'}</td>
                      <td>
                        {booking.owner ? (
                          <div>
                            <p>{booking.owner.name}</p>
                            <small>{booking.owner.phone}</small>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge badge-${booking.status.toLowerCase()}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardTitle: {
    fontSize: '32px',
    color: 'var(--secondary)',
  },
  dashboardSubtitle: {
    fontSize: '15px',
    color: 'var(--text-muted)',
    marginBottom: '32px',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '4fr 8fr',
    gap: '30px',
  },
  cardTitle: {
    fontSize: '20px',
    color: 'var(--secondary)',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '10px',
  },
  noBookings: {
    padding: '40px 20px',
    textAlign: 'center',
    color: 'var(--text-muted)',
  },
};

// Responsive handling
if (window.innerWidth <= 768) {
  styles.dashboardGrid.gridTemplateColumns = '1fr';
}

export default UserDashboard;
