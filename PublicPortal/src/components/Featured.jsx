import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaUsers, FaHospital, FaTint, FaCheckCircle } from 'react-icons/fa';

const Featured = () => {
  const [stats, setStats] = useState({
    livesSaved: 0,
    activeDonors: 0,
    partnerHospitals: 0,
    bloodUnits: 0
  });

  // Animation effect 
  useEffect(() => {
    const targetStats = {
      livesSaved: 1200,
      activeDonors: 800,
      partnerHospitals: 10,
      bloodUnits: 2500
    };

    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    const timer = setInterval(() => {
      setStats(prevStats => ({
        livesSaved: Math.min(prevStats.livesSaved + Math.ceil(targetStats.livesSaved / steps), targetStats.livesSaved),
        activeDonors: Math.min(prevStats.activeDonors + Math.ceil(targetStats.activeDonors / steps), targetStats.activeDonors),
        partnerHospitals: Math.min(prevStats.partnerHospitals + Math.ceil(targetStats.partnerHospitals / steps), targetStats.partnerHospitals),
        bloodUnits: Math.min(prevStats.bloodUnits + Math.ceil(targetStats.bloodUnits / steps), targetStats.bloodUnits)
      }));
    }, increment);

    setTimeout(() => {
      clearInterval(timer);
      setStats(targetStats);
    }, duration);

    return () => clearInterval(timer);
  }, []);

  const features = [
    "Specialist blood donors with clinical supervision",
    "Enhanced communication with our community members",
    "High quality assessment, diagnosis and treatment",
    "Find nearby donors and blood banks instantly",
    "Extra care from our multi-disciplinary team"
  ];

  return (
    <div className="py-12 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Who We Are
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-6"></div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            LifeLink is a public donation center connecting blood donors with those in need,
            revolutionizing healthcare through community-driven support.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content - About */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
              Our Mission
            </h3>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                    <FaCheckCircle className="text-white text-xs sm:text-sm" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm sm:text-base text-gray-600 italic">
                "Every donation is a gift of life. Join us in our mission to save lives and build a healthier community."
              </p>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 text-white transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl lg:text-3xl font-bold text-center mb-8">Our Impact</h3>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
              
              {/* Lives Saved */}
              <div className="text-center bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <FaHeart className="text-3xl sm:text-4xl mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  {stats.livesSaved.toLocaleString()}+
                </div>
                <p className="text-red-100 text-xs sm:text-sm mt-2">Lives Saved</p>
              </div>

              {/* Active Donors */}
              <div className="text-center bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <FaUsers className="text-3xl sm:text-4xl mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  {stats.activeDonors.toLocaleString()}+
                </div>
                <p className="text-red-100 text-xs sm:text-sm mt-2">Active Donors</p>
              </div>

              {/* Partner Hospitals */}
              <div className="text-center bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <FaHospital className="text-3xl sm:text-4xl mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  {stats.partnerHospitals}+
                </div>
                <p className="text-red-100 text-xs sm:text-sm mt-2">Partner Hospitals</p>
              </div>

              {/* Blood Units */}
              <div className="text-center bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <FaTint className="text-3xl sm:text-4xl mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  {stats.bloodUnits.toLocaleString()}+
                </div>
                <p className="text-red-100 text-xs sm:text-sm mt-2">Blood Units</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link
                to="/register"
                className="bg-white text-red-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:bg-red-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
              >
                Become a Donor
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl sm:text-3xl font-bold text-red-500">100%</div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">Safe & Secure</p>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl sm:text-3xl font-bold text-red-500">24/7</div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">Support Available</p>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl sm:text-3xl font-bold text-red-500">Fast</div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">Response Time</p>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl sm:text-3xl font-bold text-red-500">Free</div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">For All Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;