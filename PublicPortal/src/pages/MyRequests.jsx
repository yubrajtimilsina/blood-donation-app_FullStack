import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { publicRequest } from '../requestMethods';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaEye, FaTimesCircle } from 'react-icons/fa';

const MyRequests = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, fulfilled, cancelled

  useEffect(() => {
    fetchMyRequests();
  }, [filter]);

  const fetchMyRequests = async () => {
    try {
      let url = `/bloodrequests?userId=${user._id}`;
      if (filter !== 'all') {
        url += `&status=${filter}`;
      }

      const res = await publicRequest.get(url, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setRequests(res.data.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    try {
      await publicRequest.put(
        `/bloodrequests/${id}`,
        { status: 'cancelled' },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      fetchMyRequests();
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Failed to cancel request');
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaClipboardList className="text-red-500" />
                My Blood Requests
              </h1>
              <p className="text-gray-600 mt-1">{requests.length} total requests</p>
            </div>
            <Link
              to="/recipient/create-request"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              + New Request
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'fulfilled', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors ${
                  filter === status
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No requests found
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' ? 'Create your first blood request' : `No ${filter} requests`}
            </p>
            <Link
              to="/recipient/create-request"
              className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  
                  {/* Request Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Blood Group:</span>
                        <p className="font-semibold text-red-600">{request.bloodGroup}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Units:</span>
                        <p className="font-semibold">{request.unitsNeeded}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Required By:</span>
                        <p className="font-semibold">
                          {new Date(request.requiredBy).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <p className="font-semibold">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">{request.address}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Link
                      to={`/recipient/request/${request._id}`}
                      className="flex-1 lg:flex-none bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEye /> View
                    </Link>
                    {request.status === 'pending' && (
                      <button
                        onClick={() => cancelRequest(request._id)}
                        className="flex-1 lg:flex-none bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <FaTimesCircle /> Cancel
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
  );
};

export default MyRequests;