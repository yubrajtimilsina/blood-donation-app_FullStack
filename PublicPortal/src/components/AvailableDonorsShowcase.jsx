import React, { useState, useEffect } from 'react';
import { FaTint, FaUser, FaMapMarkerAlt, FaHeart, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { publicRequest } from '../requestMethods';
import { toast } from 'react-toastify';

const AvailableDonorsShowcase = () => {
  const [donors, setDonors] = useState([]);
  const [bloodGroupStats, setBloodGroupStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);

  useEffect(() => {
    fetchAvailableDonors();
  }, []);

  const fetchAvailableDonors = async () => {
    try {
      setLoading(true);
      const response = await publicRequest.get('/bloodRequests/donors/available?limit=12');
      if (response.data.success) {
        setDonors(response.data.data);
        setBloodGroupStats(response.data.bloodGroupStats || []);
      }
    } catch (error) {
      console.error('Error fetching available donors:', error);
      toast.error('Failed to load available donors');
    } finally {
      setLoading(false);
    }
  };

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'O+': 'bg-red-100 text-red-800 border-red-300',
      'O-': 'bg-red-200 text-red-900 border-red-400',
      'A+': 'bg-blue-100 text-blue-800 border-blue-300',
      'A-': 'bg-blue-200 text-blue-900 border-blue-400',
      'B+': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'B-': 'bg-yellow-200 text-yellow-900 border-yellow-400',
      'AB+': 'bg-purple-100 text-purple-800 border-purple-300',
      'AB-': 'bg-purple-200 text-purple-900 border-purple-400'
    };
    return colors[bloodGroup] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const handleDonorClick = (donor) => {
    setSelectedBloodGroup(donor.bloodgroup);
  };

  return (
    <div className="py-16 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6">
            <FaHeart className="text-lg" />
            <span className="font-semibold">Ready to Save Lives</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Our Active Donors
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the heroes who have made a commitment to donate blood and save lives in our community.
          </p>
        </div>

        {/* Blood Group Stats */}
        {bloodGroupStats.length > 0 && (
          <div className="mb-12 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Blood Groups</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {bloodGroupStats.map((stat) => (
                <button
                  key={stat._id}
                  onClick={() => setSelectedBloodGroup(stat._id)}
                  className={`p-4 rounded-xl text-center font-bold transition-all duration-300 transform hover:scale-110 border-2 cursor-pointer ${
                    selectedBloodGroup === stat._id
                      ? `${getBloodGroupColor(stat._id)} ring-4 ring-red-400`
                      : getBloodGroupColor(stat._id)
                  }`}
                >
                  <div className="text-2xl font-bold">{stat._id}</div>
                  <div className="text-xs mt-1">{stat.count} donors</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Donors Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500"></div>
          </div>
        ) : donors.length > 0 ? (
          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {donors.map((donor) => (
                <div
                  key={donor._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-100"
                >
                  {/* Header with Blood Group */}
                  <div className={`h-24 bg-gradient-to-r flex items-center justify-center text-white font-bold text-4xl ${
                    donor.bloodgroup.includes('+') ? 'from-red-500 to-red-600' : 'from-red-600 to-red-700'
                  }`}>
                    {donor.bloodgroup}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Donor Name */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                        <FaUser className="text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">{donor.name}</h3>
                        <p className="text-sm text-gray-500">Age: {donor.age || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Gender Badge */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold capitalize">
                        {donor.gender || 'Not specified'}
                      </span>
                    </div>

                    {/* Location */}
                    {donor.address && (
                      <div className="flex items-start gap-2 mb-4">
                        <FaMapMarkerAlt className="text-red-500 text-sm mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-600 truncate">{donor.address}</p>
                      </div>
                    )}

                    {/* Donation Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{donor.totalDonations || 0}</div>
                        <div className="text-xs text-gray-500">Donations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">✓</div>
                        <div className="text-xs text-gray-500">Available</div>
                      </div>
                    </div>

                    {/* Last Donation */}
                    {donor.lastDonationDate && (
                      <p className="text-xs text-gray-500 mb-4">
                        Last donation: {new Date(donor.lastDonationDate).toLocaleDateString()}
                      </p>
                    )}

                    {/* CTA Button */}
                    <Link
                      to="/register"
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-semibold text-center hover:bg-red-600 transition-colors flex items-center justify-center gap-2 group/btn"
                    >
                      <FaHeart />
                      Request Donation
                      <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Donors CTA */}
            <div className="text-center mt-12">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <FaTint />
                View All Donors
                <FaArrowRight />
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <FaTint className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">No available donors at the moment</p>
            <Link
                to="/register"
                className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Become a Donor
              </Link>
          </div>
        )}

        {/* Why Donate */}
        <div className="mt-16 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl shadow-lg p-8 lg:p-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Donate Blood?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ❤️
              </div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">Save Lives</h4>
              <p className="text-gray-600">One donation can save up to 3 lives. Your contribution matters!</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ⚡
              </div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">Quick & Easy</h4>
              <p className="text-gray-600">The donation process takes only 30-45 minutes. Simple and straightforward.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                🏥
              </div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">Health Benefits</h4>
              <p className="text-gray-600">Regular donation can reduce risk of heart disease and improve overall health.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableDonorsShowcase;
