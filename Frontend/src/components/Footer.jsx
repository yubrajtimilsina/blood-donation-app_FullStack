// Note: Replace with actual react-router-dom Link component in your project
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
);

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12 md:mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo2.png" 
                alt="LifeLink Logo" 
                className="h-12 w-12 md:h-16 md:w-16 object-contain" 
              />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">LifeLink</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mt-1"></div>
              </div>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Connecting lives through the power of blood donation. 
              Saving lives, one donation at a time.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 max-w-md">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-red-600">10K+</div>
                <div className="text-xs text-gray-500">Lives Saved</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-red-600">5K+</div>
                <div className="text-xs text-gray-500">Donors</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-red-600">100+</div>
                <div className="text-xs text-gray-500">Hospitals</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Quick Links
            </h3>
            <nav className="space-y-3">
              <Link to="/" className="block text-gray-600 hover:text-red-600 hover:underline transition-colors duration-200">
                Home
              </Link>
              <Link to="/about" className="block text-gray-600 hover:text-red-600 hover:underline transition-colors duration-200">
                About Us
              </Link>
              <Link to="/donate" className="block text-gray-600 hover:text-red-600 hover:underline transition-colors duration-200">
                Donate Now
              </Link>
              <Link to="/contact" className="block text-gray-600 hover:text-red-600 hover:underline transition-colors duration-200">
                Contact
              </Link>
              <Link to="/login" className="block text-gray-600 hover:text-red-600 hover:underline transition-colors duration-200">
                Admin Portal
              </Link>
              <Link to="/emergency" className="block text-red-600 hover:text-red-700 hover:underline font-semibold transition-colors duration-200">
                Emergency Request
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Contact Us
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">123 LifeLink Avenue<br />Medical District, Kathmandu<br />Nepal 44600</span>
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-sm">+977 1-234-5678</span>
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm">info@lifelink.org</span>
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">24/7 Emergency Hotline<br />Available Always</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-red-200" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-600 text-sm">
              &copy; 2024 <span className="font-semibold text-red-600">LifeLink</span>. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Making a difference in healthcare, one connection at a time.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">Follow us:</span>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-md hover:shadow-lg hover:bg-red-50 transition-all duration-200 group"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.5 0h-19A2.5 2.5 0 000 2.5v19A2.5 2.5 0 002.5 24h10.156v-8.797H9.548v-3.23h3.108V9.03c0-3.067 1.872-4.736 4.605-4.736 1.31 0 2.435.097 2.76.14v3.202l-1.897.001c-1.49 0-1.779.708-1.779 1.747v2.289h3.557l-.464 3.23h-3.093V24H21.5a2.5 2.5 0 002.5-2.5v-19A2.5 2.5 0 0021.5 0z" />
                </svg>
              </a>
              
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-md hover:shadow-lg hover:bg-red-50 transition-all duration-200 group"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.23 5.924c-.813.36-1.684.603-2.598.711a4.517 4.517 0 001.984-2.486c-.867.514-1.826.888-2.847 1.09a4.503 4.503 0 00-7.673 4.106 12.78 12.78 0 01-9.292-4.71 4.501 4.501 0 001.392 6.008 4.482 4.482 0 01-2.044-.563v.057a4.504 4.504 0 003.605 4.416 4.515 4.515 0 01-2.036.077 4.506 4.506 0 004.205 3.127 9.034 9.034 0 01-5.602 1.932c-.363 0-.722-.021-1.079-.064a12.765 12.765 0 006.917 2.027c8.304 0 12.847-6.878 12.847-12.847 0-.195-.004-.39-.014-.583a9.183 9.183 0 002.252-2.343c-.825.367-1.71.614-2.63.723a4.518 4.518 0 001.979-2.495z" />
                </svg>
              </a>
              
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-md hover:shadow-lg hover:bg-red-50 transition-all duration-200 group"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-md hover:shadow-lg hover:bg-red-50 transition-all duration-200 group"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;