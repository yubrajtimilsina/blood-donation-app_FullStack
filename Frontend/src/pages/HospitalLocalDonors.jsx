import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { publicRequest } from '../requestMethods';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaMapMarkerAlt, FaPhone, FaEnvelope, FaTint, FaUser } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';

const HospitalLocalDonors = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
  const [radius, setRadius] = useState(50);

  useEffect(() => {
    fetchLocalDonors();
  }, [radius]);

  useEffect(() => {
    filterDonors();
  }, [donors, searchTerm, bloodGroupFilter]);

  const fetchLocalDonors = async () => {
    try {
      const res = await publicRequest.get(`/hospitals/local-donors?radius=${radius}`, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setDonors(res.data.data || []);
    } catch (error) {
      console.error('Error fetching local donors:', error);
      toast.error('Failed to load local donors');
    } finally {
      setLoading(false);
    }
  };

  const filterDonors = () => {
    let filtered = donors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(donor =>
        donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.phone?.includes(searchTerm)
      );
    }

    // Blood group filter
    if (bloodGroupFilter !== 'all') {
      filtered = filtered.filter(donor => donor.bloodgroup === bloodGroupFilter);
    }

    setFilteredDonors(filtered);
  };

  const getAvailabilityColor = (isAvailable) => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getLastDonationColor = (lastDonationDate) => {
    if (!lastDonationDate) return 'text-gray-500';

    const lastDonation = new Date(lastDonationDate);
    const now = new Date();
    const daysSince = Math.floor((now - lastDonation) / (1000 * 60 * 60 * 24));

    if (daysSince < 56) return 'text-red-600'; // Less than 8 weeks
    if (daysSince < 84) return 'text-yellow-600'; // Less than 12 weeks
    return 'text-green-600'; // Eligible
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/hospital')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaUser className="text-green-600" />
            Local Donors
          </h1>
          <p className="text-gray-600 mt-2">Find and connect with donors in your area</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Donors
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Blood Group Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Blood Groups</option>
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

            {/* Radius Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Radius (km)
              </label>
              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setBloodGroupFilter('all');
                  setRadius(50);
                }}
                className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Donors List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Available Donors ({filteredDonors.length})
            </h2>
          </div>

          {filteredDonors.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No donors found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredDonors.map((donor) => (
                <div key={donor._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-green-600 text-lg" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{donor.name}</h3>
                        <div className="flex items-center gap-2">
                          <FaTint className="text-red-500 text-sm" />
                          <span className="text-sm font-medium text-red-600">{donor.bloodgroup}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(donor.isAvailable)}`}>
                      {donor.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-gray-400" />
                      <span>{donor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaPhone className="text-gray-400" />
                      <span>{donor.phone}</span>
                    </div>
                    {donor.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>Nearby</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Total Donations</p>
                        <p className="font-semibold text-gray-900">{donor.totalDonations || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Donation</p>
                        <p className={`font-semibold ${getLastDonationColor(donor.lastDonationDate)}`}>
                          {donor.lastDonationDate
                            ? new Date(donor.lastDonationDate).toLocaleDateString()
                            : 'Never'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => window.location.href = `tel:${donor.phone}`}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Call
                    </button>
                    <button
                      onClick={() => window.location.href = `mailto:${donor.email}`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Email
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default HospitalLocalDonors;
