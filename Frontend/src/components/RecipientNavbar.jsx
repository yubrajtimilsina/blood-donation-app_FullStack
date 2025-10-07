import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userRedux';
import { FaBars, FaTimes, FaBell, FaHospital, FaSignOutAlt, FaHome, FaSearch, FaPlus } from 'react-icons/fa';

const RecipientNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/recipient/dashboard" className="flex items-center gap-2">
            <FaHospital className="text-red-500 text-2xl" />
            <span className="font-bold text-xl text-gray-800">LifeLink</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/recipient/dashboard"
              className="text-gray-700 hover:text-red-500 font-medium transition-colors flex items-center gap-2"
            >
              <FaHome /> Dashboard
            </Link>
            <Link
              to="/recipient/create-request"
              className="text-gray-700 hover:text-red-500 font-medium transition-colors flex items-center gap-2"
            >
              <FaPlus /> New Request
            </Link>
            <Link
              to="/recipient/search-donors"
              className="text-gray-700 hover:text-red-500 font-medium transition-colors flex items-center gap-2"
            >
              <FaSearch /> Find Donors
            </Link>
            <Link
              to="/recipient/notifications"
              className="text-gray-700 hover:text-red-500 font-medium transition-colors relative"
            >
              <FaBell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </Link>
            
            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold text-gray-800">{user?.name}</div>
                <div className="text-xs text-gray-500">Recipient</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                to="/recipient/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-red-500 font-medium py-2 flex items-center gap-2"
              >
                <FaHome /> Dashboard
              </Link>
              <Link
                to="/recipient/create-request"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-red-500 font-medium py-2 flex items-center gap-2"
              >
                <FaPlus /> New Request
              </Link>
              <Link
                to="/recipient/search-donors"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-red-500 font-medium py-2 flex items-center gap-2"
              >
                <FaSearch /> Find Donors
              </Link>
              <Link
                to="/recipient/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-red-500 font-medium py-2 flex items-center gap-2"
              >
                <FaBell /> Notifications
              </Link>
              <div className="border-t pt-4">
                <div className="font-semibold text-gray-800 mb-2">{user?.name}</div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default RecipientNavbar;