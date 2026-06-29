import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VendorsPage from './pages/VendorsPage';
import QuotationsPage from './pages/QuotationsPage';
import ComparisonPage from './pages/ComparisonPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <span className="material-symbols-outlined text-[48px] animate-spin text-secondary">
          progress_activity
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#161B2E',
                borderRadius: '12px',
                border: '1px solid #ECEEF5',
                boxShadow: '0 8px 24px -4px rgba(16,24,53,0.12)',
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#4F46E5',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#DC2626',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Main Application Layout Protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="quotations" element={<QuotationsPage />} />
              <Route path="comparison" element={<ComparisonPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;