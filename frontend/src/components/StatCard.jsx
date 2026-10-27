export default function StatCard({ label, value, icon }) {
  return (
    <div className="hotel-card stat-card p-3 h-100">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="text-muted small">{label}</div>
          <div className="value">{value}</div>
        </div>
        <div className="fs-2">{icon}</div>
      </div>
    </div>
  );
}
