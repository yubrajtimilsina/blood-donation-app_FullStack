import { useState } from 'react';
import { publicRequest } from '../requestMethods';
import { FaSearch, FaHospital, FaMapMarkerAlt, FaPhone, FaEnvelope, FaComments } from 'react-icons/fa';

const SearchHospitals = () => {
  const [searchParams, setSearchParams] = useState({
    search: '',
    latitude: '',
    longitude: '',
    radius: 50
  });
  const [hospitals, setHospitals] = useState([]);
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
      const { latitude, longitude, search, radius } = searchParams;

      let url = '/hospitals/public';
      const params = new URLSearchParams();

      if (latitude && longitude) {
        url = '/hospitals/nearby';
        params.append('latitude', latitude);
        params.append('longitude', longitude);
        params.append('radius', radius);
      }

      if (search) {
        params.append('search', search);
      }

      if (params.toString()) {
        url += '?' + params.toString();
      }

      const res = await publicRequest.get(url);
      setHospitals(res.data.data || res.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setHospitals([]);
      alert('Failed to search hospitals. Please try again.');
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
            Search Hospitals
          </h1>
          <p className="text-gray-600">Find nearby hospitals to contact for blood donation coordination</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Search by Name/Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Name/Address
                </label>
                <input
                  type="text"
                  name="search"
                  value={searchParams.search}
                  onChange={handleChange}
                  placeholder="Hospital name or address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={searchParams.latitude}
                  onChange={handleChange}
                  placeholder="Your latitude"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={searchParams.longitude}
                  onChange={handleChange}
                  placeholder="Your longitude"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius (km)
                </label>
                <select
                  name="radius"
                  value={searchParams.radius}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FaMapMarkerAlt /> Use My Location
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch /> Search Hospitals
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Search Results ({hospitals.length} hospitals found)
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            ) : hospitals.length === 0 ? (
              <div className="text-center py-12">
                <FaHospital className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No hospitals found matching your criteria.</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your search parameters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals.map((hospital) => (
                  <div key={hospital._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{hospital.name}</h3>
                        <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span>{hospital.address}</span>
                        </div>
                      </div>
                      {hospital.verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhone className="text-gray-400" />
                        <a href={`tel:${hospital.phone}`} className="hover:text-red-500">
                          {hospital.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaEnvelope className="text-gray-400" />
                        <a href={`mailto:${hospital.email}`} className="hover:text-red-500">
                          {hospital.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`tel:${hospital.phone}`}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors text-center"
                      >
                        Call
                      </a>
                      {hospital.userId && (
                        <button
                          onClick={() => {
                            const event = new CustomEvent('openChatModal', {
                              detail: {
                                recipientId: hospital.userId._id,
                                recipientName: hospital.name,
                                recipientRole: 'hospital'
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
        )}
      </div>
    </div>
  );
};

export default SearchHospitals;
