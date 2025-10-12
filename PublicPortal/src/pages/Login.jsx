import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/apiCalls";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // Redirect based on user role
    if (user.currentUser) {
      const role = user.currentUser.role;

      if (role === "admin" || role === "hospital") {
        alert("Please use the Admin/Hospital portal.");
        window.location.href = "http://localhost:5174"; // Admin portal URL
        dispatch(logout());
      } else if (role === "donor") {
        navigate("/donor/dashboard");
      } else if (role === "recipient") {
        navigate("/recipient/dashboard");
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
        alert("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="flex items-center bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full">
        {/* Left Image */}
        <div className="hidden md:block md:w-1/2 h-[600px]">
          <img
            src="/hero1.jpg"
            alt="Login illustration"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Login Form */}
        <div className="p-10 w-full md:w-1/2">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Login to access your donor or recipient dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {user.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                ⚠️ Invalid credentials. Please try again.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-600 text-sm">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-red-500 hover:text-red-600 font-semibold"
              >
                Register here
              </Link>
            </p>

            {/* Admin Portal Link */}
            <p className="text-center text-gray-600 text-sm">
              Admin or Hospital?{" "}
              <a
                href="http://localhost:5174/login"
                className="text-red-500 hover:text-red-600 font-semibold"
              >
                Go to Admin Portal →
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
