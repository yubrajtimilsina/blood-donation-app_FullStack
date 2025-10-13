import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { publicRequest } from "../requestMethods";
import { FaCalendarAlt, FaMapMarkerAlt, FaTint } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DonationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.currentUser);
  const { id } = useParams();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const donorId = id || user.donorProfile;
        const response = await publicRequest.get(`/donors/${donorId}/history`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });
        setHistory(response.data.data || []);
      } catch (error) {
        console.error('Error fetching donation history:', error);
        toast.error('Failed to load donation history');
      } finally {
        setLoading(false);
      }
    };

    if (user?.donorProfile) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading donation history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaTint className="text-red-500" />
            Donation History
          </h1>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <FaTint className="text-4xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Donations Yet</h3>
              <p className="text-gray-500">Your donation history will appear here once you start donating blood.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((donation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCalendarAlt className="text-red-500" />
                        <span className="font-semibold text-gray-800">
                          {new Date(donation.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <FaMapMarkerAlt />
                        <span>{donation.location || 'Hospital'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaTint />
                        <span>Blood Type: {donation.bloodType || user.donorProfile.bloodgroup}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                      </span>
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

export default DonationHistory;
