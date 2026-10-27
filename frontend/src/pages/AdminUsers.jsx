import { useState } from 'react';
import api, { getError } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

// Manage guests (role="guest") or staff (role="staff")
export default function AdminUsers({ role }) {
  const label = role === 'guest' ? 'Guest' : 'Staff';
  const { data: users, loading, error, reload } = useFetch(`/users?role=${role}`);
  const { showToast } = useToast();
  const empty = { name: '', email: '', password: '', phone: '', roomNumber: '' };
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.email || !form.password) return setFormError('Name, email and password are required');
    if (form.password.length < 6) return setFormError('Password must be at least 6 characters');
    try {
      await api.post('/users', { ...form, role });
      showToast(`${label} added`);
      setForm(empty);
      setShow(false);
      reload();
    } catch (err) {
      setFormError(getError(err));
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name}?`)) return;
    try {
      await api.delete(`/users/${u._id}`);
      showToast(`${label} deleted`);
      reload();
    } catch (err) {
      showToast(getError(err), 'danger');
    }
  };

  const rows = (users || []).filter((u) => `${u.name} ${u.email} ${u.roomNumber}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Manage {label}s</h2>
        <button className="btn btn-gold" onClick={() => setShow(!show)}>{show ? 'Close' : `+ Add ${label}`}</button>
      </div>
      <ErrorAlert message={error} />

      {show && (
        <form className="hotel-card p-3 mb-3" onSubmit={onSubmit} noValidate>
          <ErrorAlert message={formError} />
          <div className="row g-2">
            <div className="col-md-4"><input className="form-control" name="name" placeholder="Full name" value={form.name} onChange={onChange} /></div>
            <div className="col-md-4"><input className="form-control" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} /></div>
            <div className="col-md-4"><input className="form-control" name="password" type="password" placeholder="Password (min 6)" value={form.password} onChange={onChange} /></div>
            <div className="col-md-4"><input className="form-control" name="phone" placeholder="Phone" value={form.phone} onChange={onChange} /></div>
            {role === 'guest' && (
              <div className="col-md-4"><input className="form-control" name="roomNumber" placeholder="Room number" value={form.roomNumber} onChange={onChange} /></div>
            )}
            <div className="col-md-4"><button className="btn btn-gold w-100">Save {label}</button></div>
          </div>
        </form>
      )}

      <div className="hotel-card p-3">
        <input className="form-control mb-3" placeholder="Search by name, email or room..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {loading ? <Loader /> : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th>{role === 'guest' && <th>Room</th>}<th>Joined</th><th></th></tr>
              </thead>
              <tbody>
                {rows.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">No {label.toLowerCase()}s found</td></tr>}
                {rows.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    {role === 'guest' && <td>{u.roomNumber}</td>}
                    <td className="small">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => remove(u)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
