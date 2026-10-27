import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth, dashboardPath } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-navy px-3" style={{ minHeight: 56 }}>
      <Link to="/" className="brand me-4">🏨 Grand Stay</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="topNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><NavLink className="nav-link" to="/" end>Home</NavLink></li>
          <li className="nav-item"><NavLink className="nav-link" to="/about">About Hotel</NavLink></li>
          <li className="nav-item"><NavLink className="nav-link" to="/services">Services</NavLink></li>
        </ul>
        <div className="d-flex align-items-center gap-2">
          {user ? (
            <>
              <span className="text-light small d-none d-md-inline">
                {user.name} <span className="badge bg-secondary text-capitalize">{user.role}</span>
              </span>
              <Link to={dashboardPath(user.role)} className="btn btn-sm btn-outline-light">Dashboard</Link>
              <button className="btn btn-sm btn-gold" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-outline-light">Login</Link>
              <Link to="/register" className="btn btn-sm btn-gold">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
