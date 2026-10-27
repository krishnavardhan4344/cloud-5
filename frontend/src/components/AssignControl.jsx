import { useState } from 'react';
import api, { getError } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

// Admin: pick a staff member and assign the request
export default function AssignControl({ request, staff = [], onDone }) {
  const [staffId, setStaffId] = useState(request.assignedStaff?._id || '');
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  if (['Completed', 'Cancelled'].includes(request.status)) return null;

  const assign = async () => {
    if (!staffId) return showToast('Select a staff member first', 'danger');
    setBusy(true);
    try {
      await api.put(`/requests/${request._id}/assign`, { staffId });
      showToast('Request assigned');
      onDone && onDone();
    } catch (err) {
      showToast(getError(err), 'danger');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="d-flex gap-1">
      <select className="form-select form-select-sm" style={{ minWidth: 130 }} value={staffId} onChange={(e) => setStaffId(e.target.value)}>
        <option value="">Select staff</option>
        {staff.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>
      <button className="btn btn-sm btn-gold" disabled={busy} onClick={assign}>Assign</button>
    </div>
  );
}
