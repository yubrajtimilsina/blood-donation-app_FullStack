
import { useState } from 'react';
import { publicRequest } from '../requestMethods';
import { FaSearch, FaTint, FaMapMarkerAlt, FaPhone, FaEnvelope, FaComments } from 'react-icons/fa';


const SearchDonors = () => {
  const [searchParams, setSearchParams] = useState({
    bloodgroup: '',
    latitude: '',
    longitude: '',
    radius: 50
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);


  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchParams({
            ...searchParams,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const { latitude, longitude, bloodgroup, radius } = searchParams;

      let url = '/donors/public';
      const params = new URLSearchParams();

      if (latitude && longitude) {
        url = '/donors/search/nearby';
        params.append('latitude', latitude);
        params.append('longitude', longitude);
        params.append('radius', radius);
      }

      if (bloodgroup) {
        params.append('bloodgroup', bloodgroup);
      }

      if (params.toString()) {
        url += '?' + params.toString();
      }

      const res = await publicRequest.get(url);
      setDonors(res.data.data || res.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setDonors([]);
      alert('Failed to search donors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <FaSearch className="text-red-500" />
            Search Blood Donors
          </h1>
          <p className="text-gray-600">Find available donors near your location</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <div className="relative">
                  <FaTint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="bloodgroup"
                    value={searchParams.bloodgroup}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">All Blood Groups</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              {/* Search Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius (km)
                </label>
                <input
                  type="number"
                  name="radius"
                  value={searchParams.radius}
                  onChange={handleChange}
                  min="1"
                  max="200"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={searchParams.latitude}
                  onChange={handleChange}
                  step="0.000001"
                  placeholder="27.7172"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={searchParams.longitude}
                  onChange={handleChange}
                  step="0.000001"
                  placeholder="85.3240"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <FaMapMarkerAlt /> Use My Location
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch /> Search Donors
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Search Results {searched && `(${donors.length} found)`}
            </h2>
          </div>

          {!searched ? (
            <div className="text-center py-12 text-gray-500">
              <FaSearch className="text-6xl mx-auto mb-4 opacity-50" />
              <p>Enter search criteria and click "Search Donors" to find available donors</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            </div>
          ) : donors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaTint className="text-6xl mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No donors found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <div
                  key={donor._id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{donor.name}</h3>
                      <p className="text-sm text-gray-600">{donor.address}</p>
                    </div>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {donor.bloodgroup}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone className="text-gray-400" />
                      <a href={`tel:${donor.tel}`} className="hover:text-red-500">
                        {donor.tel}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-gray-400" />
                      <a href={`mailto:${donor.email}`} className="hover:text-red-500">
                        {donor.email}
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full font-semibold ${
                        donor.isAvailable
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {donor.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <a
                      href={`tel:${donor.tel}`}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors text-center"
                    >
                      Call
                    </a>
                    {donor.userId && (
                      <button
                        onClick={() => {
                          const event = new CustomEvent('openChatModal', {
                            detail: {
                              recipientId: donor.userId._id,
                              recipientName: donor.name,
                              recipientRole: 'donor'
                            }
                          });
                          window.dispatchEvent(event);
                        }}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <FaComments className="text-xs" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default SearchDonors;
