import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts';
import LoadingState from './LoadingState';

export default function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState variant="admin" title="Preparing the admin dashboard" subtitle="Gathering metrics and recent activity" />;
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: 480, padding: 32, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,107,107,0.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <ShieldAlert size={28} style={{ color: 'var(--accent)' }} />
          </div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Admin access required</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 20 }}>Your current account does not have permission to view the admin dashboard.</p>
          <a href="/" className="btn btn-primary">Return home</a>
        </div>
      </div>
    );
  }

  return children;
}
