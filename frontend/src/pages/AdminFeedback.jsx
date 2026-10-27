import useFetch from '../hooks/useFetch.js';
import Loader from '../components/Loader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function AdminFeedback() {
  const { data: list, loading, error } = useFetch('/feedback');
  const avg = list && list.length ? (list.reduce((sum, f) => sum + f.rating, 0) / list.length).toFixed(1) : '-';

  return (
    <>
      <h2>Guest Feedback</h2>
      <p className="text-muted">Average rating: <strong>{avg}</strong> from {list?.length || 0} reviews</p>
      <ErrorAlert message={error} />
      {loading ? <Loader /> : (
        <div className="hotel-card p-3">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead><tr><th>Guest</th><th>Room</th><th>Rating</th><th>Comment</th><th>Date</th></tr></thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No feedback yet</td></tr>}
                {list.map((f) => (
                  <tr key={f._id}>
                    <td>{f.guestId?.name || 'Deleted guest'}</td>
                    <td>{f.guestId?.roomNumber}</td>
                    <td className="text-warning text-nowrap">{stars(f.rating)}</td>
                    <td>{f.comment}</td>
                    <td className="small">{new Date(f.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
