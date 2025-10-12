import { useState, useEffect } from 'react';
import { publicRequest, userRequest } from '../requestMethods';
import { FaHeartbeat, FaPlus, FaExclamationCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';

const BloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    unitsNeeded: '',
    hospitalName: '',
    contactPerson: '',
    contactNumber: '',
    urgency: 'medium',
    address: '',
    requiredBy: '',
    description: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await publicRequest.get('/bloodrequests');
      setRequests(res.data.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userRequest.post('/bloodrequests', formData);
      toast.success('Blood request created successfully!');
      setShowForm(false);
      setFormData({
        patientName: '',
        bloodGroup: '',
        unitsNeeded: '',
        hospitalName: '',
        contactPerson: '',
        contactNumber: '',
        urgency: 'medium',
        address: '',
        requiredBy: '',
        description: ''
      });
      fetchRequests();
    } catch (error) {
      toast.error('Failed to create request');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const urgencyColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaHeartbeat className="text-red-500" />
                Blood Requests
              </h1>
              <p className="text-gray-600 mt-1">{requests.length} active requests</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FaPlus /> New Request
            </button>
          </div>
        </div>

        {/* Request Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create Blood Request</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Patient Name"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />

              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>

              <input
                type="number"
                name="unitsNeeded"
                value={formData.unitsNeeded}
                onChange={handleChange}
                placeholder="Units Needed"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />

              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="Hospital Name"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />

              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Contact Person"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />

              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />

              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>

              <input
                type="date"
                name="requiredBy"
                value={formData.requiredBy}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Hospital Address"
                required
                className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional Information"
                rows="3"
                className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Requests List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {request.patientName}
                  </h3>
                  <p className="text-gray-600">{request.hospitalName}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${urgencyColors[request.urgency]}`}>
                    {request.urgency.toUpperCase()}
                  </span>
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {request.bloodGroup}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Units Needed:</span>
                  <span className="font-semibold">{request.unitsNeeded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Required By:</span>
                  <span className="font-semibold">
                    {new Date(request.requiredBy).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Contact:</span>
                  <span className="font-semibold">{request.contactNumber}</span>
                </div>
                {request.description && (
                  <p className="text-gray-600 mt-2">{request.description}</p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <a
                  href={`tel:${request.contactNumber}`}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  📞 Contact Hospital
                </a>
              </div>
            </div>
          ))}
        </div>

        {requests.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaHeartbeat className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No active blood requests
            </h3>
            <p className="text-gray-500">Create a new request to get started</p>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default BloodRequests;