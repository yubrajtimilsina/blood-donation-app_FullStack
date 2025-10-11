import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaSignInAlt, FaUserPlus, FaTint } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="/logo2.png" alt="LifeLink" className="h-8 w-8 lg:h-10 lg:w-10" />
            <span className="font-bold text-xl lg:text-2xl text-gray-800">LifeLink</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <ScrollLink
              to="hero"
              smooth={true}
              duration={1000}
              className="text-sm lg:text-base font-medium text-gray-700 hover:text-red-500 transition duration-300 cursor-pointer"
            >
              Home
            </ScrollLink>
            <ScrollLink
              to="featured"
              smooth={true}
              duration={1000}
              className="text-sm lg:text-base font-medium text-gray-700 hover:text-red-500 transition duration-300 cursor-pointer"
            >
              About Us
            </ScrollLink>
            <ScrollLink
              to="contact"
              smooth={true}
              duration={1000}
              className="text-sm lg:text-base font-medium text-gray-700 hover:text-red-500 transition duration-300 cursor-pointer"
            >
              Donate Now
            </ScrollLink>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm lg:text-base font-medium text-gray-700 hover:text-red-500 transition duration-300"
            >
              <FaSignInAlt />
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg"
            >
              <FaUserPlus />
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-2xl text-gray-700" />
            ) : (
              <FaBars className="text-2xl text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-4 space-y-3">
              
              {/* Navigation Links */}
              <ScrollLink
                to="hero"
                smooth={true}
                duration={1000}
                onClick={handleMenuClick}
                className="block text-base font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 py-2 px-3 rounded-lg transition duration-300 cursor-pointer"
              >
                Home
              </ScrollLink>
              <ScrollLink
                to="featured"
                smooth={true}
                duration={1000}
                onClick={handleMenuClick}
                className="block text-base font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 py-2 px-3 rounded-lg transition duration-300 cursor-pointer"
              >
                About Us
              </ScrollLink>
              <ScrollLink
                to="contact"
                smooth={true}
                duration={1000}
                onClick={handleMenuClick}
                className="block text-base font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 py-2 px-3 rounded-lg transition duration-300 cursor-pointer"
              >
                Donate Now
              </ScrollLink>

              {/* Divider */}
              <div className="border-t border-gray-200 my-3"></div>

              {/* Auth Buttons */}
              <Link
                to="/login"
                onClick={handleMenuClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition duration-300"
              >
                <FaSignInAlt />
                Login
              </Link>
              <Link
                to="/register"
                onClick={handleMenuClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition duration-300"
              >
                <FaUserPlus />
                Register Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;