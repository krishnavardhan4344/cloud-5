import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, dashboardPath } from '../context/AuthContext.jsx';
import Loader from './Loader.jsx';

// Only lets logged-in users with an allowed role see the nested pages
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={dashboardPath(user.role)} replace />;
  return <Outlet />;
}
