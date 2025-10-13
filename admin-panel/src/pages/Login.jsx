import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/apiCalls";
import { logout } from "../redux/userRedux";
import { FaEnvelope, FaLock, FaTint } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // 🔹 Redirect user based on role after successful login
  useEffect(() => {
    if (user.currentUser) {
      const role = user.currentUser.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "hospital") {
        navigate("/hospital/dashboard");
      } else {
        // Non-admin/hospital users
        toast.warn("This portal is for Admin and Hospital only. Redirecting...");
        dispatch(logout());
        setTimeout(() => {
          window.location.href = "http://localhost:5173/login";
        }, 2000);
      }
    }
  }, [user.currentUser, navigate, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        setLoading(true);
        await login(dispatch, { email, password });
      } catch (error) {
        setLoading(false);
        toast.error("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <FaTint className="text-4xl mr-3" />
            <h1 className="text-3xl font-bold">LifeLink Portal</h1>
          </div>
          <p className="text-red-100">Admin & Hospital Access Only</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Sign In to Dashboard
          </h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {user.error && (
              <div className="text-red-500 text-sm text-center font-medium">
                ⚠️ Invalid credentials or unauthorized role.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>



          <div className="mt-3 text-center">
           <p className="text-sm text-gray-600">
                Hospital registration?{" "}
                    <Link
                         to="/register-hospital"
                           className="text-green-500 hover:underline font-medium"
                     >
                        Register Hospital →
                     </Link>
                   </p>
           </div>

          {/* Public Portal Link */}
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              Not an admin or hospital?{" "}
              <Link
                to="http://localhost:5173/login"
                className="text-red-500 hover:underline font-medium"
              >
                Go to Public Portal →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
