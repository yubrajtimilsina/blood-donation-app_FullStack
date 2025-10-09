import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { publicRequest } from '../requestMethods';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTint, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';

const HospitalInventory = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inventory, setInventory] = useState({
    'A+': 0,
    'A-': 0,
    'B+': 0,
    'B-': 0,
    'AB+': 0,
    'AB-': 0,
    'O+': 0,
    'O-': 0
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await publicRequest.get('/hospital/inventory', {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setInventory(res.data.data || inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (bloodType, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setInventory({
      ...inventory,
      [bloodType]: numValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await publicRequest.put(
        '/hospital/inventory',
        { bloodInventory: inventory },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      toast.success('Inventory updated successfully!');
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast.error('Failed to update inventory');
    } finally {
      setSaving(false);
    }
  };

  const totalUnits = Object.values(inventory).reduce((sum, qty) => sum + qty, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/hospital')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaTint className="text-red-600" />
            Blood Inventory Management
          </h1>
          <p className="text-gray-600 mt-2">Update your hospital's blood inventory</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Blood Units</p>
              <p className="text-3xl font-bold text-gray-900">{totalUnits}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaTint className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Inventory Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Update Inventory</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(inventory).map(([bloodType, quantity]) => (
              <div key={bloodType} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {bloodType} Blood Type
                </label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => handleChange(bloodType, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="0"
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((quantity / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{quantity} units</span>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
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
                  <FaSave />
                  Save Changes
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

export default HospitalInventory;
