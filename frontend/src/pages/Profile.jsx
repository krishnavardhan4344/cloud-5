import { useState } from 'react';
import api, { getError } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    roomNumber: user.roomNumber || '',
    password: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Name is required');
    if (form.password && form.password.length < 6) return setError('New password must be at least 6 characters');
    setBusy(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (user.role === 'guest') payload.roomNumber = form.roomNumber;
      if (form.password) payload.password = form.password;
      const { data } = await api.put(`/users/${user._id}`, payload);
      setUser(data);
      setForm({ ...form, password: '' });
      showToast('Profile updated');
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h2>My Profile</h2>
      <ErrorAlert message={error} />
      <form className="hotel-card p-4" onSubmit={onSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Email (cannot be changed)</label>
          <input className="form-control" value={user.email} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <input className="form-control text-capitalize" value={user.role} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input className="form-control" name="name" value={form.name} onChange={onChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input className="form-control" name="phone" value={form.phone} onChange={onChange} />
        </div>
        {user.role === 'guest' && (
          <div className="mb-3">
            <label className="form-label">Room Number</label>
            <input className="form-control" name="roomNumber" value={form.roomNumber} onChange={onChange} />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">New Password (leave blank to keep current)</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={onChange} />
        </div>
        <button className="btn btn-gold" disabled={busy}>{busy ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}
