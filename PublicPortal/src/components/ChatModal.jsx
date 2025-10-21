// PublicPortal/src/components/ChatModal.jsx
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { userRequest } from '../requestMethods'; // ✅ CHANGED from publicRequest
import { socketService } from '../utils/socketService';


const ChatModal = ({ isOpen, onClose, recipientId, recipientName, recipientRole }) => {
  const user = useSelector((state) => state.user.currentUser);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // State for modal visibility and recipient info
  const [modalOpen, setModalOpen] = useState(isOpen || false);
  const [currentRecipient, setCurrentRecipient] = useState({
    id: recipientId,
    name: recipientName,
    role: recipientRole
  });

  // Listen for custom event to open chat modal
  useEffect(() => {
    const handleOpenChatModal = (event) => {
      const { recipientId, recipientName, recipientRole } = event.detail;
      console.log('📨 Opening chat modal for:', recipientName);
      setCurrentRecipient({
        id: recipientId,
        name: recipientName,
        role: recipientRole
      });
      setModalOpen(true);
    };

    window.addEventListener('openChatModal', handleOpenChatModal);

    return () => {
      window.removeEventListener('openChatModal', handleOpenChatModal);
    };
  }, []);

  // Update modal state when props change
  useEffect(() => {
    if (isOpen !== undefined) {
      setModalOpen(isOpen);
    }
    if (recipientId) {
      setCurrentRecipient({
        id: recipientId,
        name: recipientName,
        role: recipientRole
      });
    }
  }, [isOpen, recipientId, recipientName, recipientRole]);

  // Connect socket and create chat when modal opens
  useEffect(() => {
    if (modalOpen && user && currentRecipient.id) {
      // Connect socket if not connected
      if (!socketService.isConnected()) {
        socketService.connect(user._id, user.role, user.accessToken);
      }
      createOrGetChat();
    }
  }, [modalOpen, user, currentRecipient.id]);

  // Setup socket listeners when chat is created
  useEffect(() => {
    if (!chatId || !socketService.isConnected()) return;

    console.log('💬 Setting up chat listeners for:', chatId);

    // Join chat room
    socketService.joinChat(chatId);

    // Message listener
    const handleReceiveMessage = (data) => {
      console.log('📨 Message received:', data);
      if (data.chatId === chatId) {
        const message = data.message || data;
        setMessages(prev => {
          // Avoid duplicates
          if (prev.find(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    };

    // Typing listeners
    const handleUserTyping = (data) => {
      if (data.chatId === chatId && data.senderId !== user._id) {
        setIsTyping(true);
      }
    };

    const handleUserStopTyping = (data) => {
      if (data.chatId === chatId && data.senderId !== user._id) {
        setIsTyping(false);
      }
    };

    socketService.on('receiveMessage', handleReceiveMessage);
    socketService.on('userTyping', handleUserTyping);
    socketService.on('userStopTyping', handleUserStopTyping);

    return () => {
      socketService.leaveChat(chatId);
      socketService.off('receiveMessage', handleReceiveMessage);
      socketService.off('userTyping', handleUserTyping);
      socketService.off('userStopTyping', handleUserStopTyping);
    };
  }, [chatId, user]);

  // Create or get existing chat
  const createOrGetChat = async () => {
    if (!currentRecipient.id || !user?.accessToken) {
      console.error('❌ Missing recipient ID or token');
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Creating/getting chat with:', currentRecipient.name);
      
      // ✅ Use userRequest instead of publicRequest
      const res = await userRequest.post('/chats', { 
        participantId: currentRecipient.id 
      });
      
      console.log('✅ Chat response:', res.data);
      
      if (res.data.success) {
        setChatId(res.data.data._id);
        setMessages(res.data.data.messages || []);
      }
    } catch (error) {
      console.error('❌ Error creating/getting chat:', error);
      console.error('Response:', error.response?.data);
      
      // Show user-friendly error
      if (error.response?.status === 404) {
        alert('Chat service is not available. Please try again later.');
      } else if (error.response?.status === 401) {
        alert('Please login again to use chat.');
      } else {
        alert('Failed to load chat. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !user?.accessToken) return;

    const messageContent = newMessage.trim();
    const tempMessage = {
      _id: Date.now().toString(),
      sender: user._id,
      content: messageContent,
      timestamp: new Date(),
      temp: true
    };

    try {
      // Optimistically add message to UI
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');

      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (socketService.isConnected()) {
        socketService.stopTyping(chatId, currentRecipient.id);
      }

      // Send to backend
      const res = await userRequest.post(`/chats/${chatId}/messages`, {
        content: messageContent
      });

      // Replace temp message with real one
      if (res.data.success) {
        setMessages(prev => 
          prev.map(m => m._id === tempMessage._id ? res.data.data : m)
        );
      }

      // Send via socket for real-time delivery
      if (socketService.isConnected()) {
        socketService.sendMessage(chatId, messageContent, user._id, currentRecipient.id);
      }

    } catch (error) {
      console.error('❌ Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
      alert('Failed to send message. Please try again.');
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!socketService.isConnected() || !chatId) return;

    // Emit typing event
    socketService.startTyping(chatId, currentRecipient.id, user.name);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      if (socketService.isConnected()) {
        socketService.stopTyping(chatId, currentRecipient.id);
      }
    }, 2000);
  };

  // Close modal
  const handleClose = () => {
    setModalOpen(false);
    if (onClose) onClose();
    
    // Cleanup
    setMessages([]);
    setChatId(null);
    setNewMessage('');
    setIsTyping(false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-3/4 flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {currentRecipient.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{currentRecipient.name || 'Chat'}</h3>
              <p className="text-sm text-gray-500 capitalize">{currentRecipient.role || 'User'}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <div className="text-gray-400 text-sm">Loading chat...</div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.sender === user._id || message.sender?._id === user._id;
              
              return (
                <div
                  key={message._id || index}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    } ${message.temp ? 'opacity-70' : ''}`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              disabled={loading || !chatId}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || loading || !chatId}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <FaPaperPlane /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;