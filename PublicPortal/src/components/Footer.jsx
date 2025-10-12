import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import { FaTint, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white mt-12 lg:mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 py-12 lg:py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo2.png" alt="LifeLink" className="w-12 h-12" />
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold">LifeLink</h2>
                <div className="w-16 h-1 bg-red-500 rounded-full mt-1"></div>
              </div>
            </div>
            <p className="text-gray-300 text-sm lg:text-base leading-relaxed mb-6">
              Connecting lives through the power of blood donation. Saving lives, one donation at a time.
            </p>

            {/* Social Media */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Follow us:</p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="text-sm" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-sm" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-sm" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="text-sm" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg lg:text-xl font-semibold mb-4 flex items-center gap-2">
              Quick Links
            </h3>
            <nav className="space-y-3">
              <ScrollLink
                to="hero"
                smooth={true}
                duration={1000}
                className="block text-gray-300 hover:text-red-500 hover:translate-x-2 transition-all duration-300 cursor-pointer text-sm lg:text-base"
              >
                Home
              </ScrollLink>
              <ScrollLink
                to="featured"
                smooth={true}
                duration={1000}
                className="block text-gray-300 hover:text-red-500 hover:translate-x-2 transition-all duration-300 cursor-pointer text-sm lg:text-base"
              >
                About Us
              </ScrollLink>
              <ScrollLink
                to="contact"
                smooth={true}
                duration={1000}
                className="block text-gray-300 hover:text-red-500 hover:translate-x-2 transition-all duration-300 cursor-pointer text-sm lg:text-base"
              >
                Donate Now
              </ScrollLink>
              <RouterLink
                to="/register"
                className="block text-gray-300 hover:text-red-500 hover:translate-x-2 transition-all duration-300 text-sm lg:text-base"
              >
                Register
              </RouterLink>
              <RouterLink
                to="/login"
                className="block text-gray-300 hover:text-red-500 hover:translate-x-2 transition-all duration-300 text-sm lg:text-base"
              >
                Login
              </RouterLink>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg lg:text-xl font-semibold mb-4">
              Contact Us
            </h3>
            <div className="space-y-4 text-sm lg:text-base">
              <div className="flex items-start gap-3 text-gray-300 hover:text-red-500 transition-colors">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                <span>123 LifeLink Avenue<br />Medical District, Pokhara<br />Nepal</span>
              </div>
              <a href="tel:+97712345678" className="flex items-center gap-3 text-gray-300 hover:text-red-500 transition-colors">
                <FaPhone className="flex-shrink-0" />
                <span>+977 1-234-5678</span>
              </a>
              <a href="mailto:info@lifelink.org" className="flex items-center gap-3 text-gray-300 hover:text-red-500 transition-colors">
                <FaEnvelope className="flex-shrink-0" />
                <span className="break-all">info@lifelink.org</span>
              </a>
              <div className="flex items-center gap-3 text-gray-300">
                <FaPhone className="flex-shrink-0" />
                <span>24/7 Emergency Hotline</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-lg lg:text-xl font-semibold mb-4">
              Our Impact
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                <div className="text-2xl font-bold text-red-500">10K+</div>
                <div className="text-xs text-gray-300">Lives Saved</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                <div className="text-2xl font-bold text-red-500">5K+</div>
                <div className="text-xs text-gray-300">Active Donors</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                <div className="text-2xl font-bold text-red-500">100+</div>
                <div className="text-xs text-gray-300">Partner Hospitals</div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 lg:my-12 border-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-center md:text-left">
            <p className="text-gray-400">
              &copy; 2025 <span className="font-semibold text-red-500">LifeLink</span>. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Making a difference in healthcare, one connection at a time.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-xs lg:text-sm">
            <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
            <span className="text-gray-600">•</span>
            <a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a>
            <span className="text-gray-600">•</span>
            <a href="#" className="hover:text-red-500 transition-colors">Sitemap</a>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your data is secure and protected. We never share your information.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;