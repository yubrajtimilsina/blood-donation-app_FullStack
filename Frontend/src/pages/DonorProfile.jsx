import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { publicRequest } from '../requestMethods';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTint, FaUser } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import LocationPicker from '../components/LocationPicker';

const DonorProfile = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    address: '',
    bloodgroup: '',
    age: '',
    weight: '',
    diseases: '',
    bloodpressure: '',
    preferredDonationCenter: '',
    donationRadius: 10
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await publicRequest.get(`/donors/${user.donorProfile}`, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        tel: res.data.tel || '',
        address: res.data.address || '',
        bloodgroup: res.data.bloodgroup || '',
        age: res.data.age || '',
        weight: res.data.weight || '',
        diseases: res.data.diseases || '',
        bloodpressure: res.data.bloodpressure || '',
        preferredDonationCenter: res.data.preferredDonationCenter || '',
        donationRadius: res.data.donationRadius || 10
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationSelect = (location) => {
    toast.success('Location updated!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await publicRequest.put(
        `/donors/${user.donorProfile}`,
        formData,
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      toast.success('Profile updated successfully!');
      setTimeout(() => navigate('/donor/dashboard'), 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
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
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaUser className="text-red-500" />
            My Profile
          </h1>
          <p className="text-gray-600 mt-1">Update your donor information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  max="65"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaTint className="text-red-500" />
              Medical Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group *
                </label>
                <select
                  name="bloodgroup"
                  value={formData.bloodgroup}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="50"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure
                </label>
                <input
                  type="number"
                  name="bloodpressure"
                  value={formData.bloodpressure}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius (km)
                </label>
                <input
                  type="number"
                  name="donationRadius"
                  value={formData.donationRadius}
                  onChange={handleChange}
                  min="1"
                  max="200"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions / Diseases
                </label>
                <textarea
                  name="diseases"
                  value={formData.diseases}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="List any medical conditions (write 'None' if not applicable)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Donation Center
                </label>
                <input
                  type="text"
                  name="preferredDonationCenter"
                  value={formData.preferredDonationCenter}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your preferred hospital or blood bank"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Update Location
            </h2>
            <LocationPicker onLocationSelect={handleLocationSelect} />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/donor/dashboard')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default DonorProfile;