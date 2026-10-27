import { Link } from 'react-router-dom';

export default function ServiceCard({ icon, title, text, to }) {
  return (
    <div className="hotel-card service-card p-3 h-100 text-center">
      <div className="service-icon">{icon}</div>
      <h5 className="mt-2">{title}</h5>
      <p className="text-muted small">{text}</p>
      <Link to={to} className="btn btn-gold btn-sm">Request Service</Link>
    </div>
  );
}
