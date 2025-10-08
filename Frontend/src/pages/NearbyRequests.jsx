import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { publicRequest } from '../requestMethods';
import { FaMapMarkerAlt, FaPhone, FaHospital } from 'react-icons/fa';

const NearbyRequests = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(50);

  useEffect(() => {
    fetchNearbyRequests();
  }, [radius]);

  const fetchNearbyRequests = async () => {
    try {
      const res = await publicRequest.get(`/bloodrequests/nearby?radius=${radius}`, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setRequests(res.data.data || []);
    } catch (error) {
      console.error('Error fetching nearby requests:', error);
    } finally {
      setLoading(false);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                Nearby Blood Requests
              </h1>
              <p className="text-gray-600 mt-1">{requests.length} requests within {radius}km</p>
            </div>

            {/* Radius Selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Search Radius:</label>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
                <option value={200}>200 km</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No nearby requests
            </h3>
            <p className="text-gray-500">
              There are no blood requests within {radius}km of your location
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow border-l-4 border-red-500"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {request.patientName}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaHospital className="text-gray-400" />
                      {request.hospitalName}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {request.bloodGroup}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Units Needed:</span>
                    <span className="font-semibold">{request.unitsNeeded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Required By:</span>
                    <span className="font-semibold">
                      {new Date(request.requiredBy).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact:</span>
                    <span className="font-semibold">{request.contactPerson}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-gray-600 flex items-start gap-2">
                    <FaMapMarkerAlt className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{request.address}</span>
                  </p>
                </div>

                {/* Description */}
                {request.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {request.description}
                  </p>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <a
                    href={`tel:${request.contactNumber}`}
                    className="block w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-center font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPhone /> Call {request.contactNumber}
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(request.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-center font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <FaMapMarkerAlt /> Get Directions
                  </a>
                </div>

                {/* Time Badge */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Posted {new Date(request.createdAt).toLocaleDateString()} at{' '}
                    {new Date(request.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyRequests;