import React from 'react';
import { FaQuestionCircle, FaTint, FaUser, FaHospital, FaSearch } from 'react-icons/fa';

const FAQ = () => {
  const faqs = [
    {
      question: "How do I register as a blood donor?",
      answer: "Click on the 'Register' button and select 'Donor' as your role. Fill in your personal details, medical history, and blood type. You'll need to verify your email before you can start donating.",
      icon: <FaUser className="text-red-500" />
    },
    {
      question: "What are the eligibility requirements to donate blood?",
      answer: "You must be between 18-65 years old, weigh at least 50kg, be in good health, and not have donated blood in the last 56 days. Certain medical conditions may also disqualify you.",
      icon: <FaTint className="text-red-500" />
    },
    {
      question: "How can hospitals register on the platform?",
      answer: "Hospitals can register by selecting 'Hospital' during registration. They'll need to provide their license details, contact information, and blood bank certification.",
      icon: <FaHospital className="text-red-500" />
    },
    {
      question: "How does the matching system work?",
      answer: "Our system uses location-based matching to connect blood requests with nearby donors. Recipients can search for donors, and hospitals can find local donors for urgent requests.",
      icon: <FaSearch className="text-red-500" />
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use industry-standard encryption and security measures. Your data is only shared with verified hospitals and recipients when necessary for blood donation coordination.",
      icon: <FaQuestionCircle className="text-red-500" />
    },
    {
      question: "How do I update my availability status?",
      answer: "Log in to your donor dashboard and toggle your availability status. This helps hospitals know when you're ready to donate.",
      icon: <FaTint className="text-red-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Everything you need to know about blood donation</p>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {faq.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-red-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">We're here to help! Contact our support team for personalized assistance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@lifelink.org"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Email Support
            </a>
            <a
              href="tel:+97712345678"
              className="bg-white hover:bg-gray-50 text-red-500 border border-red-500 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
