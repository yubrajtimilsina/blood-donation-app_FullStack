import { useState } from "react";
import { publicRequest } from "../requestMethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const NewDonor = () => {
  const [inputs, setInputs] = useState({});
  const user = useSelector((state) => state.user);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDonors = async () => {
    try {
      await publicRequest.post("/donors", inputs, {
        headers: { token: `Bearer ${user.currentUser.accessToken}` },
      });
      toast.success("✅ Donor has been successfully added!");
      setInputs({});
    } catch (error) {
      toast.error("❌ Failed to add donor: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🩸 Add New Donor
        </h2>

        {/* Grid layout for responsiveness */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col space-y-4">
            <label className="font-medium">Name</label>
            <input
              type="text"
              placeholder="James Doe"
              name="name"
              value={inputs.name || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-400"
            />

            <label className="font-medium">Address</label>
            <input
              type="text"
              placeholder="123 DownTown, Sydney"
              name="address"
              value={inputs.address || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-400"
            />

            <label className="font-medium">Telephone</label>
            <input
              type="tel"
              placeholder="(026) 272 839"
              name="tel"
              value={inputs.tel || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-400"
            />

            <label className="font-medium">Blood Group</label>
            <select
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-400"
              name="bloodgroup"
              value={inputs.bloodgroup || ""}
              onChange={handleChange}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <label className="font-medium">Email</label>
            <input
              type="email"
              placeholder="janedoe@example.com"
              name="email"
              value={inputs.email || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-4">
            <label className="font-medium">Weight (kg)</label>
            <input
              type="number"
              placeholder="50"
              name="weight"
              value={inputs.weight || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-400"
            />

            <label className="font-medium">Donation Date</label>
            <input
              type="date"
              name="date"
              value={inputs.date || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-400"
            />

            <label className="font-medium">Do you have any diseases?</label>
            <textarea
              name="diseases"
              value={inputs.diseases || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-3 h-24 resize-none focus:ring-2 focus:ring-red-400"
              placeholder="N/A"
            />

            <button
              className="bg-red-500 hover:bg-red-600 transition text-white font-semibold rounded-md p-3 mt-4"
              onClick={handleDonors}
            >
              ➕ Create Donor
            </button>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default NewDonor;
