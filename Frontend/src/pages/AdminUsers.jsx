import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { publicRequest } from '../requestMethods';
import { FaUsers, FaSearch, FaCheck, FaTrash, FaEdit } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';

const AdminUsers = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      let url = '/admin/users';
      const params = [];
      if (roleFilter) params.push(`role=${roleFilter}`);
      if (params.length > 0) url += '?' + params.join('&');

      const res = await publicRequest.get(url, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setUsers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (userId) => {
    if (!window.confirm('Verify this user?')) return;

    try {
      await publicRequest.put(
        `/admin/users/${userId}/verify`,
        {},
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Failed to verify user');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await publicRequest.delete(`/admin/users/${userId}`, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      renderCell: (params) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          params.value === 'admin' ? 'bg-purple-100 text-purple-600' :
          params.value === 'donor' ? 'bg-red-100 text-red-600' :
          'bg-blue-100 text-blue-600'
        }`}>
          {params.value}
        </span>
      )
    },
    { 
      field: 'verified', 
      headerName: 'Verified', 
      width: 100,
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          params.value ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {params.value ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 130,
      renderCell: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <div className="flex gap-2">
          {!params.row.verified && (
            <button
              onClick={() => verifyUser(params.row._id)}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors"
              title="Verify User"
            >
              <FaCheck />
            </button>
          )}
          <button
            onClick={() => deleteUser(params.row._id)}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors"
            title="Delete User"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaUsers className="text-red-500" />
                User Management
              </h1>
              <p className="text-gray-600 mt-1">{filteredUsers.length} total users</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
            </select>
          </div>
        </div>

        {/* Data Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <DataGrid
            rows={filteredUsers}
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
      </div>
    </div>
  );
};

export default AdminUsers;