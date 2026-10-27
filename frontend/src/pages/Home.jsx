import { Link } from 'react-router-dom';
import { useAuth, dashboardPath } from '../context/AuthContext.jsx';

const features = [
  ['🛎️', 'Request in seconds', 'Order room service, housekeeping, food or repairs from your phone.'],
  ['📍', 'Track live status', 'See when your request is assigned, in progress and completed.'],
  ['⭐', 'Share feedback', 'Tell us how we did so we can keep improving your stay.'],
];

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <section className="hero text-center">
        <div className="container">
          <h1>Welcome to Grand Stay Hotel</h1>
          <p className="lead mb-4">Comfort at your fingertips. Request any hotel service from one simple platform.</p>
          {user ? (
            <Link to={dashboardPath(user.role)} className="btn btn-gold btn-lg">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-gold btn-lg me-2">Register as Guest</Link>
              <Link to="/login" className="btn btn-outline-light btn-lg">Login</Link>
            </>
          )}
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-4">Why use our guest platform?</h2>
        <div className="row g-4">
          {features.map(([icon, title, text]) => (
            <div className="col-md-4" key={title}>
              <div className="hotel-card p-4 text-center h-100">
                <div className="service-icon">{icon}</div>
                <h5 className="mt-2">{title}</h5>
                <p className="text-muted mb-0">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/services" className="btn btn-outline-gold">View all hotel services</Link>
        </div>
      </section>
    </>
  );
}
