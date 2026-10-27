import { Link, useParams } from 'react-router-dom';
import api, { getError } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge.jsx';
import AssignControl from '../components/AssignControl.jsx';
import Loader from '../components/Loader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

// Loads the staff list so the admin can assign from this page
function AdminAssign({ request, onDone }) {
  const { data: staff } = useFetch('/staff');
  return <AssignControl key={request.status} request={request} staff={staff || []} onDone={onDone} />;
}

export default function RequestDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: r, loading, error, reload } = useFetch(`/requests/${id}`);

  const updateStatus = async (status) => {
    try {
      await api.put(`/requests/${id}`, { status });
      showToast(`Request marked ${status}`);
      reload();
    } catch (err) {
      showToast(getError(err), 'danger');
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;

  const row = (label, value) => (
    <div className="row py-2 border-bottom">
      <div className="col-sm-4 text-muted">{label}</div>
      <div className="col-sm-8">{value}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 760 }}>
      <h2>Request Details</h2>
      <div className="hotel-card p-4 mb-3">
        {row('Request ID', `#${r._id.slice(-6)}`)}
        {row('Service', `${r.serviceId?.serviceName || 'Removed service'} (${r.serviceId?.category || '-'})`)}
        {row('Room', r.roomNumber)}
        {row('Description', r.description)}
        {row('Priority', <PriorityBadge priority={r.priority} />)}
        {row('Status', <StatusBadge status={r.status} />)}
        {row('Assigned staff', r.assignedStaff ? `${r.assignedStaff.name} (${r.assignedStaff.phone || 'no phone'})` : 'Not assigned yet')}
        {row('Requested at', new Date(r.createdAt).toLocaleString())}
        {row('Last updated', new Date(r.updatedAt).toLocaleString())}
      </div>

      {user.role !== 'guest' && (
        <div className="hotel-card p-4 mb-3">
          <h5>Guest Details</h5>
          {row('Name', r.guestId?.name || 'Deleted guest')}
          {row('Email', r.guestId?.email)}
          {row('Phone', r.guestId?.phone || '-')}
          {row('Room', r.guestId?.roomNumber || r.roomNumber)}
        </div>
      )}

      <div className="d-flex gap-2 flex-wrap align-items-center">
        {user.role === 'guest' && ['Pending', 'Assigned'].includes(r.status) && (
          <button className="btn btn-outline-danger" onClick={() => updateStatus('Cancelled')}>Cancel Request</button>
        )}
        {user.role === 'guest' && r.status === 'Completed' && (
          <Link to="/feedback" className="btn btn-gold">Give Feedback</Link>
        )}
        {user.role === 'staff' && r.status === 'Assigned' && (
          <button className="btn btn-primary" onClick={() => updateStatus('In Progress')}>Accept & Start</button>
        )}
        {user.role === 'staff' && r.status === 'In Progress' && (
          <button className="btn btn-success" onClick={() => updateStatus('Completed')}>Mark Completed</button>
        )}
        {user.role === 'admin' && <AdminAssign request={r} onDone={reload} />}
        <button className="btn btn-outline-secondary" onClick={() => window.history.back()}>Back</button>
      </div>
    </div>
  );
}
