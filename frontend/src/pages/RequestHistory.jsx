import api, { getError } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import RequestTable from '../components/RequestTable.jsx';
import Loader from '../components/Loader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

export default function RequestHistory() {
  const { data: requests, loading, error, reload } = useFetch('/requests');
  const { showToast } = useToast();

  const cancel = async (id) => {
    if (!window.confirm('Cancel this request?')) return;
    try {
      await api.put(`/requests/${id}`, { status: 'Cancelled' });
      showToast('Request cancelled');
      reload();
    } catch (err) {
      showToast(getError(err), 'danger');
    }
  };

  return (
    <>
      <h2>My Requests</h2>
      <p className="text-muted">Status and history of all your service requests.</p>
      <ErrorAlert message={error} />
      {loading ? <Loader /> : (
        <RequestTable
          requests={requests}
          showStaff
          renderActions={(r) =>
            ['Pending', 'Assigned'].includes(r.status) && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(r._id)}>Cancel</button>
            )
          }
        />
      )}
    </>
  );
}
