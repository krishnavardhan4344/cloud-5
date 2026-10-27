import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from './StatusBadge.jsx';

const STATUSES = ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];

// Table of service requests with search + status filter
export default function RequestTable({ requests = [], showGuest = false, showStaff = false, renderActions }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const q = search.toLowerCase();
  const rows = requests.filter((r) => {
    const text = [r.serviceId?.serviceName, r.roomNumber, r.description, r.guestId?.name].join(' ').toLowerCase();
    return text.includes(q) && (!status || r.status === status);
  });

  return (
    <div className="hotel-card p-3">
      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Search by service, room, guest or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              {showGuest && <th>Guest</th>}
              <th>Room</th>
              <th>Priority</th>
              <th>Status</th>
              {showStaff && <th>Staff</th>}
              <th>Requested</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan="9" className="text-center text-muted py-4">No requests found</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r._id}>
                <td className="text-muted small">#{r._id.slice(-6)}</td>
                <td>{r.serviceId?.serviceName || 'Removed service'}</td>
                {showGuest && (
                  <td>
                    {r.guestId?.name || 'Deleted guest'}
                    <div className="small text-muted">{r.guestId?.phone}</div>
                  </td>
                )}
                <td>{r.roomNumber}</td>
                <td><PriorityBadge priority={r.priority} /></td>
                <td><StatusBadge status={r.status} /></td>
                {showStaff && <td>{r.assignedStaff?.name || <span className="text-muted">Unassigned</span>}</td>}
                <td className="small">{new Date(r.createdAt).toLocaleString()}</td>
                <td>
                  <div className="d-flex gap-1 flex-wrap align-items-center">
                    <Link to={`/requests/${r._id}`} className="btn btn-sm btn-outline-secondary">View</Link>
                    {renderActions && renderActions(r)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
