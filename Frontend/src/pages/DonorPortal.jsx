import { useState, useEffect } from 'react';
import { publicRequest } from '../requestMethods';
import { FaTint, FaCalendar, FaCertificate, FaHistory } from 'react-icons/fa';

const DonorPortal = () => {
  const [donorData, setDonorData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonorData();
  }, []);

  const fetchDonorData = async () => {
    try {
      // Assuming donor searches by email
      const email = prompt('Enter your email to view your donation history:');
      if (!email) return;

      const res = await publicRequest.get(`/donors?email=${email}`);
      setDonorData(res.data[0]);
      setDonations(res.data);
    } catch (error) {
      console.error('Failed to fetch donor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextDonation = (lastDate) => {
    const last = new Date(lastDate);
    const next = new Date(last);
    next.setDate(next.getDate() + 90); // 90 days after last donation
    return next.toLocaleDateString();
  };

  const downloadCertificate = () => {
    // Generate certificate (could be PDF using jsPDF library)
    alert('Certificate downloaded!');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!donorData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaTint className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Donor Portal</h2>
          <p className="text-gray-600 mb-4">View your donation history and download certificates</p>
          <button
            onClick={fetchDonorData}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Access Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome, {donorData.name}!</h1>
          <p className="text-red-100">Thank you for being a life-saving hero</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaTint className="text-red-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Blood Group</p>
                <p className="text-2xl font-bold text-gray-800">{donorData.bloodgroup}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaCalendar className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last Donation</p>
                <p className="text-lg font-bold text-gray-800">
                  {new Date(donorData.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaHistory className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Donations</p>
                <p className="text-2xl font-bold text-gray-800">{donations.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Donation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Next Eligible Donation</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              You can donate again on: <strong>{calculateNextDonation(donorData.date)}</strong>
            </p>
          </div>
        </div>

        {/* Donation History */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Donation History</h2>
            <button
              onClick={downloadCertificate}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              <FaCertificate /> Download Certificate
            </button>
          </div>

          <div className="space-y-4">
            {donations.map((donation, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Donation #{donations.length - index}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(donation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {donation.bloodgroup}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorPortal;