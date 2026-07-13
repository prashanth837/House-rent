import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';

// Layout & Security
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PropertyDetails from './pages/PropertyDetails';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div style={styles.app}>
            <Navbar />
            <div style={styles.mainContent}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />

                {/* Renter Protected Routes */}
                <Route
                  path="/renter-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['renter']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute allowedRoles={['renter']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Owner Protected Routes */}
                <Route
                  path="/owner-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['owner']}>
                      <OwnerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <footer style={styles.footer}>
              <div className="container" style={styles.footerContainer}>
                <p>&copy; {new Date().getFullYear()} HouseHunt Inc. All rights reserved.</p>
                <div style={styles.footerLinks}>
                  <a href="#" style={styles.footerLink}>Privacy Policy</a>
                  <a href="#" style={styles.footerLink}>Terms of Service</a>
                  <a href="#" style={styles.footerLink}>Support Contact</a>
                </div>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-main)',
  },
  mainContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: '#0a0d14',
    borderTop: '1px solid #1a2233',
    padding: '30px 0',
    marginTop: '60px',
    color: '#718096',
    fontSize: '14px',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  footerLinks: {
    display: 'flex',
    gap: '20px',
  },
  footerLink: {
    color: '#718096',
    textDecoration: 'none',
  },
};

// Responsive handling
if (window.innerWidth <= 768) {
  styles.footerContainer.flexDirection = 'column';
  styles.footerContainer.textAlign = 'center';
}

export default App;
