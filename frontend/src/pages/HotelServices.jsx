import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

export default function HotelServices() {
  const { user } = useAuth();
  const { data: services, loading, error } = useFetch('/services');

  return (
    <div className="container py-4">
      <h2>Hotel Services</h2>
      <p className="text-muted">Everything you need during your stay.</p>
      <ErrorAlert message={error} />
      {loading ? <Loader /> : (
        <div className="row g-3">
          {services.map((s) => (
            <div className="col-md-6 col-lg-4" key={s._id}>
              <div className="hotel-card p-3 h-100 d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <span className="badge bg-navy">{s.category}</span>
                  <span className={`badge ${s.availability ? 'bg-success' : 'bg-secondary'}`}>
                    {s.availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <h5 className="mt-2">{s.serviceName}</h5>
                <p className="text-muted small flex-grow-1">{s.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{s.price > 0 ? `$${s.price}` : 'Free'}</strong>
                  {user?.role === 'guest' && s.availability && (
                    <Link to={`/request/new?serviceId=${s._id}`} className="btn btn-gold btn-sm">Request Service</Link>
                  )}
                  {!user && <Link to="/login" className="btn btn-outline-gold btn-sm">Login to request</Link>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
