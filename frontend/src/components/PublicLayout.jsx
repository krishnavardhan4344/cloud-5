import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 130px)' }}>
        <Outlet />
      </div>
      <footer className="footer">© {new Date().getFullYear()} Grand Stay Hotel · Guest Service Management Platform</footer>
    </>
  );
}
