import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import BookingModal from '../components/BookingModal';
import { useToast } from '../components/Toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data);
      if (response.data.images && response.data.images.length > 0) {
        setSelectedImage(response.data.images[0]);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      showToast('Property details not found', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!property) {
    return (
      <div className="container section text-center">
        <h2>Property Not Found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const handleBookClick = () => {
    if (!user) {
      showToast('Please login to book a property', 'warning');
      navigate('/login');
      return;
    }
    
    if (user.role !== 'renter') {
      showToast('Only renters can book properties', 'warning');
      return;
    }

    setShowBookingModal(true);
  };

  const imagesList = property.images && property.images.length > 0 ? property.images : [];
  const defaultPlaceholder = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80';

  const getImageUrl = (imagePath) => {
    if (!imagePath) return defaultPlaceholder;
    if (imagePath.startsWith('http')) return imagePath;
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    return `${baseUrl}/${imagePath}`;
  };

  return (
    <div className="container section">
      <Link to="/" style={styles.backLink}>← Back to Browse</Link>
      
      <div style={styles.grid}>
        {/* Images Gallery */}
        <div style={styles.gallery}>
          <div style={styles.mainImgContainer}>
            <img
              src={getImageUrl(selectedImage)}
              alt={property.name}
              style={styles.mainImg}
            />
          </div>
          {imagesList.length > 0 && (
            <div style={styles.thumbnailRow}>
              {imagesList.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    ...styles.thumbnailContainer,
                    borderColor: selectedImage === img ? 'var(--primary)' : 'var(--border)',
                  }}
                >
                  <img src={getImageUrl(img)} alt="" style={styles.thumbnail} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Pane */}
        <div style={styles.detailsPane}>
          <div style={styles.header}>
            <span className={`badge ${property.isAvailable ? 'badge-available' : 'badge-rented'}`}>
              {property.isAvailable ? 'Available' : 'Rented'}
            </span>
            <span style={styles.type}>{property.type}</span>
          </div>

          <h1 style={styles.title}>{property.name}</h1>
          <p style={styles.location}>📍 {property.address}, {property.city}, {property.state} - {property.pincode}</p>

          <div style={styles.priceRow}>
            <span style={styles.rent}>${property.rent.toLocaleString()}</span>
            <span style={styles.rentLabel}>/ month</span>
          </div>

          {/* Configuration Grid */}
          <div style={styles.configs}>
            <div style={styles.configItem}>
              <span style={styles.configVal}>{property.bedrooms}</span>
              <span style={styles.configLbl}>Bedrooms</span>
            </div>
            <div style={styles.configItem}>
              <span style={styles.configVal}>{property.bathrooms}</span>
              <span style={styles.configLbl}>Bathrooms</span>
            </div>
            <div style={styles.configItem}>
              <span style={styles.configVal}>{property.area}</span>
              <span style={styles.configLbl}>Area (sq ft)</span>
            </div>
          </div>

          {/* Description */}
          <div style={styles.descSection}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.descText}>{property.description}</p>
          </div>

          {/* Additional Info */}
          {property.additionalInfo && (
            <div style={styles.descSection}>
              <h3 style={styles.sectionTitle}>Additional Information</h3>
              <p style={styles.descText}>{property.additionalInfo}</p>
            </div>
          )}

          {/* Owner details */}
          <div style={styles.ownerSection}>
            <h3 style={styles.sectionTitle}>Owner Details</h3>
            <p><strong>Name:</strong> {property.ownerName}</p>
            <p><strong>Contact:</strong> {property.ownerContact}</p>
          </div>

          {/* Booking Request CTA */}
          <div style={styles.ctaBox}>
            {property.isAvailable ? (
              user && user._id === property.owner ? (
                <div style={styles.alert}>You are the owner of this listing.</div>
              ) : user && user.role === 'admin' ? (
                <div style={styles.alert}>Logged in as Administrator.</div>
              ) : (
                <button onClick={handleBookClick} className="btn btn-primary" style={styles.ctaBtn}>
                  Book This Property
                </button>
              )
            ) : (
              <button className="btn btn-secondary" style={styles.ctaBtn} disabled>
                Property Already Rented
              </button>
            )}
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          property={property}
          onClose={() => setShowBookingModal(false)}
          onSuccess={fetchProperty}
        />
      )}
    </div>
  );
};

const styles = {
  backLink: {
    display: 'inline-block',
    marginBottom: '24px',
    fontSize: '15px',
    fontWeight: '600',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '7fr 5fr',
    gap: '40px',
  },
  gallery: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  mainImgContainer: {
    height: '460px',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    backgroundColor: '#cbd5e1',
    boxShadow: 'var(--shadow-md)',
  },
  mainImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbnailRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  thumbnailContainer: {
    width: '80px',
    height: '60px',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'var(--transition)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  detailsPane: {
    backgroundColor: 'var(--bg-surface)',
    padding: '30px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  type: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--primary)',
    backgroundColor: 'var(--primary-light)',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  title: {
    fontSize: '32px',
    color: 'var(--secondary)',
    marginBottom: '10px',
  },
  location: {
    fontSize: '15px',
    color: 'var(--text-muted)',
    marginBottom: '20px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '24px',
  },
  rent: {
    fontSize: '36px',
    fontWeight: '800',
    color: 'var(--primary)',
  },
  rentLabel: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    marginLeft: '6px',
  },
  configs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    textAlign: 'center',
    backgroundColor: 'var(--bg-main)',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '30px',
  },
  configItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  configVal: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--secondary)',
  },
  configLbl: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  descSection: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '10px',
    color: 'var(--secondary)',
    borderBottom: '2px solid var(--bg-main)',
    paddingBottom: '6px',
  },
  descText: {
    fontSize: '14px',
    color: 'var(--text-main)',
    whiteSpace: 'pre-line',
  },
  ownerSection: {
    backgroundColor: 'var(--bg-main)',
    padding: '16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    marginBottom: '30px',
  },
  ctaBox: {
    marginTop: '20px',
  },
  ctaBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
  },
  alert: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    padding: '12px',
    borderRadius: '6px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '14px',
  },
};

// Simple responsive styling override via inline javascript media check helper
if (window.innerWidth <= 768) {
  styles.grid.gridTemplateColumns = '1fr';
  styles.mainImgContainer.height = '300px';
}

export default PropertyDetails;
