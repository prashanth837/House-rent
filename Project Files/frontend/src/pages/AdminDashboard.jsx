import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../components/Toast';

const AdminDashboard = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);

      const ownersRes = await api.get('/admin/owners');
      setOwners(ownersRes.data);

      const propsRes = await api.get('/admin/properties');
      setProperties(propsRes.data);

      const bookingsRes = await api.get('/bookings/admin');
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error(error);
      showToast('Failed to retrieve administrator payload data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id, roleName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this ${roleName}? All listings and bookings linked to this profile will be permanently cleared.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/admin/users/${id}`);
      showToast(`${roleName} deleted successfully`, 'success');
      fetchAdminData();
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to delete user';
      showToast(errMsg, 'error');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this property? This will wipe the listing and associated bookings.'
      )
    ) {
      return;
    }

    try {
      await api.delete(`/properties/${id}`);
      showToast('Listing removed successfully', 'success');
      fetchAdminData();
    } catch (error) {
      showToast('Failed to delete property listing', 'error');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container section">
      <h1 style={styles.title}>Admin Control Center</h1>
      <p style={styles.subtitle}>Global oversight of registered users, properties, and bookings.</p>

      {/* Tabs Row */}
      <div style={styles.tabRow}>
        <button
          onClick={() => setActiveTab('stats')}
          style={{
            ...styles.tabBtn,
            borderBottomColor: activeTab === 'stats' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'stats' ? 'var(--primary)' : 'var(--text-muted)',
          }}
        >
          System Stats
        </button>
        <button
          onClick={() => setActiveTab('renters')}
          style={{
            ...styles.tabBtn,
            borderBottomColor: activeTab === 'renters' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'renters' ? 'var(--primary)' : 'var(--text-muted)',
          }}
        >
          Renters ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('owners')}
          style={{
            ...styles.tabBtn,
            borderBottomColor: activeTab === 'owners' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'owners' ? 'var(--primary)' : 'var(--text-muted)',
          }}
        >
          Owners ({owners.length})
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          style={{
            ...styles.tabBtn,
            borderBottomColor: activeTab === 'properties' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'properties' ? 'var(--primary)' : 'var(--text-muted)',
          }}
        >
          Properties ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            ...styles.tabBtn,
            borderBottomColor: activeTab === 'bookings' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'bookings' ? 'var(--primary)' : 'var(--text-muted)',
          }}
        >
          Bookings ({bookings.length})
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div style={styles.statsTab}>
          <div style={styles.statsGrid}>
            <div className="card" style={styles.statCard}>
              <span style={styles.statIcon}>👥</span>
              <div style={styles.statInfo}>
                <span style={styles.statNum}>{stats.totalRenters}</span>
                <span style={styles.statLabel}>Registered Tenants</span>
              </div>
            </div>

            <div className="card" style={styles.statCard}>
              <span style={styles.statIcon}>💼</span>
              <div style={styles.statInfo}>
                <span style={styles.statNum}>{stats.totalOwners}</span>
                <span style={styles.statLabel}>Property Owners</span>
              </div>
            </div>

            <div className="card" style={styles.statCard}>
              <span style={styles.statIcon}>🏠</span>
              <div style={styles.statInfo}>
                <span style={styles.statNum}>{stats.totalProperties}</span>
                <span style={styles.statLabel}>Total Listings</span>
              </div>
            </div>

            <div className="card" style={styles.statCard}>
              <span style={styles.statIcon}>📋</span>
              <div style={styles.statInfo}>
                <span style={styles.statNum}>{stats.totalBookings}</span>
                <span style={styles.statLabel}>Total Bookings</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '30px' }}>
            <h3 style={styles.sectionHeader}>Booking Demographics</h3>
            <div style={styles.demographicsGrid}>
              <div style={styles.demoItem}>
                <span style={styles.demoLabel}>Pending Approvals</span>
                <span className="badge badge-pending" style={styles.demoVal}>
                  {stats.pendingBookings}
                </span>
              </div>
              <div style={styles.demoItem}>
                <span style={styles.demoLabel}>Approved Rentals</span>
                <span className="badge badge-approved" style={styles.demoVal}>
                  {stats.approvedBookings}
                </span>
              </div>
              <div style={styles.demoItem}>
                <span style={styles.demoLabel}>Rejected Applications</span>
                <span className="badge badge-rejected" style={styles.demoVal}>
                  {stats.rejectedBookings}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Renters Tab */}
      {activeTab === 'renters' && (
        <div className="card">
          <h3 style={styles.sectionHeader}>Registered Renters</h3>
          {users.length === 0 ? (
            <p style={styles.empty}>No renters registered on the platform.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Registered Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((r) => (
                    <tr key={r._id}>
                      <td><strong>{r.name}</strong></td>
                      <td>{r.email}</td>
                      <td>{r.phone}</td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(r._id, 'Renter')}
                          className="btn btn-danger"
                          style={styles.tblBtn}
                        >
                          Delete Account
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Owners Tab */}
      {activeTab === 'owners' && (
        <div className="card">
          <h3 style={styles.sectionHeader}>Property Owners</h3>
          {owners.length === 0 ? (
            <p style={styles.empty}>No property owners registered.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Registered Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map((o) => (
                    <tr key={o._id}>
                      <td><strong>{o.name}</strong></td>
                      <td>{o.email}</td>
                      <td>{o.phone}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(o._id, 'Owner')}
                          className="btn btn-danger"
                          style={styles.tblBtn}
                        >
                          Delete Owner
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <div className="card">
          <h3 style={styles.sectionHeader}>Listed Properties</h3>
          {properties.length === 0 ? (
            <p style={styles.empty}>No property listings found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Property Name</th>
                    <th>Location</th>
                    <th>Owner</th>
                    <th>Rent</th>
                    <th>Availability</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p._id}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.city}, {p.state}</td>
                      <td>
                        <p>{p.ownerName}</p>
                        <small>{p.ownerContact}</small>
                      </td>
                      <td>${p.rent}/mo</td>
                      <td>
                        <span className={`badge ${p.isAvailable ? 'badge-available' : 'badge-rented'}`}>
                          {p.isAvailable ? 'Available' : 'Rented'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteProperty(p._id)}
                          className="btn btn-danger"
                          style={styles.tblBtn}
                        >
                          Delete Property
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="card">
          <h3 style={styles.sectionHeader}>Global Bookings Log</h3>
          {bookings.length === 0 ? (
            <p style={styles.empty}>No booking transactions found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Renter Details</th>
                    <th>Owner Details</th>
                    <th>Status</th>
                    <th>Date Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        {b.property ? (
                          <strong>{b.property.name}</strong>
                        ) : (
                          <span style={{ color: 'var(--danger)' }}>Deleted Property</span>
                        )}
                      </td>
                      <td>
                        {b.renter ? (
                          <div>
                            <p><strong>{b.renter.name}</strong></p>
                            <p><small>{b.renter.phone}</small></p>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        {b.owner ? (
                          <div>
                            <p><strong>{b.owner.name}</strong></p>
                            <p><small>{b.owner.phone}</small></p>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        <span className={`badge badge-${b.status.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  title: {
    fontSize: '32px',
    color: 'var(--secondary)',
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--text-muted)',
    marginBottom: '32px',
  },
  tabRow: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid var(--border)',
    marginBottom: '30px',
    overflowX: 'auto',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    padding: '12px 6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'var(--transition)',
    whiteSpace: 'nowrap',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  statIcon: {
    fontSize: '32px',
    backgroundColor: 'var(--bg-main)',
    padding: '12px',
    borderRadius: '12px',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statNum: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--secondary)',
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: '20px',
    color: 'var(--secondary)',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  demographicsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    textAlign: 'center',
  },
  demoItem: {
    backgroundColor: 'var(--bg-main)',
    padding: '20px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  demoLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-muted)',
  },
  demoVal: {
    fontSize: '16px',
    padding: '6px 14px',
  },
  empty: {
    padding: '40px 20px',
    textAlign: 'center',
    color: 'var(--text-muted)',
  },
  tblBtn: {
    padding: '6px 12px',
    fontSize: '12px',
  },
};

// Responsive handling
if (window.innerWidth <= 768) {
  styles.demographicsGrid.gridTemplateColumns = '1fr';
}

export default AdminDashboard;
