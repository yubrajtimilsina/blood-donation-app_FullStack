import { Gauge } from "@mui/x-charts/Gauge";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { FaUser, FaTint, FaUsers, FaHeart, FaChartBar, FaHospital } from "react-icons/fa";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";
import { logout } from "../redux/userRedux";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Hospital = () => {
  const [bloodInventory, setBloodInventory] = useState({});
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthly, setMonthly] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // ✅ FIXED: Use correct endpoints
      const [inventoryRes, donorsRes, requestsRes] = await Promise.all([
        publicRequest.get("/hospitals/inventory", {
          headers: { token: `Bearer ${user.accessToken}` }
        }),
        publicRequest.get("/hospitals/local-donors", {
          headers: { token: `Bearer ${user.accessToken}` }
        }),
        publicRequest.get("/hospitals/requests", {
          headers: { token: `Bearer ${user.accessToken}` }
        })
      ]);
  
      setBloodInventory(inventoryRes.data.data || {});
      setDonors(donorsRes.data.data || []);
      setRequests(requestsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load hospital data');
    } finally {
      setLoading(false);
    }
  };

  const totalInventory = Object.values(bloodInventory).reduce((sum, qty) => sum + qty, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaHospital className="text-green-600" />
            Hospital Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage blood inventory and donor requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaTint className="text-red-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Blood Units</p>
                <p className="text-2xl font-bold text-gray-900">{totalInventory}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Donors</p>
                <p className="text-2xl font-bold text-gray-900">{donors.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaHeart className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'pending').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaChartBar className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Blood Types</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(bloodInventory).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blood Inventory Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Blood Inventory</h3>
            <div className="space-y-4">
              {Object.entries(bloodInventory).map(([type, quantity]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-medium">{type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{quantity} units</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${Math.min((quantity / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Requests</h3>
            <div className="space-y-3">
              {requests.slice(0, 5).map((request, index) => (
                <div key={request._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <FaTint className="text-red-500 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {request.patientName || 'Patient'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {request.bloodGroup} • {request.urgency} • {request.status}
                    </p>
                  </div>
                </div>
              ))}

              {requests.length === 0 && (
                <p className="text-gray-500 text-center py-4">No requests yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/hospital/inventory')}
              className="flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <FaTint className="text-red-600" />
              <span className="font-medium">Update Inventory</span>
            </button>
            <button
              onClick={() => navigate('/hospital/requests')}
              className="flex items-center justify-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <FaHeart className="text-blue-600" />
              <span className="font-medium">View Requests</span>
            </button>
            <button
              onClick={() => navigate('/hospital/local-donors')}
              className="flex items-center justify-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <FaUsers className="text-green-600" />
              <span className="font-medium">Find Donors</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospital;
