import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const MENUS = {
  guest: [
    ['Dashboard', '/guest'],
    ['Hotel Services', '/services'],
    ['Room Service', '/room-service'],
    ['Housekeeping', '/housekeeping'],
    ['Maintenance', '/maintenance'],
    ['Food Request', '/food-request'],
    ['My Requests', '/history'],
    ['Feedback', '/feedback'],
    ['Notifications', '/notifications'],
    ['Profile', '/profile'],
  ],
  staff: [
    ['My Tasks', '/staff'],
    ['Notifications', '/notifications'],
    ['Profile', '/profile'],
  ],
  admin: [
    ['Dashboard', '/admin'],
    ['Guests', '/admin/guests'],
    ['Staff', '/admin/staff'],
    ['Hotel Services', '/admin/services'],
    ['All Requests', '/admin/requests'],
    ['Feedback', '/admin/feedback'],
    ['Notifications', '/notifications'],
    ['Profile', '/profile'],
  ],
};

export default function Sidebar({ open, onNavigate }) {
  const { user } = useAuth();
  const links = MENUS[user.role] || [];

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="side-title">{user.role} menu</div>
      {links.map(([label, to]) => (
        <NavLink key={to} to={to} end onClick={onNavigate}>
          {label}
        </NavLink>
      ))}
    </aside>
  );
}
