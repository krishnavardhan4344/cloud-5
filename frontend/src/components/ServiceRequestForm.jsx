import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { getError } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Loader from './Loader.jsx';
import ErrorAlert from './ErrorAlert.jsx';

// Reusable request form. `category` limits the services shown (e.g. "Housekeeping").
export default function ServiceRequestForm({ category, title = 'New Service Request' }) {
  const [params] = useSearchParams();
  const cat = category || params.get('category') || '';
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { data: services, loading, error } = useFetch('/services');

  const [form, setForm] = useState({
    serviceId: params.get('serviceId') || '',
    roomNumber: user.roomNumber || '',
    description: '',
    priority: 'Medium',
  });
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const options = (services || []).filter((s) => s.availability && (!cat || s.category === cat));
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.serviceId) return setFormError('Please select a service');
    if (!form.roomNumber.trim()) return setFormError('Room number is required');
    if (form.description.trim().length < 5) return setFormError('Please describe your request (at least 5 characters)');

    setBusy(true);
    try {
      await api.post('/requests', form);
      showToast('Request submitted successfully');
      navigate('/history');
    } catch (err) {
      setFormError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: 640 }}>
      <h2>{title}</h2>
      <p className="text-muted">Tell us what you need and our team will take care of it.</p>
      <ErrorAlert message={error || formError} />
      <form className="hotel-card p-4" onSubmit={onSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Service</label>
          <select className="form-select" name="serviceId" value={form.serviceId} onChange={onChange}>
            <option value="">Select a service</option>
            {options.map((s) => (
              <option key={s._id} value={s._id}>
                {s.serviceName} {s.price > 0 ? `- $${s.price}` : ''}
              </option>
            ))}
          </select>
          {options.length === 0 && <div className="form-text text-danger">No services available in this category.</div>}
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Room Number</label>
            <input className="form-control" name="roomNumber" value={form.roomNumber} onChange={onChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Priority</label>
            <select className="form-select" name="priority" value={form.priority} onChange={onChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="4" name="description" value={form.description} onChange={onChange}
            placeholder="Describe what you need..." />
        </div>
        <button className="btn btn-gold" disabled={busy}>
          {busy ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
