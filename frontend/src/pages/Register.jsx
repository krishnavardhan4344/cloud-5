import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getError } from '../services/api.js';
import ErrorAlert from '../components/ErrorAlert.jsx';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', roomNumber: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password) return setError('Name, email and password are required');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email address');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirm) return setError('Passwords do not match');

    setBusy(true);
    try {
      const { confirm, ...data } = form;
      await register(data);
      showToast('Account created. Welcome!');
      navigate('/guest', { replace: true });
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="hotel-card p-4 auth-card">
        <h3 className="text-center mb-3">Guest Registration</h3>
        <ErrorAlert message={error} />
        <form onSubmit={onSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input className="form-control" name="name" value={form.name} onChange={onChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={onChange} />
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Phone</label>
              <input className="form-control" name="phone" value={form.phone} onChange={onChange} />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Room Number</label>
              <input className="form-control" name="roomNumber" value={form.roomNumber} onChange={onChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={form.password} onChange={onChange} />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Confirm</label>
              <input type="password" className="form-control" name="confirm" value={form.confirm} onChange={onChange} />
            </div>
          </div>
          <button className="btn btn-gold w-100" disabled={busy}>{busy ? 'Creating account...' : 'Register'}</button>
        </form>
        <p className="text-center mt-3 mb-0">Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
