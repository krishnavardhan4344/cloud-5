import api, { getError } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import StatCard from '../components/StatCard.jsx';
import RequestTable from '../components/RequestTable.jsx';
import Loader from '../components/Loader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { data: requests, loading, error, reload } = useFetch('/requests');
  const { showToast } = useToast();

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/requests/${id}`, { status });
      showToast(`Request marked ${status}`);
      reload();
    } catch (err) {
      showToast(getError(err), 'danger');
    }
  };

  if (loading) return <Loader />;
  const count = (s) => requests?.filter((r) => r.status === s).length || 0;

  return (
    <>
      <h2>Staff Dashboard</h2>
      <p className="text-muted">Welcome, {user.name}. These are the requests assigned to you.</p>
      <ErrorAlert message={error} />

      <div className="row g-3 mb-3">
        <div className="col-md-4"><StatCard label="New (Assigned)" value={count('Assigned')} icon="📥" /></div>
        <div className="col-md-4"><StatCard label="In Progress" value={count('In Progress')} icon="🛠️" /></div>
        <div className="col-md-4"><StatCard label="Completed" value={count('Completed')} icon="✅" /></div>
      </div>

      <RequestTable
        requests={requests}
        showGuest
        renderActions={(r) => (
          <>
            {r.status === 'Assigned' && (
              <button className="btn btn-sm btn-primary" onClick={() => updateStatus(r._id, 'In Progress')}>Accept</button>
            )}
            {r.status === 'In Progress' && (
              <button className="btn btn-sm btn-success" onClick={() => updateStatus(r._id, 'Completed')}>Complete</button>
            )}
          </>
        )}
      />
    </>
  );
}
