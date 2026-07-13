import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  // If property images exist, load the first image. Otherwise, use a default image placeholder
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    return `${baseUrl}/${imagePath}`;
  };

  const imageUrl = getImageUrl(property.images && property.images.length > 0 ? property.images[0] : null);

  return (
    <div className="card" style={styles.card}>
      <div style={styles.imgContainer}>
        <img src={imageUrl} alt={property.name} style={styles.img} />
        <span
          className={`badge ${property.isAvailable ? 'badge-available' : 'badge-rented'}`}
          style={styles.badge}
        >
          {property.isAvailable ? 'Available' : 'Rented'}
        </span>
      </div>
      <div style={styles.content}>
        <div style={styles.rentRow}>
          <span style={styles.rent}>${property.rent.toLocaleString()}/mo</span>
          <span style={styles.type}>{property.type}</span>
        </div>
        <h3 style={styles.title}>{property.name}</h3>
        <p style={styles.location}>📍 {property.city}, {property.state}</p>
        
        <div style={styles.features}>
          <span style={styles.featureItem}>🛏️ {property.bedrooms} Bed</span>
          <span style={styles.featureItem}>🛁 {property.bathrooms} Bath</span>
          <span style={styles.featureItem}>📐 {property.area} sqft</span>
        </div>

        <div style={styles.footer}>
          <Link to={`/properties/${property._id}`} className="btn btn-primary" style={styles.btn}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  imgContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  rentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  rent: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--primary)',
  },
  type: {
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '700',
    color: 'var(--text-muted)',
    backgroundColor: 'var(--bg-main)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px',
    color: 'var(--secondary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  location: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    marginBottom: '16px',
  },
  features: {
    display: 'flex',
    gap: '12px',
    padding: '12px 0',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    marginBottom: '16px',
  },
  featureItem: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
  },
  btn: {
    width: '100%',
  },
};

export default PropertyCard;
