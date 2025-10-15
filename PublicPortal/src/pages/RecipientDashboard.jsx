import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userRequest } from '../requestMethods';
import { Link } from 'react-router-dom';
import { FaPlus, FaHospital, FaCheckCircle, FaClock, FaTimesCircle, FaSearch } from 'react-icons/fa';

const RecipientDashboard = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [myRequests, setMyRequests] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    fulfilled: 0,
    cancelled: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const res = await userRequest.get(`/bloodRequests?userId=${user._id}`);

      const requests = res.data.data || res.data || [];
      setMyRequests(requests);

      // Calculate stats
      const pending = requests.filter(r => r.status === 'pending').length;
      const fulfilled = requests.filter(r => r.status === 'fulfilled').length;
      const cancelled = requests.filter(r => r.status === 'cancelled').length;

      setStats({
        pending,
        fulfilled,
        cancelled,
        total: requests.length
      });
    } catch (error) {
      console.error('Error fetching requests:', error);
      setMyRequests([]);
      setStats({
        pending: 0,
        fulfilled: 0,
        cancelled: 0,
        total: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Blood Requests</h1>
              <p className="text-gray-600">Manage your blood donation requests</p>
            </div>
            <Link
              to="/recipient/create-request"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <FaPlus /> New Request
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Requests</div>
                <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
              </div>
              <FaHospital className="text-4xl text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Pending</div>
                <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              </div>
              <FaClock className="text-4xl text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Fulfilled</div>
                <div className="text-3xl font-bold text-green-600">{stats.fulfilled}</div>
              </div>
              <FaCheckCircle className="text-4xl text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Cancelled</div>
                <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
              </div>
              <FaTimesCircle className="text-4xl text-red-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Link
            to="/recipient/search-donors"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaSearch className="text-red-500 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Search Donors</h3>
                <p className="text-sm text-gray-600">Find nearby blood donors</p>
              </div>
            </div>
          </Link>

          <Link
            to="/recipient/profile"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaHospital className="text-blue-500 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">My Profile</h3>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </div>
          </Link>

          <Link
            to="/recipient/notifications"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <p className="text-sm text-gray-600">View updates & alerts</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Requests</h2>

          {myRequests.length === 0 ? (
            <div className="text-center py-12">
              <FaHospital className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests yet</h3>
              <p className="text-gray-500 mb-4">Create your first blood request to get started</p>
              <Link
                to="/recipient/create-request"
                className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Request
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div
                  key={request._id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-red-300 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    
                    {/* Left Side - Details */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {request.patientName}
                          </h3>
                          <p className="text-gray-600">{request.hospitalName}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                            {request.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Blood Group:</span>
                          <p className="font-semibold text-red-600">{request.bloodGroup}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Units Needed:</span>
                          <p className="font-semibold text-gray-800">{request.unitsNeeded}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Required By:</span>
                          <p className="font-semibold text-gray-800">
                            {new Date(request.requiredBy).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Contact:</span>
                          <p className="font-semibold text-gray-800">{request.contactNumber}</p>
                        </div>
                      </div>

                      {request.description && (
                        <p className="mt-3 text-gray-600 text-sm">{request.description}</p>
                      )}
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Link
                        to={`/recipient/request/${request._id}`}
                        className="flex-1 lg:flex-none bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm font-semibold transition-colors"
                      >
                        View Details
                      </Link>
                      {request.status === 'pending' && (
                        <button
                          className="flex-1 lg:flex-none bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
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

export default RecipientDashboard;