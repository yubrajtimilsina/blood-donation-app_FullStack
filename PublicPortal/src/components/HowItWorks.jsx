import React from 'react';
import { FaUserPlus, FaSearch, FaHandshake, FaTint, FaArrowRight } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUserPlus className="text-blue-500 text-4xl" />,
      title: "Register",
      description: "Create your account as a donor, recipient, or hospital. Provide your details and get verified.",
      step: "01"
    },
    {
      icon: <FaSearch className="text-green-500 text-4xl" />,
      title: "Get Matched",
      description: "Our smart system connects you with compatible donors or recipients based on blood type and location.",
      step: "02"
    },
    {
      icon: <FaHandshake className="text-purple-500 text-4xl" />,
      title: "Connect & Donate",
      description: "Coordinate with hospitals and donors to schedule blood donation and save lives.",
      step: "03"
    }
  ];

  return (
    <div className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-red-500 rounded-full mx-auto mb-6"></div>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Simple steps to connect, donate, and save lives. Join our community and make a difference today.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {step.step}
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow for middle step */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 text-gray-300">
                    <FaArrowRight className="text-2xl" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-red-500 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Save Lives?
            </h3>
            <p className="text-lg lg:text-xl mb-8 opacity-90">
              Join thousands of donors and recipients who are making a difference every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Become a Donor
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-500 transition-all duration-300 transform hover:scale-105">
                Find Blood Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
