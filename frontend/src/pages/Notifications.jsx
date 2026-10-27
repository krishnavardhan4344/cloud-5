import api, { getError } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

export default function Notifications() {
  const { data: notes, loading, error, reload } = useFetch('/notifications');
  const { showToast } = useToast();

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      reload();
    } catch (err) {
      showToast(getError(err), 'danger');
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <h2>Notifications</h2>
      <ErrorAlert message={error} />
      {loading ? <Loader /> : (
        <>
          {notes.length === 0 && <p className="text-muted">You have no notifications.</p>}
          {notes.map((n) => (
            <div key={n._id} className={`hotel-card p-3 mb-2 d-flex justify-content-between align-items-center ${n.isRead ? 'opacity-75' : ''}`}>
              <div>
                <div className={n.isRead ? '' : 'fw-semibold'}>
                  {!n.isRead && <span className="badge bg-warning text-dark me-2">New</span>}
                  {n.message}
                </div>
                <div className="small text-muted">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              {!n.isRead && <button className="btn btn-sm btn-outline-secondary" onClick={() => markRead(n._id)}>Mark read</button>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
