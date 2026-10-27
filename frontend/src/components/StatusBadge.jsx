const STATUS_CLASS = {
  Pending: 'bg-warning text-dark',
  Assigned: 'bg-info text-dark',
  'In Progress': 'bg-primary',
  Completed: 'bg-success',
  Cancelled: 'bg-secondary',
};

const PRIORITY_CLASS = { Low: 'bg-light text-dark border', Medium: 'bg-warning text-dark', High: 'bg-danger' };

export function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_CLASS[status] || 'bg-dark'}`}>{status}</span>;
}

export function PriorityBadge({ priority }) {
  return <span className={`badge ${PRIORITY_CLASS[priority] || 'bg-dark'}`}>{priority}</span>;
}
