import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter state
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  // Fetch properties with filters
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      if (city) params.city = city;
      if (type) params.type = type;
      if (minRent) params.minRent = minRent;
      if (maxRent) params.maxRent = maxRent;
      if (bedrooms) params.bedrooms = bedrooms;
      params.isAvailable = true; // only browse available properties on home

      const response = await api.get('/properties', { params });
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleResetFilters = () => {
    setCity('');
    setType('');
    setMinRent('');
    setMaxRent('');
    setBedrooms('');
    // We cannot immediately query with empty states since setState is async,
    // so we fetch directly with empty params.
    setLoading(true);
    api.get('/properties', { params: { isAvailable: true } })
      .then((res) => {
        setProperties(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div>
      {/* Hero Section */}
      <header style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Find Your Perfect Rental Home</h1>
          <p style={styles.heroSubtitle}>
            HouseHunt connects property owners with verified tenants. Find villas, apartments, rooms, and houses at premium rates.
          </p>
        </div>
      </header>

      {/* Filter and Search Section */}
      <section className="container" style={styles.filterSection}>
        <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
          <div style={styles.searchGrid}>
            <div className="form-group">
              <label className="form-label">Location (City)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. New York, London"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Room">Single Room</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Max Rent ($)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Budget cap"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bedrooms</label>
              <select
                className="form-control"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4+ Beds</option>
              </select>
            </div>
          </div>

          <div style={styles.formActions}>
            <button type="button" className="btn btn-secondary" onClick={handleResetFilters}>
              Reset Filters
            </button>
            <button type="submit" className="btn btn-primary" style={{ minWidth: '140px' }}>
              Search Properties
            </button>
          </div>
        </form>
      </section>

      {/* Properties Display */}
      <main className="container section">
        <h2 style={styles.sectionHeader}>Available Rentals</h2>
        {loading ? (
          <Spinner />
        ) : properties.length === 0 ? (
          <div style={styles.noResults}>
            <h3>No Properties Found</h3>
            <p>Try resetting the search filters or choosing a different city.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  hero: {
    background: 'radial-gradient(circle at 10% 20%, #1a2233 0%, #0a0d14 90%)',
    color: '#ffffff',
    padding: '80px 0',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '44px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#a0aec0',
    lineHeight: '1.6',
  },
  filterSection: {
    marginTop: '-40px',
    position: 'relative',
    zIndex: 10,
  },
  searchForm: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
    border: '1px solid var(--border)',
  },
  searchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  sectionHeader: {
    fontSize: '28px',
    marginBottom: '24px',
    color: 'var(--secondary)',
  },
  noResults: {
    textAlign: 'center',
    padding: '60px 0',
    color: 'var(--text-muted)',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px dashed var(--border)',
  },
};

export default Home;
