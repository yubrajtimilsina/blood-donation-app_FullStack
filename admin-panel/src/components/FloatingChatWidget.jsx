import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaTimes, FaUser, FaHospital, FaCog } from 'react-icons/fa';
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
      case 'hospital':
        return {
          label: 'Support / Donor Chat',
          icon: <FaComments />,
          description: 'Chat with donors and manage support',
          action: () => setShowOptions(true)
        };
      case 'admin':
        return {
          label: 'Manage Chats',
          icon: <FaCog />,
          description: 'Admin support and chat management',
          action: () => navigate('/admin/chat')
        };
      default:
        return null;
    }
  };

  const roleConfig = getRoleConfig();

  const handleHospitalChat = () => {
    // For hospitals, show options to chat with donors or manage chats
    setShowOptions(true);
  };

  const handleChatWithDonor = () => {
    // Navigate to local donors page where they can initiate chat
    navigate('/hospital/donors');
    setShowOptions(false);
    setIsExpanded(false);
  };

  const handleManageChats = () => {
    // Navigate to hospital chat page
    navigate('/hospital/chat');
    setShowOptions(false);
    setIsExpanded(false);
  };

  if (!user || !roleConfig) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* Options Menu for Hospitals */}
        {showOptions && user.role === 'hospital' && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-2 min-w-64">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Choose Chat Option</h3>
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
                  <p className="text-sm text-gray-500">Connect with local donors</p>
                </div>
              </button>
              <button
                onClick={handleManageChats}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FaComments className="text-green-500" />
                <div>
                  <p className="font-medium text-gray-800">Manage All Chats</p>
                  <p className="text-sm text-gray-500">View all conversations</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Main Chat Button */}
        <button
          onClick={() => {
            if (user.role === 'hospital') {
              handleHospitalChat();
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
