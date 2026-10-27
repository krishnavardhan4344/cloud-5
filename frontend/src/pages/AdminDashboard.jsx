import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import useFetch from '../hooks/useFetch.js';
import StatCard from '../components/StatCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

const COLORS = ['#f0ad4e', '#5bc0de', '#0d6efd', '#198754', '#6c757d'];

export default function AdminDashboard() {
  const { data: s, loading, error } = useFetch('/stats');

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <>
      <h2>Admin Dashboard</h2>
      <div className="row g-3 my-2">
        <div className="col-6 col-lg-4"><StatCard label="Total Guests" value={s.totalGuests} icon="🧳" /></div>
        <div className="col-6 col-lg-4"><StatCard label="Total Staff" value={s.totalStaff} icon="👷" /></div>
        <div className="col-6 col-lg-4"><StatCard label="Active Requests" value={s.active} icon="⏳" /></div>
        <div className="col-6 col-lg-4"><StatCard label="Pending Requests" value={s.pending} icon="📋" /></div>
        <div className="col-6 col-lg-4"><StatCard label="Completed Requests" value={s.completed} icon="✅" /></div>
        <div className="col-6 col-lg-4"><StatCard label="Cancelled Requests" value={s.cancelled} icon="🚫" /></div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-lg-6">
          <div className="hotel-card p-3">
            <h6>Requests by service type</h6>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={s.byService}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Requests" fill="#c9a24d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="hotel-card p-3">
            <h6>Daily requests (last 7 days)</h6>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={s.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#1b2a41" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-12">
          <div className="hotel-card p-3">
            <h6>Completed vs pending requests</h6>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={s.statusChart} dataKey="value" nameKey="name" outerRadius={95} label>
                  {s.statusChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
