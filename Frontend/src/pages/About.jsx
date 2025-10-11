import React from 'react';
import { FaHeart, FaUsers, FaShieldAlt, FaAward, FaTint, FaHospital } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaTint className="text-red-500 text-3xl" />,
      title: "Smart Matching",
      description: "Advanced algorithms connect donors with recipients based on blood type, location, and urgency."
    },
    {
      icon: <FaUsers className="text-blue-500 text-3xl" />,
      title: "Community Driven",
      description: "Building a network of verified donors and recipients working together to save lives."
    },
    {
      icon: <FaShieldAlt className="text-green-500 text-3xl" />,
      title: "Secure & Private",
      description: "Your personal information is protected with enterprise-grade security measures."
    },
    {
      icon: <FaAward className="text-purple-500 text-3xl" />,
      title: "Quality Assured",
      description: "All blood donations go through rigorous screening and quality control processes."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Lives Saved" },
    { number: "5,000+", label: "Active Donors" },
    { number: "100+", label: "Partner Hospitals" },
    { number: "24/7", label: "Emergency Support" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About LifeLink</h1>
          <p className="text-xl leading-relaxed">
            Connecting lives through the power of blood donation. We're building a comprehensive platform
            that makes blood donation accessible, efficient, and life-saving for communities worldwide.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To create a seamless ecosystem where blood donors, recipients, and healthcare providers
              can connect instantly, ensuring no life is lost due to lack of blood availability.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600">Numbers that tell our story</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-red-500 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to save lives</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Register</h3>
              <p className="text-gray-600">Create your account as a donor, recipient, or hospital</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTint className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">Our system matches donors with urgent blood requests</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Lives</h3>
              <p className="text-gray-600">Make a difference by donating blood when needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl mb-8">Be part of something bigger. Every donation counts.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Become a Donor
            </a>
            <a
              href="/contact"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
