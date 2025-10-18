import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaTimes, FaUser, FaHospital, FaSearch } from 'react-icons/fa';
import { publicRequest } from '../requestMethods';
import ChatModal from './ChatModal';

const FloatingChatWidget = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatModal, setChatModal] = useState({ isOpen: false, recipientId: null, recipientName: '', recipientRole: '' });
  const [showOptions, setShowOptions] = useState(false);

  // Role-based configuration
  const getRoleConfig = () => {
    if (!user) return null;

    switch (user.role) {
      case 'donor':
        return {
          label: 'Message Recipient',
          icon: <FaComments />,
          description: 'Chat with recipients who need blood',
          action: () => navigate('/donor/chat')
        };
      case 'recipient':
        return {
          label: 'Find Donor / Hospital',
          icon: <FaSearch />,
          description: 'Connect with donors and hospitals',
          action: () => setShowOptions(true)
        };
      default:
        return null;
    }
  };

  const roleConfig = getRoleConfig();

  const handleRecipientChat = () => {
    // For recipients, show options to chat with donors or hospitals
    setShowOptions(true);
  };

  const handleChatWithDonor = () => {
    // Navigate to search donors page where they can initiate chat
    navigate('/recipient/search-donors');
    setShowOptions(false);
    setIsExpanded(false);
  };

  const handleChatWithHospital = () => {
    // Navigate to create request page or dashboard where they can contact hospitals
    navigate('/recipient/dashboard');
    setShowOptions(false);
    setIsExpanded(false);
  };

  if (!user || !roleConfig) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* Options Menu for Recipients */}
        {showOptions && user.role === 'recipient' && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-2 min-w-64">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Choose Chat Type</h3>
              <button
                onClick={() => setShowOptions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleChatWithDonor}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FaUser className="text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800">Chat with Donors</p>
                  <p className="text-sm text-gray-500">Find available donors</p>
                </div>
              </button>
              <button
                onClick={handleChatWithHospital}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FaHospital className="text-green-500" />
                <div>
                  <p className="font-medium text-gray-800">Chat with Hospitals</p>
                  <p className="text-sm text-gray-500">Contact nearby hospitals</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Main Chat Button */}
        <button
          onClick={() => {
            if (user.role === 'recipient') {
              handleRecipientChat();
            } else {
              roleConfig.action();
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          title={roleConfig.label}
        >
          {roleConfig.icon}
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {roleConfig.label}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModal.isOpen}
        onClose={() => setChatModal({ isOpen: false, recipientId: null, recipientName: '', recipientRole: '' })}
        recipientId={chatModal.recipientId}
        recipientName={chatModal.recipientName}
        recipientRole={chatModal.recipientRole}
      />
    </>
  );
};

export default FloatingChatWidget;
