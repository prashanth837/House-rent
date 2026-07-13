import React, { useState } from 'react';
import api from '../services/api';
import { useToast } from './Toast';

const BookingModal = ({ property, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/bookings', {
        propertyId: property._id,
        message,
      });

      showToast('Booking request submitted successfully! Status is now Pending.', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to submit booking request';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Request Booking</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.propertySummary}>
            <p>You are requesting a booking for:</p>
            <h3>{property.name}</h3>
            <p style={styles.subtext}>📍 {property.address}, {property.city}</p>
            <p style={styles.rent}>Monthly Rent: <strong>${property.rent.toLocaleString()}</strong></p>
          </div>

          <div className="form-group">
            <label className="form-label">Add a message to the owner (Optional)</label>
            <textarea
              className="form-control"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself, your expected move-in date, or ask questions about the property..."
            ></textarea>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  propertySummary: {
    backgroundColor: 'var(--bg-main)',
    padding: '16px',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '20px',
    borderLeft: '4px solid var(--primary)',
  },
  subtext: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  rent: {
    marginTop: '8px',
    fontSize: '15px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
};

export default BookingModal;
