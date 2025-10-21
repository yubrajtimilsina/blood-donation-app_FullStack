import { Gauge } from "@mui/x-charts/Gauge";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { FaUser, FaTint, FaUsers, FaHeart, FaChartBar, FaComments } from "react-icons/fa";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";
import { logout } from "../redux/userRedux";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [bloodGroupData, setBloodGroupData] = useState([]);
  const [donors, setDonors] = useState([]);
  const [prospects, setProspects] = useState([]);
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
      const headers = user?.accessToken ? { headers: { token: `Bearer ${user.accessToken}` } } : {};
      const [statsRes, donorsRes, prospectsRes, donorsMonthlyRes, prospectsMonthlyRes] = await Promise.all([
        publicRequest.get("/donors/stats"),
        publicRequest.get("/donors", headers),
        publicRequest.get("/prospects"),
        publicRequest.get("/donors/monthly?months=6"),
        publicRequest.get("/prospects/monthly?months=6")
      ]);

      // Transform blood group stats for pie chart
      const transformedData = statsRes.data.map((item, index) => ({
        id: index,
        value: item.count,
        label: `${item._id}`,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'][index % 8]
      }));

      setBloodGroupData(transformedData);
      setDonors(donorsRes.data);
      setProspects(prospectsRes.data);
      // Build monthly data combining donors and prospects by month
      const monthsMap = new Map();
      donorsMonthlyRes.data.forEach(item => {
        const key = `${item._id.year}-${item._id.month}`;
        const month = new Date(item._id.year, item._id.month - 1, 1).toLocaleString('en-US', { month: 'short' });
        monthsMap.set(key, { month, donations: item.donations, prospects: 0 });
      });
      prospectsMonthlyRes.data.forEach(item => {
        const key = `${item._id.year}-${item._id.month}`;
        const month = new Date(item._id.year, item._id.month - 1, 1).toLocaleString('en-US', { month: 'short' });
        const existing = monthsMap.get(key) || { month, donations: 0, prospects: 0 };
        existing.prospects = item.prospects;
        monthsMap.set(key, existing);
      });
      const mergedMonthly = Array.from(monthsMap.values());
      setMonthly(mergedMonthly);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const monthlyData = monthly;

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">Monitor your blood donation activities</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              <FaUser className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-6">

          {/* Total Donors Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Donors</p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                  {donors.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active blood donors</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaTint className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Total Prospects Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Prospects</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-600">
                  {prospects.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Pending approvals</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaUsers className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">This Month</p>
                <p className="text-2xl lg:text-3xl font-bold text-red-600">
                  {monthlyData[monthlyData.length - 1]?.donations || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Donations completed</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FaHeart className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
                <p className="text-2xl lg:text-3xl font-bold text-purple-600">94.5%</p>
                <p className="text-xs text-gray-500 mt-1">Completion rate</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FaChartBar className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Chat Access Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => navigate('/admin/chat')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Messages</p>
                <p className="text-2xl lg:text-3xl font-bold text-indigo-600">
                  Chat
                </p>
                <p className="text-xs text-gray-500 mt-1">Communicate with users</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <FaComments className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Charts Section */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Monthly Trend Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Monthly Donation Trends
              </h3>
              <div className="h-64 lg:h-80">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  height={300}
                  series={[
                    {
                      data: monthlyData.map(item => item.donations),
                      label: 'Donations',
                      color: '#EF4444'
                    },
                    {
                      data: monthlyData.map(item => item.prospects),
                      label: 'Prospects',
                      color: '#3B82F6'
                    }
                  ]}
                  xAxis={[{ 
                    scaleType: 'point',
                    data: monthlyData.map(item => item.month)
                  }]}
                />
              </div>
            </div>

            {/* Blood Group Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Blood Group Distribution
              </h3>
              <div className="h-64 lg:h-80 flex items-center justify-center">
                {bloodGroupData.length > 0 ? (
                  <PieChart
                    series={[{
                      data: bloodGroupData,
                      innerRadius: 30,
                      outerRadius: 100,
                      paddingAngle: 5,
                      cornerRadius: 5
                    }]}
                    height={300}
                    slotProps={{
                      legend: {
                        direction: 'row',
                        position: { vertical: 'bottom', horizontal: 'middle' },
                        padding: 0,
                      }
                    }}
                  />
                ) : (
                  <p className="text-gray-500">No data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Progress Overview
              </h3>
              <div className="space-y-6">
                
                {/* Donor Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Donors</span>
                    <span className="text-sm font-semibold text-blue-600">{donors.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((donors.length / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Prospect Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Prospects</span>
                    <span className="text-sm font-semibold text-green-600">{prospects.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((prospects.length / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Monthly Goal */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Monthly Goal</span>
                    <span className="text-sm font-semibold text-red-600">67/80</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: '84%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Donors
              </h3>
              <div className="space-y-3">
                {donors.slice(0, 5).map((donor, index) => (
                  <div key={donor._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <FaTint className="text-red-500 text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {donor.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {donor.bloodgroup} • {donor.date || 'Recent'}
                      </p>
                    </div>
                  </div>
                ))}
                
                {donors.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No donors yet</p>
                )}
              </div>
            </div>

            {/* Blood Type Alert */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Blood Alert</h3>
              <p className="text-sm opacity-90 mb-4">
                O- blood type is running low. Consider sending reminder emails to eligible donors.
              </p>
              <button className="bg-white text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors duration-200">
                Send Reminders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;