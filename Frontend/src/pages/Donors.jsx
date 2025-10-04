import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaTint, FaSearch, FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods.js";

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getDonors();
  }, []);

  const getDonors = async () => {
    try {
      const res = await publicRequest.get("/donors");
      setDonors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      try {
        await publicRequest.delete(`/donors/${id}`);
        getDonors();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup =
      filterBloodGroup === "" || donor.bloodgroup === filterBloodGroup;
    return matchesSearch && matchesBloodGroup;
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "bloodgroup", headerName: "Blood Type", width: 130 },
    { field: "diseases", headerName: "Disease", width: 150 },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <Link to={`/admin/donor/${params.row._id}`}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition-colors">
            <FaEdit />
          </button>
        </Link>
      ),
    },
    {
      field: "portal",
      headerName: "Portal",
      width: 110,
      renderCell: (params) => (
        <Link to={`/admin/donor-portal/${params.row._id}`}>
          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded transition-colors">
            <FaEye />
          </button>
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <FaTrash
          className="text-red-500 cursor-pointer hover:text-red-700 text-lg"
          onClick={() => handleDelete(params.row._id)}
        />
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaTint className="text-red-500" />
                All Donors
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {filteredDonors.length} total donors
              </p>
            </div>
            <Link to="/admin/newdonor">
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto">
                + New Donor
              </button>
            </Link>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <select
              value={filterBloodGroup}
              onChange={(e) => setFilterBloodGroup(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <DataGrid
            rows={filteredDonors}
            getRowId={(row) => row._id}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f3f4f6",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f9fafb",
                borderBottom: "2px solid #e5e7eb",
              },
            }}
          />
        </div>

        {filteredDonors.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaTint className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No donors found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donors;
