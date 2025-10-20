import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaUser, FaHospital, FaSearch } from 'react-icons/fa';
import ChatModal from './ChatModal';

const FloatingChatWidget = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [chatModal, setChatModal] = useState({
    isOpen: false,
    recipientId: null,
    recipientName: '',
    recipientRole: ''
  });

  if (!user) return null;

  const handleOpenChat = (recipientId, recipientName, recipientRole) => {
    setChatModal({
      isOpen: true,
      recipientId,
      recipientName,
      recipientRole
    });
    setShowOptions(false);
  };

  const handleChatWithDonor = () => {
    navigate('/recipient/search-donors');
    setShowOptions(false);
  };

  const handleChatWithHospital = () => {
    navigate('/recipient/dashboard');
    setShowOptions(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        {/* Options Menu */}
        {showOptions && user.role === 'recipient' && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-2 min-w-64 animate-in">
            <h3 className="font-semibold text-gray-800 mb-3">Choose Chat Type</h3>
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
              setShowOptions(!showOptions);
            } else if (user.role === 'donor') {
              navigate('/donor/chat');
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          title="Open Chat"
        >
          <FaComments className="text-xl" />
        </button>
      </div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModal.isOpen}
        onClose={() => setChatModal({ ...chatModal, isOpen: false })}
        recipientId={chatModal.recipientId}
        recipientName={chatModal.recipientName}
        recipientRole={chatModal.recipientRole}
      />
    </>
  );
};

export default FloatingChatWidget;
