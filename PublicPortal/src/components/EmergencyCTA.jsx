import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaPhone, FaMapMarkerAlt, FaClock, FaTint } from 'react-icons/fa';

const EmergencyCTA = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const emergencyContacts = [
    { name: "Emergency Hotline", number: "+977 987635433", available: "24/7" },
    { name: "Blood Bank Kathmandu", number: "+977 123456789", available: "24/7" },
    { name: "Pokhara Medical Center", number: "+977 987654321", available: "24/7" }
  ];

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <FaExclamationTriangle className="text-yellow-300 text-2xl animate-bounce" />
            <span className="text-lg font-semibold">Emergency Blood Request</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Need Blood Urgently?
          </h2>
          <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed">
            Don't wait! Our emergency response team is ready to help you find compatible donors within minutes.
          </p>
        </div>

        {/* Main CTA */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Side - Emergency Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <FaTint className="text-white text-xl" />
                </div>
                <div>
                 <h3 className="text-2xl font-bold">Immediate Response</h3>
                 <p className="text-red-100">Average response time: &lt; 30 minutes</p>
                </div>

              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Location-Based Matching</h3>
                  <p className="text-red-100">Find donors in your area instantly</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <FaClock className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">24/7 Support</h3>
                  <p className="text-red-100">Round-the-clock emergency assistance</p>
                </div>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3">
                <FaPhone className="text-xl" />
                Call Emergency Hotline
              </button>

              <Link
                to="/register"
                className="w-full bg-red-500 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <FaTint className="text-xl" />
                Create Emergency Request
              </Link>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaMapMarkerAlt className="text-xl" />
                {isExpanded ? 'Hide' : 'Show'} Emergency Contacts
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Emergency Contacts */}
        {isExpanded && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-fadeIn">
            <h3 className="text-2xl font-bold text-center mb-6">Emergency Blood Banks & Hospitals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                  <h4 className="text-xl font-semibold mb-2">{contact.name}</h4>
                  <p className="text-red-200 mb-3">{contact.available}</p>
                  <a
                    href={`tel:${contact.number}`}
                    className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaPhone />
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 text-center">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold text-yellow-300">500+</div>
            <div className="text-sm text-red-100">Emergency Responses</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold text-yellow-300">30min</div>
            <div className="text-sm text-red-100">Average Response</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold text-yellow-300">95%</div>
            <div className="text-sm text-red-100">Success Rate</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold text-yellow-300">24/7</div>
            <div className="text-sm text-red-100">Availability</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCTA;
