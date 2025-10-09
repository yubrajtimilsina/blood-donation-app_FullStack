import { RouterProvider, createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Prospects from './pages/Prospects';
import Donors from './pages/Donors';
import Prospect from './pages/Prospect';
import Donor from './pages/Donor';
import NewDonor from './pages/NewDonor';
import BloodRequests from './pages/BloodRequest';
import DonorPortal from './pages/DonorPortal';
import DonorDashboard from './pages/DonorDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import SearchDonors from './pages/SearchDonors';
import Notifications from './pages/Notifications';
import DonorProfile from './pages/DonorProfile';
import RecipientProfile from './pages/RecipientProfile';
import MyRequests from './pages/MyRequests';
import NearbyRequests from './pages/NearbyRequests';
import AdminUsers from './pages/AdminUsers';
import Hospital from './pages/Hospital';
import HospitalProfile from './pages/HospitalProfile';
import HospitalInventory from './pages/HospitalInventory';
import HospitalRequests from './pages/HospitalRequests';
import HospitalLocalDonors from './pages/HospitalLocalDonors';

// Components
import Menu from './components/Menu';
import DonorNavbar from './components/DonorNavbar';
import RecipientNavbar from './components/RecipientNavbar';
import HospitalNavbar from './components/HospitalNavbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const user = useSelector((state) => state.user.currentUser);

  const AdminLayout = () => (
    <div className='flex'>
      <ScrollToTop />
      <Menu />
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );

  const DonorLayout = () => (
    <div className='min-h-screen'>
      <ScrollToTop />
      <DonorNavbar />
      <Outlet />
    </div>
  );

  const RecipientLayout = () => (
    <div className='min-h-screen'>
      <ScrollToTop />
      <RecipientNavbar />
      <Outlet />
    </div>
  );

  const HospitalLayout = () => (
    <div className='min-h-screen'>
      <ScrollToTop />
      <HospitalNavbar />
      <Outlet />
    </div>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <><ScrollToTop /><Home /></>,
    },
    {
      path: "/register",
      element: user ? <Navigate to={
        user.role === 'admin' ? '/admin' :
        user.role === 'donor' ? '/donor/dashboard' :
        user.role === 'recipient' ? '/recipient/dashboard' :
        '/hospital/dashboard'
      } /> : <><ScrollToTop /><Register /></>,
    },
    {
      path: "/login",
      element: user ? <Navigate to={
        user.role === 'admin' ? '/admin' :
        user.role === 'donor' ? '/donor/dashboard' :
        user.role === 'recipient' ? '/recipient/dashboard' :
        '/hospital/dashboard'
      } /> : <><ScrollToTop /><Login /></>,
    },

    // Admin Routes
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
      ]
    },

    // Donor Routes
    {
      path: "/donor",
      element: (
        <PrivateRoute allowedRoles={['donor']}>
          <DonorLayout />
        </PrivateRoute>
      ),
      children: [
        { path: "dashboard", element: <DonorDashboard /> },
        { path: "notifications", element: <Notifications /> },
        { path: "nearby-requests", element: <NearbyRequests /> },
        { path: "profile", element: <DonorProfile /> },
      ]
    },

    // Recipient Routes
    {
      path: "/recipient",
      element: (
        <PrivateRoute allowedRoles={['recipient']}>
          <RecipientLayout />
        </PrivateRoute>
      ),
      children: [
        { path: "dashboard", element: <RecipientDashboard /> },
        { path: "create-request", element: <BloodRequests /> },
        { path: "search-donors", element: <SearchDonors /> },
        { path: "notifications", element: <Notifications /> },
        { path: "profile", element: <RecipientProfile /> },
        { path: "my-requests", element: <MyRequests /> },
      ]
    },

    // Hospital Routes
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
        { path: "local-donors", element: <HospitalLocalDonors /> },
      ]
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;