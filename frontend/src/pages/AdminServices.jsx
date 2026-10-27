import { useState } from 'react';
import api, { getError } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

const CATEGORIES = ['Room Service', 'Housekeeping', 'Laundry', 'Food', 'Maintenance', 'Transport', 'Amenities'];

export default function AdminServices() {
  const { data: services, loading, error, reload } = useFetch('/services');
  const { showToast } = useToast();
  const empty = { serviceName: '', description: '', category: 'Housekeeping', price: 0 };
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState('');
  const [show, setShow] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.serviceName.trim()) return setFormError('Service name is required');
    if (Number(form.price) < 0) return setFormError('Price cannot be negative');
    try {
      await api.post('/services', { ...form, price: Number(form.price) });
      showToast('Service added');
      setForm(empty);
      setShow(false);
      reload();
    } catch (err) {
      setFormError(getError(err));
    }
  };

  const toggle = async (s) => {
    try {
      await api.put(`/services/${s._id}`, { availability: !s.availability });
      reload();
    } catch (err) {
      showToast(getError(err), 'danger');
    }
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.serviceName}"?`)) return;
    try {
      await api.delete(`/services/${s._id}`);
      showToast('Service deleted');
      reload();
    } catch (err) {
      showToast(getError(err), 'danger');
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Hotel Services</h2>
        <button className="btn btn-gold" onClick={() => setShow(!show)}>{show ? 'Close' : '+ Add Service'}</button>
      </div>
      <ErrorAlert message={error} />

      {show && (
        <form className="hotel-card p-3 mb-3" onSubmit={onSubmit} noValidate>
          <ErrorAlert message={formError} />
          <div className="row g-2">
            <div className="col-md-4"><input className="form-control" name="serviceName" placeholder="Service name" value={form.serviceName} onChange={onChange} /></div>
            <div className="col-md-4">
              <select className="form-select" name="category" value={form.category} onChange={onChange}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-4"><input className="form-control" type="number" min="0" name="price" placeholder="Price" value={form.price} onChange={onChange} /></div>
            <div className="col-md-8"><input className="form-control" name="description" placeholder="Description" value={form.description} onChange={onChange} /></div>
            <div className="col-md-4"><button className="btn btn-gold w-100">Save Service</button></div>
          </div>
        </form>
      )}

      <div className="hotel-card p-3">
        {loading ? <Loader /> : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead><tr><th>Service</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id}>
                    <td>{s.serviceName}<div className="small text-muted">{s.description}</div></td>
                    <td>{s.category}</td>
                    <td>{s.price > 0 ? `$${s.price}` : 'Free'}</td>
                    <td><span className={`badge ${s.availability ? 'bg-success' : 'bg-secondary'}`}>{s.availability ? 'Available' : 'Unavailable'}</span></td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => toggle(s)}>
                        {s.availability ? 'Disable' : 'Enable'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(s)}>Delete</button>
                    </td>
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
