import { Link } from "react-scroll";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="flex items-center justify-between h-20 lg:h-24 px-4 sm:px-8 lg:px-32 xl:px-48 shadow-md bg-white sticky top-0 z-50">
      
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/logo2.png"
          alt="Logo"
          className="cursor-pointer w-20 h-auto sm:w-28 lg:w-32"
        />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
        <Link
          to="hero"
          smooth={true}
          duration={1000}
          className="text-sm lg:text-base font-medium transition duration-300 hover:text-red-500 hover:underline cursor-pointer"
        >
          Home
        </Link>
        <Link
          to="featured"
          smooth={true}
          duration={1000}
          className="text-sm lg:text-base font-medium transition duration-300 hover:text-red-500 hover:underline cursor-pointer"
        >
          About Us
        </Link>
        <Link
          to="contact"
          smooth={true}
          duration={1000}
          className="text-sm lg:text-base font-medium transition duration-300 hover:text-red-500 hover:underline cursor-pointer"
        >
          Contact Us
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <FaTimes className="text-xl text-gray-700" />
        ) : (
          <FaBars className="text-xl text-gray-700" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg border-t">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="hero"
              smooth={true}
              duration={1000}
              onClick={handleMenuClick}
              className="text-base font-medium transition duration-300 hover:text-red-500 hover:underline cursor-pointer py-2"
            >
              Home
            </Link>
            <Link
              to="featured"
              smooth={true}
              duration={1000}
              onClick={handleMenuClick}
              className="text-base font-medium transition duration-300 hover:text-red-500 hover:underline cursor-pointer py-2"
            >
              About Us
            </Link>
            <Link
              to="contact"
              smooth={true}
              duration={1000}
              onClick={handleMenuClick}
              className="text-base font-medium transition duration-300 hover:text-red-500 hover:underline cursor-pointer py-2"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;