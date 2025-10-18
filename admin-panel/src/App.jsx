// admin-panel/src/App.jsx
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import HospitalRegister from './pages/HospitalRegister'; // ✅ ADD THIS IMPORT
import Admin from './pages/Admin';
import AdminUsers from './pages/AdminUsers';
import Prospects from './pages/Prospects';
import Prospect from './pages/Prospect';
import Donors from './pages/Donors';
import Donor from './pages/Donor';
import NewDonor from './pages/NewDonor'; 
import BloodRequests from './pages/BloodRequest';
import Hospital from './pages/Hospital';
import HospitalInventory from './pages/HospitalInventory';
import HospitalDonors from './pages/HospitalDonors';
import HospitalProfile from './pages/HospitalProfile';
import HospitalRequests from './pages/HospitalRequests';
import DonorPortal from './pages/DonorPortal';
import HospitalNotifications from './pages/HospitalNotifications';
import Chat from './pages/Chat';
// Components
import Menu from './components/Menu';
import HospitalNavbar from './components/HospitalNavbar';
import PrivateRoute from './components/PrivateRoute';
import FloatingChatWidget from './components/FloatingChatWidget';

function App() {
  const user = useSelector((state) => state.user.currentUser);

  // 🔹 Admin Layout (Menu + Outlet)
  const AdminLayout = () => (
    <div className="flex">
      <Menu />
      <div className="flex-1 p-4">
        <ScrollToTop />
        <Outlet />
        <FloatingChatWidget />
      </div>
    </div>
  );

  // 🔹 Hospital Layout (Navbar + Outlet)
  const HospitalLayout = () => (
    <div>
      <HospitalNavbar />
      <div className="p-4">
        <ScrollToTop />
        <Outlet />
        <FloatingChatWidget />
      </div>
    </div>
  );

  // 🔹 Router Setup
  const router = createBrowserRouter([
    // Home redirect logic
    {
      path: "/",
      element: user ? (
        user.role === 'admin' ? <Navigate to="/admin" /> :
        user.role === 'hospital' ? <Navigate to="/hospital/dashboard" /> :
        <Navigate to="/login" />
      ) : (
        <Navigate to="/login" />
      ),
    },

    // Login route
    {
      path: "/login",
      element: user ? (
        user.role === 'admin' ? <Navigate to="/admin" /> :
        user.role === 'hospital' ? <Navigate to="/hospital/dashboard" /> :
        <Navigate to="/login" />
      ) : (
        <Login />
      ),
    },

    // ✅ Register route (General - can redirect based on role)
    {
      path: "/register",
      element: <Register />,
    },

    // ✅ NEW: Hospital-specific registration route
    {
      path: "/register-hospital",
      element: <HospitalRegister />,
    },

    // 🔹 Admin routes (Protected)
    {
      path: "/admin",
      element: (
        <PrivateRoute allowedRoles={['admin']}>
          <AdminLayout />
        </PrivateRoute>
      ),
      children: [
        { path: "", element: <Admin /> },
        { path: "prospects", element: <Prospects /> },
        { path: "donors", element: <Donors /> },
        { path: "prospect/:id", element: <Prospect /> },
        { path: "newdonor", element: <NewDonor /> },
        { path: "donor/:id", element: <Donor /> },
        { path: "donor-portal/:id", element: <DonorPortal /> },
        { path: "bloodRequests", element: <BloodRequests /> },
        { path: "users", element: <AdminUsers /> },
        { path: "chat", element: <Chat /> },
      ],
    },

    // 🔹 Hospital routes (Protected)
    {
      path: "/hospital",
      element: (
        <PrivateRoute allowedRoles={['hospital']}>
          <HospitalLayout />
        </PrivateRoute>
      ),
      children: [
        { path: "dashboard", element: <Hospital /> },
        { path: "profile", element: <HospitalProfile /> },
        { path: "inventory", element: <HospitalInventory /> },
        { path: "requests", element: <HospitalRequests /> },
        { path: "local-donors", element: <HospitalDonors /> },
        { path: "notifications", element: <HospitalNotifications /> },
        { path: "donor-portal/:id", element: <DonorPortal /> },
        { path: "chat", element: <Chat /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
     
    </>
  );
}

export default App;
