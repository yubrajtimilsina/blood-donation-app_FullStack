import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { publicRequest } from '../requestMethods';
import { FaTint, FaBell, FaMapMarkerAlt, FaHistory, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DonorDashboard = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [donorProfile, setDonorProfile] = useState(null);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch donor profile
      const profileRes = await publicRequest.get('/donors/' + user.donorProfile, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setDonorProfile(profileRes.data);

      // Fetch nearby requests
      const requestsRes = await publicRequest.get('/bloodrequests/nearby?radius=50', {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setNearbyRequests(requestsRes.data.data || []);

      // Fetch donation history
      if (profileRes.data._id) {
        const historyRes = await publicRequest.get(`/donors/${profileRes.data._id}/history`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });
        setDonationHistory(historyRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      await publicRequest.put(
        `/donors/${donorProfile._id}/availability`,
        { isAvailable: !donorProfile.isAvailable },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      setDonorProfile({ ...donorProfile, isAvailable: !donorProfile.isAvailable });
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const calculateNextDonation = () => {
    if (!donorProfile?.nextEligibleDate) return 'Not set';
    const nextDate = new Date(donorProfile.nextEligibleDate);
    const today = new Date();
    const daysLeft = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0) return 'Eligible now!';
    return `${daysLeft} days`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
              <p className="text-red-100">Thank you for being a life-saving hero</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{donorProfile?.bloodgroup}</div>
              <div className="text-red-100 text-sm">Blood Type</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <FaTint className="text-3xl text-red-500" />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {donorProfile?.totalDonations || 0}
                </div>
                <div className="text-sm text-gray-600">Total Donations</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <FaBell className="text-3xl text-blue-500" />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {nearbyRequests.length}
                </div>
                <div className="text-sm text-gray-600">Nearby Requests</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <FaHistory className="text-3xl text-green-500" />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {calculateNextDonation()}
                </div>
                <div className="text-sm text-gray-600">Next Eligible</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-2">Availability</div>
                <button
                  onClick={toggleAvailability}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    donorProfile?.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {donorProfile?.isAvailable ? (
                    <>
                      <FaToggleOn className="text-xl" /> Available
                    </>
                  ) : (
                    <>
                      <FaToggleOff className="text-xl" /> Unavailable
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Nearby Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  Nearby Blood Requests
                </h2>
                <Link
                  to="/donor/nearby-requests"
                  className="text-red-500 hover:text-red-600 text-sm font-semibold"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {nearbyRequests.slice(0, 5).map((request) => (
                  <div
                    key={request._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{request.patientName}</h3>
                        <p className="text-sm text-gray-600">{request.hospitalName}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                          {request.bloodGroup}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.urgency === 'critical' ? 'bg-red-500 text-white' :
                          request.urgency === 'high' ? 'bg-orange-100 text-orange-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {request.urgency.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <p><strong>Units needed:</strong> {request.unitsNeeded}</p>
                      <p><strong>Required by:</strong> {new Date(request.requiredBy).toLocaleDateString()}</p>
                    </div>
                    <a
                      href={`tel:${request.contactNumber}`}
                      className="text-red-500 hover:text-red-600 text-sm font-semibold"
                    >
                      📞 Contact: {request.contactNumber}
                    </a>
                  </div>
                ))}

                {nearbyRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FaMapMarkerAlt className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>No nearby requests at the moment</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Donation History */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaHistory className="text-blue-500" />
                Recent Donations
              </h2>

              <div className="space-y-3">
                {donationHistory.slice(0, 5).map((donation, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-red-500 pl-3 py-2"
                  >
                    <div className="font-semibold text-gray-800">
                      Donation #{donationHistory.length - index}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(donation.donationDate).toLocaleDateString()}
                    </div>
                    {donation.location?.hospitalName && (
                      <div className="text-xs text-gray-500">
                        {donation.location.hospitalName}
                      </div>
                    )}
                  </div>
                ))}

                {donationHistory.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No donation history yet</p>
                  </div>
                )}
              </div>

              <Link
                to={`/donor/history/${donorProfile?._id}`}
                className="block text-center mt-4 text-red-500 hover:text-red-600 text-sm font-semibold"
              >
                View Full History
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to={`/donor/profile/${user.donorProfile}`}
                  className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-center transition-colors"
                >
                  Edit Profile
                </Link>
                <Link
                  to="/donor/notifications"
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-center transition-colors"
                >
                  View Notifications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;