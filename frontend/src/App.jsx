import { Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import PublicLayout from './components/PublicLayout.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import HotelServices from './pages/HotelServices.jsx';

import GuestDashboard from './pages/GuestDashboard.jsx';
import RoomService from './pages/RoomService.jsx';
import Housekeeping from './pages/Housekeeping.jsx';
import MaintenanceRequest from './pages/MaintenanceRequest.jsx';
import FoodRequest from './pages/FoodRequest.jsx';
import ServiceRequestPage from './pages/ServiceRequestPage.jsx';
import RequestHistory from './pages/RequestHistory.jsx';
import Feedback from './pages/Feedback.jsx';

import StaffDashboard from './pages/StaffDashboard.jsx';

import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminServices from './pages/AdminServices.jsx';
import AdminRequests from './pages/AdminRequests.jsx';
import AdminFeedback from './pages/AdminFeedback.jsx';

import RequestDetails from './pages/RequestDetails.jsx';
import Profile from './pages/Profile.jsx';
import Notifications from './pages/Notifications.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<HotelServices />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Guest only */}
      <Route element={<ProtectedRoute roles={['guest']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/guest" element={<GuestDashboard />} />
          <Route path="/room-service" element={<RoomService />} />
          <Route path="/housekeeping" element={<Housekeeping />} />
          <Route path="/maintenance" element={<MaintenanceRequest />} />
          <Route path="/food-request" element={<FoodRequest />} />
          <Route path="/request/new" element={<ServiceRequestPage />} />
          <Route path="/history" element={<RequestHistory />} />
          <Route path="/feedback" element={<Feedback />} />
        </Route>
      </Route>

      {/* Staff only */}
      <Route element={<ProtectedRoute roles={['staff']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/staff" element={<StaffDashboard />} />
        </Route>
      </Route>

      {/* Admin only */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/guests" element={<AdminUsers role="guest" />} />
          <Route path="/admin/staff" element={<AdminUsers role="staff" />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
        </Route>
      </Route>

      {/* Any logged-in user */}
      <Route element={<ProtectedRoute roles={['guest', 'staff', 'admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/requests/:id" element={<RequestDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <div className="text-center py-5">
            <h2>404 - Page not found</h2>
            <Link to="/" className="btn btn-gold mt-3">Go Home</Link>
          </div>
        }
      />
    </Routes>
  );
}
