import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { publicRequest } from '../requestMethods';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaTint, FaHospital, FaUser, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const RequestDetails = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user.currentUser);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const res = await publicRequest.get(`/bloodrequests/${id}`, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setRequest(res.data.data);
    } catch (error) {
      console.error('Error fetching request details:', error);
      setError('Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async () => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    try {
      await publicRequest.put(
        `/bloodrequests/${id}`,
        { status: 'cancelled' },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      setRequest({ ...request, status: 'cancelled' });
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Failed to cancel request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fulfilled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaExclamationTriangle className="text-yellow-600" />;
      case 'fulfilled':
        return <FaCheckCircle className="text-green-600" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-blue-500 text-white';
      case 'low':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Request</h2>
            <p className="text-gray-600 mb-6">{error || 'Request not found'}</p>
            <Link
              to="/recipient/my-requests"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <FaArrowLeft /> Back to My Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/recipient/my-requests"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft /> Back to My Requests
            </Link>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(request.status)}`}>
              {getStatusIcon(request.status)}
              <span className="font-semibold capitalize">{request.status}</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{request.patientName}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <FaHospital className="text-red-500" />
                {request.hospitalName}
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`px-4 py-2 rounded-lg font-semibold ${getUrgencyColor(request.urgency)}`}>
                {request.urgency.toUpperCase()} PRIORITY
              </span>
              {request.status === 'pending' && (
                <button
                  onClick={cancelRequest}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Blood Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaTint className="text-red-500" />
                Blood Requirements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{request.bloodGroup}</div>
                  <div className="text-sm text-gray-600">Blood Group</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{request.unitsNeeded}</div>
                  <div className="text-sm text-gray-600">Units Needed</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {request.unitsReceived || 0}
                  </div>
                  <div className="text-sm text-gray-600">Units Received</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {request.unitsNeeded - (request.unitsReceived || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Units Remaining</div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                Patient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Patient Name</label>
                  <p className="text-lg font-semibold text-gray-800">{request.patientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Age</label>
                  <p className="text-lg font-semibold text-gray-800">{request.patientAge || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Contact Number</label>
                  <p className="text-lg font-semibold text-gray-800">{request.contactNumber || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Relationship</label>
                  <p className="text-lg font-semibold text-gray-800">{request.relationship || 'Not specified'}</p>
                </div>
              </div>
              {request.medicalNotes && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Medical Notes</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.medicalNotes}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-green-500" />
                Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Request Created</p>
                    <p className="text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Required By</p>
                    <p className="text-sm text-gray-600">
                      {new Date(request.requiredBy).toLocaleString()}
                    </p>
                  </div>
                </div>
                {request.status === 'fulfilled' && request.fulfilledAt && (
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-gray-800">Request Fulfilled</p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.fulfilledAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Location */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                Location
              </h2>
              <div className="space-y-2">
                <p className="font-semibold text-gray-800">{request.hospitalName}</p>
                <p className="text-gray-600">{request.address}</p>
                <p className="text-gray-600">{request.city}, {request.state} {request.pincode}</p>
              </div>
            </div>

            {/* Request Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Request Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Responses</span>
                  <span className="font-semibold">{request.responses?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Units Donated</span>
                  <span className="font-semibold text-green-600">{request.unitsReceived || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Units Remaining</span>
                  <span className="font-semibold text-red-600">
                    {request.unitsNeeded - (request.unitsReceived || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Donor Responses */}
            {request.responses && request.responses.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Responses</h2>
                <div className="space-y-3">
                  {request.responses.slice(0, 5).map((response, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{response.donorName}</p>
                        <p className="text-sm text-gray-600">{response.bloodGroup}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">{response.units} units</p>
                        <p className="text-xs text-gray-500">
                          {new Date(response.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
