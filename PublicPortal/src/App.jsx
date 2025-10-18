// PublicPortal/src/App.jsx
import { RouterProvider, createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import DonorProfile from "./pages/DonorProfile";
import DonorPortal from "./pages/DonorPortal";

import NearbyRequests from "./pages/NearbyRequests";
import RecipientDashboard from "./pages/RecipientDashboard";
import RecipientProfile from "./pages/RecipientProfile";
import MyRequests from "./pages/MyRequests";
import SearchDonors from "./pages/SearchDonors";
import Notifications from "./pages/Notifications";
import CreateBloodRequest from "./pages/CreateBloodRequest";
import DonationHistory from "./pages/DonationHistory";
import EligibilityChecker from "./pages/EligibilityChecker";
import Contact from "./components/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import Chat from "./pages/Chat";

// Components
import DonorNavbar from "./components/DonorNavbar";
import RecipientNavbar from "./components/RecipientNavbar";
import PrivateRoute from "./components/PrivateRoute";
import FloatingChatWidget from "./components/FloatingChatWidget";

function App() {
  const user = useSelector((state) => state.user.currentUser);

  // Donor layout wrapper
  const DonorLayout = () => (
    <div className="min-h-screen">
      <ScrollToTop />
      <DonorNavbar />
      <Outlet />
      <FloatingChatWidget />
    </div>
  );

  // Recipient layout wrapper
  const RecipientLayout = () => (
    <div className="min-h-screen">
      <ScrollToTop />
      <RecipientNavbar />
      <Outlet />
      <FloatingChatWidget />
    </div>
  );

  const router = createBrowserRouter([
    // Public routes
    {
      path: "/",
      element: (
        <>
          <ScrollToTop />
          <Home />
        </>
      ),
    },
    {
      path: "/about",
      element: (
        <>
          <ScrollToTop />
          <About />
        </>
      ),
    },
    {
      path: "/faq",
      element: (
        <>
          <ScrollToTop />
          <FAQ />
        </>
      ),
    },
    {
      path: "/contact",
      element: (
        <>
          <ScrollToTop />
          <Contact />
        </>
      ),
    },

    // Auth routes
    {
      path: "/login",
      element: user ? (
        user.role === "donor" ? (
          <Navigate to="/donor/chat" />
        ) : user.role === "recipient" ? (
          <Navigate to="/recipient/dashboard" />
        ) : (
          <Navigate to="/" />
        )
      ) : (
        <>
          <ScrollToTop />
          <Login />
        </>
      ),
    },
    {
      path: "/register",
      element: user ? (
        user.role === "donor" ? (
          <Navigate to="/donor/chat" />
        ) : user.role === "recipient" ? (
          <Navigate to="/recipient/dashboard" />
        ) : (
          <Navigate to="/" />
        )
      ) : (
        <>
          <ScrollToTop />
          <Register />
        </>
      ),
    },

    // Donor protected routes
    {
      path: "/donor",
      element: (
        <PrivateRoute allowedRoles={["donor"]}>
          <DonorLayout />
        </PrivateRoute>
      ),
      children: [
        { path: "dashboard", element: <DonorDashboard /> },
        { path: "profile/:id", element: <DonorProfile /> },
        { path: "portal/:id", element: <DonorPortal /> },

        { path: "nearby-requests", element: <NearbyRequests /> },
        { path: "eligibility", element: <EligibilityChecker /> }, // ✅ ADD THIS ROUTE
        { path: "history/:id", element: <DonationHistory /> }, // ✅ ADD THIS ROUTE
        { path: "notifications", element: <Notifications /> },
        { path: "chat", element: <Chat /> },
      ],
    },

    // Recipient protected routes
    {
      path: "/recipient",
      element: (
        <PrivateRoute allowedRoles={["recipient"]}>
          <RecipientLayout />
        </PrivateRoute>
      ),
      children: [
        { path: "dashboard", element: <RecipientDashboard /> },
        { path: "profile", element: <RecipientProfile /> },
        { path: "my-requests", element: <MyRequests /> },
        { path: "create-request", element: <CreateBloodRequest /> }, // ✅ ADD THIS ROUTE
        { path: "search-donors", element: <SearchDonors /> },
        { path: "notifications", element: <Notifications /> },
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
