import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

// Navbar + sidebar + page content (used for all logged-in pages)
export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Navbar />
      <button className="btn btn-dark btn-sm d-md-none w-100 rounded-0" onClick={() => setOpen(!open)}>
        ☰ Menu
      </button>
      <div className="app-shell">
        <Sidebar open={open} onNavigate={() => setOpen(false)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
