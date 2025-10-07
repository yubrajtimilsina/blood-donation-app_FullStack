import { useState } from 'react';
import { publicRequest } from '../requestMethods';
import { useSelector } from 'react-redux';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

const AvailabilityToggle = ({ donorId, initialAvailability, onToggle }) => {
  const [isAvailable, setIsAvailable] = useState(initialAvailability);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.currentUser);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await publicRequest.put(
        `/donors/${donorId}/availability`,
        { isAvailable: !isAvailable },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      
      setIsAvailable(res.data.data.isAvailable);
      
      if (onToggle) {
        onToggle(res.data.data.isAvailable);
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
        isAvailable
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-gray-400 hover:bg-gray-500 text-white'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isAvailable ? (
        <>
          <FaToggleOn className="text-2xl" />
          <span>Available for Donation</span>
        </>
      ) : (
        <>
          <FaToggleOff className="text-2xl" />
          <span>Not Available</span>
        </>
      )}
    </button>
  );
};

export default AvailabilityToggle;