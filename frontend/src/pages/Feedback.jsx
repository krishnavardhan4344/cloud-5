import { useState } from 'react';
import api, { getError } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function Feedback() {
  const { data: list, reload } = useFetch('/feedback');
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (comment.trim().length < 3) return setError('Please write a short comment');
    setBusy(true);
    try {
      await api.post('/feedback', { rating, comment });
      showToast('Thank you for your feedback!');
      setComment('');
      setRating(5);
      reload();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <h2>Feedback</h2>
      <p className="text-muted">How was your stay and our service?</p>
      <ErrorAlert message={error} />
      <form className="hotel-card p-4 mb-4" onSubmit={onSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <select className="form-select" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} - {stars(n)}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea className="form-control" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <button className="btn btn-gold" disabled={busy}>{busy ? 'Sending...' : 'Send Feedback'}</button>
      </form>

      <h5>Your previous feedback</h5>
      {(!list || list.length === 0) && <p className="text-muted">You have not sent any feedback yet.</p>}
      {list?.map((f) => (
        <div key={f._id} className="hotel-card p-3 mb-2">
          <div className="text-warning">{stars(f.rating)}</div>
          <div>{f.comment}</div>
          <div className="small text-muted">{new Date(f.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
