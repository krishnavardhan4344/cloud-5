import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, dashboardPath } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getError } from '../services/api.js';
import ErrorAlert from '../components/ErrorAlert.jsx';

const DEMO = {
  Guest: ['guest1@hotel.com', 'guest123'],
  Staff: ['staff1@hotel.com', 'staff123'],
  Admin: ['admin@hotel.com', 'admin123'],
};

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please enter your email and password');
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      showToast(`Welcome back, ${user.name}!`);
      navigate(dashboardPath(user.role), { replace: true });
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="hotel-card p-4 auth-card">
        <h3 className="text-center mb-3">Login</h3>
        <ErrorAlert message={error} />
        <form onSubmit={onSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={onChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={onChange} />
          </div>
          <button className="btn btn-gold w-100" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="text-center mt-3 mb-2">
          New guest? <Link to="/register">Create an account</Link>
        </p>
        <hr />
        <div className="small text-muted mb-2">Demo accounts (click to fill):</div>
        <div className="d-flex gap-2">
          {Object.entries(DEMO).map(([label, [email, password]]) => (
            <button key={label} type="button" className="btn btn-sm btn-outline-secondary"
              onClick={() => setForm({ email, password })}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
