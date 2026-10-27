import api, { getError } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import RequestTable from '../components/RequestTable.jsx';
import AssignControl from '../components/AssignControl.jsx';
import Loader from '../components/Loader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

export default function AdminRequests() {
  const { data: requests, loading, error, reload } = useFetch('/requests');
  const { data: staff } = useFetch('/staff');
  const { showToast } = useToast();

  const remove = async (id) => {
    if (!window.confirm('Delete this request permanently?')) return;
    try {
      await api.delete(`/requests/${id}`);
      showToast('Request deleted');
      reload();
    } catch (err) {
      showToast(getError(err), 'danger');
    }
  };

  return (
    <>
      <h2>All Service Requests</h2>
      <p className="text-muted">Monitor every request and assign it to a staff member.</p>
      <ErrorAlert message={error} />
      {loading ? <Loader /> : (
        <RequestTable
          requests={requests}
          showGuest
          showStaff
          renderActions={(r) => (
            <>
              <AssignControl key={r._id + r.status} request={r} staff={staff || []} onDone={reload} />
              <button className="btn btn-sm btn-outline-danger" onClick={() => remove(r._id)}>Delete</button>
            </>
          )}
        />
      )}
    </>
  );
}
