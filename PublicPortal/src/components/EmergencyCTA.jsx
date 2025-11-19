import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaExclamationTriangle, FaPhone, FaMapMarkerAlt, FaClock, FaTint, FaHospital, FaCalendar, FaUser } from 'react-icons/fa';
import { publicRequest } from '../requestMethods';
import { ToastContainer, toast } from 'react-toastify';

const EmergencyCTA = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmergencyRequests, setShowEmergencyRequests] = useState(false);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [donorFormData, setDonorFormData] = useState({
    bloodGroup: '',
    units: '',
    name: '',
    phone: '',
    email: ''
  });
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestFormData, setGuestFormData] = useState({
    patientName: '',
    bloodGroup: '',
    unitsNeeded: '',
    hospitalName: '',
    contactPerson: '',
    contactNumber: '',
    contactEmail: '',
    requiredBy: '',
    address: '',
    description: ''
  });
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  const emergencyContacts = [
    { name: "Emergency Hotline", number: "+977 987635433", available: "24/7" },
    { name: "Blood Bank Kathmandu", number: "+977 123456789", available: "24/7" },
    { name: "Pokhara Medical Center", number: "+977 987654321", available: "24/7" }
  ];

  // Fetch urgent blood requests
  const fetchEmergencyRequests = async () => {
    setLoading(true);
    try {
      const res = await publicRequest.get('/bloodRequests?urgency=critical&urgency=high');
      const sortedRequests = res.data.data.sort((a, b) => {
        const urgencyOrder = { critical: 0, high: 1 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      });
      setEmergencyRequests(sortedRequests);
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
      toast.error('Failed to load emergency requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showEmergencyRequests) {
      fetchEmergencyRequests();
    }
  }, [showEmergencyRequests]);

  const handleApplyToDonate = (request) => {
    if (!user) {
      toast.info('Please login to respond to this request');
      navigate('/login');
      return;
    }
    setSelectedRequest(request);
    setShowDonorForm(true);
  };

  const handleDonorFormChange = (e) => {
    const { name, value } = e.target;
    setDonorFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitDonorResponse = async (e) => {
    e.preventDefault();
    
    if (!donorFormData.bloodGroup || !donorFormData.units) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await publicRequest.post(`/bloodRequests/${selectedRequest._id}/respond`, {
        donorId: user._id,
        donorName: donorFormData.name || user.name,
        donorPhone: donorFormData.phone || user.phone,
        donorEmail: donorFormData.email || user.email,
        bloodGroup: donorFormData.bloodGroup,
        unitsOffered: donorFormData.units,
        status: 'pending'
      }, {
        headers: { token: `Bearer ${user.accessToken}` }
      });

      toast.success('Your donation response has been submitted! Hospital will contact you soon.');
      setShowDonorForm(false);
      setSelectedRequest(null);
      setDonorFormData({ bloodGroup: '', units: '', name: '', phone: '', email: '' });
      fetchEmergencyRequests();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error(error.response?.data?.message || 'Failed to submit response');
    }
  };

  const handleGuestFormChange = (e) => {
    const { name, value } = e.target;
    setGuestFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitGuestRequest = async (e) => {
    e.preventDefault();

    const { patientName, bloodGroup, unitsNeeded, hospitalName, contactPerson, contactNumber } = guestFormData;

    if (!patientName || !bloodGroup || !unitsNeeded || !hospitalName || !contactPerson || !contactNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        patientName: guestFormData.patientName,
        bloodGroup: guestFormData.bloodGroup,
        unitsNeeded: parseInt(guestFormData.unitsNeeded, 10),
        hospitalName: guestFormData.hospitalName,
        contactPerson: guestFormData.contactPerson,
        contactNumber: guestFormData.contactNumber,
        contactEmail: guestFormData.contactEmail,
        urgency: 'critical',
        address: guestFormData.address,
        requiredBy: guestFormData.requiredBy || new Date().toISOString(),
        description: guestFormData.description
      };

      const res = await publicRequest.post('/bloodRequests/emergency/guest', payload);

      toast.success('Emergency request created. Help is on the way!');
      setShowGuestForm(false);
      setGuestFormData({
        patientName: '',
        bloodGroup: '',
        unitsNeeded: '',
        hospitalName: '',
        contactPerson: '',
        contactNumber: '',
        contactEmail: '',
        requiredBy: '',
        address: '',
        description: ''
      });
      fetchEmergencyRequests();
    } catch (error) {
      console.error('Error creating guest emergency request:', error);
      toast.error(error.response?.data?.message || 'Failed to create emergency request');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-yellow-500 text-white';
    }
  };

  const getUrgencyIcon = (urgency) => {
    return urgency === 'critical' ? '🚨' : '⚠️';
  };

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <FaExclamationTriangle className="text-yellow-300 text-2xl animate-bounce" />
            <span className="text-lg font-semibold">Emergency Blood Request</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Need Blood Urgently?
          </h2>
          <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed">
            Don't wait! Our emergency response team is ready to help you find compatible donors within minutes.
          </p>
        </div>

        {/* Main CTA */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Side - Emergency Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <FaTint className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Immediate Response</h3>
                  <p className="text-red-100">Average response time: &lt; 30 minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Location-Based Matching</h3>
                  <p className="text-red-100">Find donors in your area instantly</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <FaClock className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">24/7 Support</h3>
                  <p className="text-red-100">Round-the-clock emergency assistance</p>
                </div>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={() => setShowEmergencyRequests(!showEmergencyRequests)}
                className="w-full bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <FaTint className="text-xl" />
                View Urgent Requests
              </button>

              {user ? (
                <Link
                  to="/recipient/create-request"
                  className="w-full bg-red-500 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <FaHospital className="text-xl" />
                  Create Emergency Request
                </Link>
              ) : (
                <button
                  onClick={() => setShowGuestForm(true)}
                  className="w-full bg-red-500 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <FaHospital className="text-xl" />
                  Create Emergency Request (Guest)
                </button>
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaPhone className="text-xl" />
                {isExpanded ? 'Hide' : 'Show'} Emergency Contacts
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Requests List */}
        {showEmergencyRequests && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Active Emergency Requests</h3>
              <button
                onClick={fetchEmergencyRequests}
                className="text-red-200 hover:text-white text-sm font-semibold"
              >
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : emergencyRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {emergencyRequests.map((request) => (
                  <div 
                    key={request._id} 
                    className="bg-white/10 rounded-xl p-5 hover:bg-white/20 transition-all border border-white/20 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getUrgencyIcon(request.urgency)}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white">{request.patientName}</h4>
                        <p className="text-sm text-red-200">{request.hospitalName}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-red-100">
                        <FaTint className="text-red-400" />
                        <span><strong>{request.bloodGroup}</strong> - {request.unitsNeeded} units</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-100">
                        <FaCalendar className="text-red-400" />
                        <span>Required by: {new Date(request.requiredBy).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-100">
                        <FaPhone className="text-red-400" />
                        <span>{request.contactNumber}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyToDonate(request)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Respond as Donor
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-red-200 text-lg">No urgent requests at the moment</p>
                <p className="text-red-300 text-sm mt-2">Check back soon or create your own request</p>
              </div>
            )}
          </div>
        )}

        {/* Expandable Emergency Contacts */}
        {isExpanded && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-fadeIn mb-8">
            <h3 className="text-2xl font-bold text-center mb-6">Emergency Blood Banks & Hospitals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                  <h4 className="text-xl font-semibold mb-2">{contact.name}</h4>
                  <p className="text-red-200 mb-3">{contact.available}</p>
                  <a
                    href={`tel:${contact.number}`}
                    className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaPhone />
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 text-center">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold text-yellow-300">500+</div>
            <div className="text-sm text-red-100">Emergency Responses</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold text-yellow-300">30min</div>
            <div className="text-sm text-red-100">Average Response</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold text-yellow-300">95%</div>
            <div className="text-sm text-red-100">Success Rate</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold text-yellow-300">24/7</div>
            <div className="text-sm text-red-100">Availability</div>
          </div>
        </div>
      </div>

      {/* Donor Response Modal */}
      {showDonorForm && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideIn">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Respond to Request</h3>
              <p className="text-gray-600">
                <strong>{selectedRequest.patientName}</strong> needs <strong>{selectedRequest.bloodGroup}</strong> blood at{' '}
                <strong>{selectedRequest.hospitalName}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmitDonorResponse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={donorFormData.name}
                  onChange={handleDonorFormChange}
                  placeholder={user?.name || "Enter your name"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={donorFormData.phone}
                  onChange={handleDonorFormChange}
                  placeholder={user?.phone || "Enter your phone"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={donorFormData.email}
                  onChange={handleDonorFormChange}
                  placeholder={user?.email || "Enter your email"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Blood Group</label>
                <select
                  name="bloodGroup"
                  value={donorFormData.bloodGroup}
                  onChange={handleDonorFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select your blood group</option>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Units You Can Donate</label>
                <input
                  type="number"
                  name="units"
                  value={donorFormData.units}
                  onChange={handleDonorFormChange}
                  min="1"
                  max="5"
                  placeholder="1-5 units"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowDonorForm(false);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                >
                  Submit Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {/* Guest Emergency Request Modal */}
{showGuestForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-slideIn">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Emergency Request (Guest)</h3>
        <p className="text-gray-600">Provide the basic details and we'll notify nearby donors.</p>
      </div>

      <form onSubmit={handleSubmitGuestRequest} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
          <input
            type="text"
            name="patientName"
            value={guestFormData.patientName}
            onChange={handleGuestFormChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            <select
              name="bloodGroup"
              value={guestFormData.bloodGroup}
              onChange={handleGuestFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
              required
            >
              <option value="">Select blood group</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Units Needed</label>
            <input
              type="number"
              min="1"
              name="unitsNeeded"
              value={guestFormData.unitsNeeded}
              onChange={handleGuestFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hospital / Location</label>
          <input
            type="text"
            name="hospitalName"
            value={guestFormData.hospitalName}
            onChange={handleGuestFormChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={guestFormData.contactPerson}
              onChange={handleGuestFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={guestFormData.contactNumber}
              onChange={handleGuestFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email (optional)</label>
          <input
            type="email"
            name="contactEmail"
            value={guestFormData.contactEmail}
            onChange={handleGuestFormChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required By (optional)</label>
            <input
              type="date"
              name="requiredBy"
              value={guestFormData.requiredBy}
              onChange={handleGuestFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address (optional)</label>
            <input
              type="text"
              name="address"
              value={guestFormData.address}
              onChange={handleGuestFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes / Description (optional)</label>
          <textarea
            name="description"
            value={guestFormData.description}
            onChange={handleGuestFormChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setShowGuestForm(false);
              setGuestFormData({
                patientName: '',
                bloodGroup: '',
                unitsNeeded: '',
                hospitalName: '',
                contactPerson: '',
                contactNumber: '',
                contactEmail: '',
                requiredBy: '',
                address: '',
                description: ''
              });
            }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
          >
            Create Request
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      <ToastContainer />
    </div>
  );
};

export default EmergencyCTA;