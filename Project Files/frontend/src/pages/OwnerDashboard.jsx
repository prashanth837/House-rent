import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../components/Toast';

const OwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating/editing properties
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('Apartment');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [rent, setRent] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [images, setImages] = useState([]); // File list for upload

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const propResponse = await api.get('/properties/owner/my-listings');
      const bookingResponse = await api.get('/bookings/owner');
      setProperties(propResponse.data);
      setBookings(bookingResponse.data);
    } catch (error) {
      console.error(error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const resetForm = () => {
    setName('');
    setType('Apartment');
    setAddress('');
    setCity('');
    setState('');
    setPincode('');
    setRent('');
    setBedrooms('');
    setBathrooms('');
    setArea('');
    setDescription('');
    setAdditionalInfo('');
    setIsAvailable(true);
    setImages([]);
    setIsEditing(false);
    setEditId(null);
  };

  const handleEditClick = (property) => {
    setIsEditing(true);
    setEditId(property._id);
    setName(property.name);
    setType(property.type);
    setAddress(property.address);
    setCity(property.city);
    setState(property.state);
    setPincode(property.pincode);
    setRent(property.rent);
    setBedrooms(property.bedrooms);
    setBathrooms(property.bathrooms);
    setArea(property.area);
    setDescription(property.description);
    setAdditionalInfo(property.additionalInfo || '');
    setIsAvailable(property.isAvailable);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (
      !name ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !rent ||
      !bedrooms ||
      !bathrooms ||
      !area ||
      !description
    ) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    if (!/^[0-9]{5,8}$/.test(pincode)) {
      showToast('Please enter a valid pincode (5 to 8 digits)', 'error');
      return;
    }

    setSubmitting(true);

    // Build form-data for files upload support
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('pincode', pincode);
    formData.append('rent', rent);
    formData.append('bedrooms', bedrooms);
    formData.append('bathrooms', bathrooms);
    formData.append('area', area);
    formData.append('description', description);
    formData.append('additionalInfo', additionalInfo);
    formData.append('isAvailable', isAvailable);

    // Append multiple files
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    try {
      if (isEditing) {
        await api.put(`/properties/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Property updated successfully!', 'success');
      } else {
        await api.post('/properties', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('New property listing created!', 'success');
      }
      resetForm();
      fetchData();
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Error processing request';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This will cancel all pending and approved bookings.')) {
      return;
    }

    try {
      await api.delete(`/properties/${id}`);
      showToast('Property deleted successfully', 'success');
      fetchData();
    } catch (error) {
      showToast('Failed to delete property', 'error');
    }
  };

  const handleBookingAction = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      showToast(`Booking request ${newStatus.toLowerCase()} successfully!`, 'success');
      fetchData();
    } catch (error) {
      showToast('Failed to update booking status', 'error');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container section">
      <h1 style={styles.title}>Owner Dashboard</h1>
      <p style={styles.subtitle}>List houses, edit information, and approve/reject bookings.</p>

      <div style={styles.grid}>
        {/* Listings & Bookings Section */}
        <div style={styles.leftPane}>
          {/* My Properties Table */}
          <div className="card" style={{ marginBottom: '30px' }}>
            <h3 style={styles.cardHeader}>My Listed Properties</h3>
            {properties.length === 0 ? (
              <div style={styles.empty}>
                <p>You have not listed any properties yet. Fill out the form to add one.</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Property Name</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Rent</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((prop) => (
                      <tr key={prop._id}>
                        <td><strong>{prop.name}</strong></td>
                        <td>{prop.city}, {prop.state}</td>
                        <td>{prop.type}</td>
                        <td>${prop.rent}/mo</td>
                        <td>
                          <span className={`badge ${prop.isAvailable ? 'badge-available' : 'badge-rented'}`}>
                            {prop.isAvailable ? 'Available' : 'Rented'}
                          </span>
                        </td>
                        <td>
                          <div style={styles.actionBtns}>
                            <button
                              onClick={() => handleEditClick(prop)}
                              className="btn btn-secondary"
                              style={styles.tblBtn}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(prop._id)}
                              className="btn btn-danger"
                              style={styles.tblBtn}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Booking Requests Table */}
          <div className="card">
            <h3 style={styles.cardHeader}>Tenant Booking Requests</h3>
            {bookings.length === 0 ? (
              <div style={styles.empty}>
                <p>No booking requests found for your properties.</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Renter Details</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Actions</th>
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
                        <td>
                          {booking.renter ? (
                            <div>
                              <p><strong>{booking.renter.name}</strong></p>
                              <p><small>📞 {booking.renter.phone}</small></p>
                              <p><small>✉️ {booking.renter.email}</small></p>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>
                          <p style={styles.msgText}>{booking.message || 'No custom message'}</p>
                        </td>
                        <td>
                          <span className={`badge badge-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          {booking.status === 'Pending' && booking.property?.isAvailable ? (
                            <div style={styles.actionBtns}>
                              <button
                                onClick={() => handleBookingAction(booking._id, 'Approved')}
                                className="btn btn-success"
                                style={styles.tblBtn}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleBookingAction(booking._id, 'Rejected')}
                                className="btn btn-danger"
                                style={styles.tblBtn}
                              >
                                Reject
                              </button>
                            </div>
                          ) : booking.status === 'Pending' && !booking.property?.isAvailable ? (
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              Property Rented
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              Processed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Property Form */}
        <div style={styles.rightPane}>
          <div className="card">
            <h3 style={styles.cardHeader}>
              {isEditing ? 'Edit Property details' : 'Add Rental Property'}
            </h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label className="form-label">Property Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sunny Heights Penthouse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Property Type *</label>
                  <select
                    className="form-control"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Room">Single Room</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Rent ($) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 1500"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Complete Address *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Street name, landmark..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Austin"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. TX"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 78701"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Area (sq ft) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 1200"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Bedrooms *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 2"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bathrooms *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 1"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Detail the location benefits, appliances, policies..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={submitting}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Information</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Pets allowed, Parking spot included"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {isEditing && (
                <div className="form-group">
                  <label className="form-label">Availability Status</label>
                  <select
                    className="form-control"
                    value={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.value === 'true')}
                    disabled={submitting}
                  >
                    <option value="true">Available</option>
                    <option value="false">Rented / Occupied</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Upload Property Images (Upload up to 5 images)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={submitting}
                  style={styles.fileInput}
                />
                <small style={{ color: 'var(--text-muted)' }}>
                  Selecting new files will append them to the property listings.
                </small>
              </div>

              <div style={styles.formBtns}>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={submitting}
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : isEditing ? 'Update Property' : 'Publish Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '7fr 5fr',
    gap: '30px',
  },
  leftPane: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightPane: {},
  cardHeader: {
    fontSize: '20px',
    color: 'var(--secondary)',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '10px',
  },
  empty: {
    padding: '40px 20px',
    textAlign: 'center',
    color: 'var(--text-muted)',
  },
  actionBtns: {
    display: 'flex',
    gap: '8px',
  },
  tblBtn: {
    padding: '6px 12px',
    fontSize: '12px',
  },
  msgText: {
    fontSize: '13px',
    maxHeight: '80px',
    overflowY: 'auto',
    whiteSpace: 'pre-line',
  },
  fileInput: {
    border: '1px dashed var(--border)',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: 'var(--bg-main)',
    width: '100%',
  },
  formBtns: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
};

// Responsive handling
if (window.innerWidth <= 1024) {
  styles.grid.gridTemplateColumns = '1fr';
}

export default OwnerDashboard;
