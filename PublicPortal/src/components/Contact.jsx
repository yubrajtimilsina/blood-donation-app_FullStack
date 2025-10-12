import { useState } from "react";
import { publicRequest } from "../requestMethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaPhone, FaTint, FaWeight, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  const [inputs, setInputs] = useState({
    name: '',
    tel: '',
    email: '',
    address: '',
    weight: '',
    bloodgroup: '',
    age: '',
    diseases: '',
    bloodpressure: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const { name, email, tel, bloodgroup, age, weight } = inputs;
    
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Valid email is required");
      return false;
    }
    if (!tel.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!bloodgroup) {
      toast.error("Blood group is required");
      return false;
    }
    if (!age || age < 18 || age > 65) {
      toast.error("Age must be between 18-65 years");
      return false;
    }
    if (!weight || weight < 50) {
      toast.error("Weight must be at least 50kg");
      return false;
    }
    
    return true;
  };

  const handleProspect = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const prospectData = {
        ...inputs,
        age: parseInt(inputs.age),
        weight: parseInt(inputs.weight),
        bloodpressure: inputs.bloodpressure ? parseInt(inputs.bloodpressure) : undefined
      };
      
      await publicRequest.post("/prospects", prospectData);
      toast.success("Thank you! You've been successfully registered. We'll contact you soon.");
      
      // Reset form
      setInputs({
        name: '',
        tel: '',
        email: '',
        address: '',
        weight: '',
        bloodgroup: '',
        age: '',
        diseases: '',
        bloodpressure: ''
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Become a Blood Donor
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-6"></div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Fill in your information to register as a blood donor and help save lives.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
          <form onSubmit={handleProspect} className="space-y-6 lg:space-y-8">
            
            {/* Personal Information Section */}
            <div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4 lg:mb-6 flex items-center gap-2">
                <FaUser className="text-red-500" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={inputs.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={inputs.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="tel"
                      value={inputs.tel}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="+977 9876543210"
                      required
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={inputs.age}
                    onChange={handleChange}
                    min="18"
                    max="65"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="25"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mt-4 lg:mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={inputs.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information Section */}
            <div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4 lg:mb-6 flex items-center gap-2">
                <FaTint className="text-red-500" />
                Medical Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                
                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodgroup"
                    value={inputs.bloodgroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    required
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="weight"
                      value={inputs.weight}
                      onChange={handleChange}
                      min="50"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="Min 50"
                      required
                    />
                  </div>
                </div>

                {/* Blood Pressure */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Pressure
                  </label>
                  <input
                    type="number"
                    name="bloodpressure"
                    value={inputs.bloodpressure}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="120"
                  />
                </div>
              </div>

              {/* Diseases */}
              <div className="mt-4 lg:mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions / Diseases
                </label>
                <textarea
                  name="diseases"
                  value={inputs.diseases}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                  placeholder="List any medical conditions or write 'None'"
                />
              </div>
            </div>

            {/* Eligibility Notice */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 lg:p-6">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm lg:text-base">
                ✓ Eligibility Requirements:
              </h4>
              <ul className="text-xs lg:text-sm text-blue-800 space-y-1 lg:space-y-2">
                <li>• Age: 18-65 years</li>
                <li>• Minimum weight: 50kg</li>
                <li>• Good general health</li>
                <li>• No recent tattoos or piercings (within 6 months)</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  <>
                    <FaTint />
                    Register as Donor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Contact;