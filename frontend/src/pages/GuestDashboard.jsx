import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { guestServices } from '../assets/serviceList.js';
import ServiceCard from '../components/ServiceCard.jsx';
import StatCard from '../components/StatCard.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import Loader from '../components/Loader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

const fmt = (d) => (d ? new Date(d).toLocaleDateString() : 'Not set');

export default function GuestDashboard() {
  const { user } = useAuth();
  const { data: requests, loading, error } = useFetch('/requests');
  const { data: notes } = useFetch('/notifications');

  if (loading) return <Loader />;

  const active = requests?.filter((r) => ['Pending', 'Assigned', 'In Progress'].includes(r.status)) || [];
  const completed = requests?.filter((r) => r.status === 'Completed') || [];
  const unread = notes?.filter((n) => !n.isRead) || [];

  return (
    <>
      <h2>Welcome, {user.name}!</h2>
      <ErrorAlert message={error} />

      <div className="row g-3 my-2">
        <div className="col-6 col-lg-3"><StatCard label="Room Number" value={user.roomNumber || '-'} icon="🚪" /></div>
        <div className="col-6 col-lg-3"><StatCard label="Active Requests" value={active.length} icon="⏳" /></div>
        <div className="col-6 col-lg-3"><StatCard label="Completed" value={completed.length} icon="✅" /></div>
        <div className="col-6 col-lg-3"><StatCard label="Unread Notifications" value={unread.length} icon="🔔" /></div>
      </div>

      <div className="hotel-card p-3 my-3">
        <h5>Current Stay</h5>
        <div className="row small">
          <div className="col-md-4"><strong>Room:</strong> {user.roomNumber || 'Not set'}</div>
          <div className="col-md-4"><strong>Check-in:</strong> {fmt(user.checkInDate)}</div>
          <div className="col-md-4"><strong>Check-out:</strong> {fmt(user.checkOutDate)}</div>
        </div>
      </div>

      <h4 className="mt-4">Available Hotel Services</h4>
      <div className="row g-3 mb-4">
        {guestServices.map((s) => (
          <div className="col-6 col-md-4 col-xl-3" key={s.title}><ServiceCard {...s} /></div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="hotel-card p-3 h-100">
            <div className="d-flex justify-content-between">
              <h5>Active Requests</h5>
              <Link to="/history" className="small">View all</Link>
            </div>
            {active.length === 0 && <p className="text-muted mb-0">No active requests.</p>}
            {active.map((r) => (
              <div key={r._id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                  <Link to={`/requests/${r._id}`}>{r.serviceId?.serviceName}</Link>
                  <div className="small text-muted">{new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-5">
          <div className="hotel-card p-3 h-100">
            <div className="d-flex justify-content-between">
              <h5>Notifications</h5>
              <Link to="/notifications" className="small">View all</Link>
            </div>
            {(!notes || notes.length === 0) && <p className="text-muted mb-0">No notifications yet.</p>}
            {notes?.slice(0, 4).map((n) => (
              <div key={n._id} className={`small border-bottom py-2 ${n.isRead ? 'text-muted' : 'fw-semibold'}`}>{n.message}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
