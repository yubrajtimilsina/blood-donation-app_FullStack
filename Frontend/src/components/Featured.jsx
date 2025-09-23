import { useState, useEffect } from 'react';

const Featured = () => {
  const [stats, setStats] = useState({
    livesSaved: 0,
    activeDonors: 0,
    partnerHospitals: 0,
    bloodUnits: 0
  });

  // Animation effect for counting numbers
  useEffect(() => {
    const targetStats = {
      livesSaved: 1200,
      activeDonors: 800,
      partnerHospitals: 10,
      bloodUnits: 2500
    };

    const duration = 2000; // 2 seconds
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

    // Clear timer after animation completes
    setTimeout(() => {
      clearInterval(timer);
      setStats(targetStats);
    }, duration);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center px-4 md:px-8 lg:px-32 xl:px-48 mt-20 gap-8">
      {/* Content Section */}
      <div className="bg-gray-50 rounded-2xl shadow-xl p-8 lg:p-10 flex-1 max-w-lg transform hover:scale-105 transition-transform duration-300">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Who we are?
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6"></div>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
           LifeLink is a public donation center connecting blood donors with those in need, 
            revolutionizing healthcare through community-driven support.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <span className="text-gray-700">Specialist blood donors with clinical supervision</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <span className="text-gray-700">Enhanced communication with our community members</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <span className="text-gray-700">High quality assessment, diagnosis and treatment</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <span className="text-gray-700">Critical examination to ensure perfect alignment</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">5</span>
              </div>
              <span className="text-gray-700">Extra care from our multi-disciplinary team</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-8 lg:p-10 text-white flex-1 max-w-lg transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">Our Impact</h2>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Lives Saved */}
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold">{stats.livesSaved.toLocaleString()}+</h3>
            <p className="text-red-100 text-sm">Lives Saved</p>
          </div>

          {/* Active Donors */}
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v-3h2l1 4h2l1-4h2v3h3v4H4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM6.5 11.5c.83 0 1.5-.67 1.5-1.5S7.33 8.5 6.5 8.5 5 9.17 5 10s.67 1.5 1.5 1.5z"/>
              </svg>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold">{stats.activeDonors.toLocaleString()}+</h3>
            <p className="text-red-100 text-sm">Active Donors</p>
          </div>

          {/* Partner Hospitals */}
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold">{stats.partnerHospitals}+</h3>
            <p className="text-red-100 text-sm">Partner Hospitals</p>
          </div>

          {/* Blood Units Collected */}
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
              </svg>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold">{stats.bloodUnits.toLocaleString()}+</h3>
            <p className="text-red-100 text-sm">Blood Units</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <button className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-red-50 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Join Our Mission
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default Featured;