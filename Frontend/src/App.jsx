import { RouterProvider, createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Common Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import Admin from "./pages/Admin";
import Prospects from "./pages/Prospects";
import Donors from "./pages/Donors";
import Prospect from "./pages/Prospect";
import Donor from "./pages/Donor";
import NewDonor from "./pages/NewDonor";
import BloodRequests from "./pages/BloodRequest";
import DonorPortal from "./pages/DonorPortal";

// Donor Pages
import DonorDashboard from "./pages/DonorDashboard";
import Notifications from "./pages/Notifications";

// Recipient Pages
import RecipientDashboard from "./pages/RecipientDashboard";
import SearchDonors from "./pages/SearchDonors";

// Components
import Menu from "./components/Menu";

function App() {
  const user = useSelector((state) => state.user.currentUser);

  // ✅ Layouts
  const AdminLayout = () => (
    <div className="flex min-h-screen">
      <Menu />
      <div className="flex-1 bg-gray-50 p-4">
        <Outlet />
      </div>
    </div>
  );

  const DonorLayout = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <Outlet />
    </div>
  );

  const RecipientLayout = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <Outlet />
    </div>
  );

  // ✅ Protected route based on user role
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  // ✅ Main Router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: user ? (
        <Navigate
          to={
            user.role === "admin"
              ? "/admin"
              : user.role === "donor"
              ? "/donor/dashboard"
              : "/recipient/dashboard"
          }
        />
      ) : (
        <Login />
      ),
    },

    // 🧑‍💼 Admin Routes
    {
      path: "/admin",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
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
      ],
    },

    // 🩸 Donor Routes
    {
      path: "/donor",
      element: (
        <ProtectedRoute allowedRoles={["donor"]}>
          <DonorLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <DonorDashboard /> },
        { path: "notifications", element: <Notifications /> },
        { path: "portal/:id", element: <DonorPortal /> },
        { path: "requests", element: <BloodRequests /> },
      ],
    },

    // ❤️ Recipient Routes
    {
      path: "/recipient",
      element: (
        <ProtectedRoute allowedRoles={["recipient"]}>
          <RecipientLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <RecipientDashboard /> },
        { path: "create-request", element: <BloodRequests /> },
        { path: "search-donors", element: <SearchDonors /> },
        { path: "notifications", element: <Notifications /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
