import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods.js";
import { FaUsers, FaSearch, FaCheckCircle } from "react-icons/fa";

const Prospects = () => {
  const [prospects, setProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "bloodgroup", headerName: "Blood Type", width: 130 },
    { field: "age", headerName: "Age", width: 80 },
    { field: "weight", headerName: "Weight", width: 100 },
    {
      field: "approve",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Link to={`/admin/prospect/${params.row._id}`}>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <FaCheckCircle /> Approve
          </button>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    getProspects();
  }, []);

  const getProspects = async () => {
    try {
      const res = await publicRequest.get("/prospects");
      setProspects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prospect.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = filterBloodGroup === "" || prospect.bloodgroup === filterBloodGroup;
    return matchesSearch && matchesBloodGroup;
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaUsers className="text-green-500" />
                Pending Prospects
              </h1>
              <p className="text-gray-600 text-sm mt-1">{filteredProspects.length} awaiting approval</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <select
              value={filterBloodGroup}
              onChange={(e) => setFilterBloodGroup(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Card View */}
        {isMobileView ? (
          <div className="space-y-4">
            {filteredProspects.map((prospect) => (
              <div key={prospect._id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{prospect.name}</h3>
                    <p className="text-sm text-gray-600">{prospect.email}</p>
                  </div>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {prospect.bloodgroup}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Age:</span>
                    <p className="text-gray-800">{prospect.age} years</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Weight:</span>
                    <p className="text-gray-800">{prospect.weight} kg</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="text-gray-800">{prospect.tel}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">BP:</span>
                    <p className="text-gray-800">{prospect.bloodpressure || 'N/A'}</p>
                  </div>
                </div>

                <Link to={`/admin/prospect/${prospect._id}`} className="block">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold">
                    <FaCheckCircle /> Approve Prospect
                  </button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataGrid
              rows={filteredProspects}
              getRowId={(row) => row._id}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              checkboxSelection
              disableSelectionOnClick
              autoHeight
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f3f4f6',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f9fafb',
                  borderBottom: '2px solid #e5e7eb',
                },
              }}
            />
          </div>
        )}

        {filteredProspects.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaUsers className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No prospects found</h3>
            <p className="text-gray-500">All prospects have been processed or no matches found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prospects;