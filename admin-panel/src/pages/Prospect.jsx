import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { publicRequest, userRequest } from "../requestMethods";
import { useSelector } from "react-redux";

const Prospect = () => {
  const [prospect, setProspect] = useState({});
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const prospectId = location.pathname.split("/")[3];
  const navigate = useNavigate();
  
  // Get user token from Redux store
  const user = useSelector((state) => state.user);

  // Fetch prospect details
  useEffect(() => {
    const getProspect = async () => {
      setLoading(true);
      try {
        const res = await publicRequest.get(`/prospects/find/${prospectId}`);
        setProspect(res.data);
      } catch (err) {
        setError("Failed to load prospect details.");
        console.error("Error fetching prospect:", err);
      } finally {
        setLoading(false);
      }
    };

    if (prospectId) {
      getProspect();
    }
  }, [prospectId]);

  // Approve prospect with authentication
  const approveProspect = async () => {
    // Check if user is authenticated
    if (!user.currentUser || !user.currentUser.accessToken) {
      setError("You must be logged in to approve prospects.");
      navigate("/login");
      return;
    }

    setApproving(true);
    setError(null);
    
    try {
      // Create donor with authentication token
      const donorData = {
        name: prospect.name,
        address: prospect.address,
        email: prospect.email,
        tel: prospect.tel,
        bloodgroup: prospect.bloodgroup,
        diseases: prospect.diseases,
        date: new Date().toISOString().split('T')[0], // Current date
        weight: prospect.weight,
        age: prospect.age,
        bloodpressure: prospect.bloodpressure
      };

      // Send POST request with authorization header
      await userRequest.post("/donors", donorData);

      // Delete prospect after successful donor creation
      await userRequest.delete(`/prospects/${prospectId}`);
      
      // Navigate to donors page
      navigate("/admin/donors");
    } catch (err) {
      console.error("Approval error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        navigate("/login");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to perform this action.");
      } else {
        setError("Approval failed. Please try again!");
      }
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prospect details...</p>
        </div>
      </div>
    );
  }

  if (error && !prospect.name) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin/prospects")}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Back to Prospects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-500 text-white p-6">
          <h2 className="text-2xl font-bold text-center">Prospect Approval</h2>
          <p className="text-center text-red-100 mt-2">Review and approve new donor</p>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Prospect Details Card */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Prospect Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name</span>
                  <p className="text-gray-900 font-medium">{prospect.name || "N/A"}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Email</span>
                  <p className="text-gray-900">{prospect.email || "N/A"}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Phone</span>
                  <p className="text-gray-900">{prospect.tel || "N/A"}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Address</span>
                  <p className="text-gray-900">{prospect.address || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Blood Group</span>
                  <p className="text-gray-900 font-medium text-red-600">
                    {prospect.bloodgroup || "N/A"}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Age</span>
                  <p className="text-gray-900">{prospect.age ? `${prospect.age} years` : "N/A"}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Weight</span>
                  <p className="text-gray-900">{prospect.weight ? `${prospect.weight} kg` : "N/A"}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Blood Pressure</span>
                  <p className="text-gray-900">{prospect.bloodpressure || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-600">Medical Conditions</span>
              <p className="text-gray-900 mt-1">
                {prospect.diseases || "No medical conditions reported"}
              </p>
            </div>
          </div>

          {/* Eligibility Check */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-green-800 mb-2">Eligibility Status:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center">
                <span className="text-green-600">✓</span>
                <span className="ml-2 text-green-700">Age requirement met</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600">✓</span>
                <span className="ml-2 text-green-700">Weight requirement met</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600">✓</span>
                <span className="ml-2 text-green-700">All required information provided</span>
              </div>
            </div>
          </div>

          {/* Confirmation */}
          <div className="text-center mb-6">
            <p className="text-gray-700 text-lg">
              Do you want to approve{" "}
              <span className="font-bold text-red-600">{prospect.name}</span>{" "}
              as a blood donor?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action will add them to the donors list and remove them from prospects.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/admin/prospects")}
              className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
              disabled={approving}
            >
              Cancel
            </button>
            
            <button
              onClick={approveProspect}
              disabled={approving || !prospect.name}
              className={`px-6 py-3 bg-red-500 text-white rounded-md transition-colors duration-200 flex items-center justify-center ${
                approving || !prospect.name
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-red-600"
              }`}
            >
              {approving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Approving...
                </>
              ) : (
                "Approve as Donor"
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prospect;