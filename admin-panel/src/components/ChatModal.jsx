import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { publicRequest } from '../requestMethods';

const ChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipientId, setRecipientId] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const user = useSelector((state) => state.user.currentUser);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (isOpen && user && recipientId) {
      socketRef.current = io('http://localhost:3000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      const socket = socketRef.current;

      // Join user to socket
      socket.emit('join', user._id);

      // Create or get chat
      createOrGetChat();

      // Listen for events
      socket.on('receiveMessage', (data) => {
        if (data.chatId === chatId) {
          setMessages(prev => [...prev, data]);
        }
      });

      socket.on('userTyping', (data) => {
        if (data.chatId === chatId) {
          setIsTyping(true);
        }
      });

      socket.on('userStopTyping', (data) => {
        if (data.chatId === chatId) {
          setIsTyping(false);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isOpen, user, recipientId, chatId]);

  // Listen for modal open events
  useEffect(() => {
    const handleModalOpen = (event) => {
      const { recipientId: id, recipientName: name, recipientRole: role } = event.detail;
      setRecipientId(id);
      setRecipientName(name);
      setRecipientRole(role);
      setIsOpen(true);
    };

    const modalElement = document.querySelector('[data-chat-modal]');
    if (modalElement) {
      modalElement.addEventListener('openChatModal', handleModalOpen);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener('openChatModal', handleModalOpen);
      }
    };
  }, []);

  // Create or get existing chat
  const createOrGetChat = async () => {
    try {
      const res = await publicRequest.post('/chats', { participantId: recipientId });
      setChatId(res.data.data._id);
      setMessages(res.data.data.messages || []);
    } catch (error) {
      console.error('Error creating/getting chat:', error);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      const socket = socketRef.current;
      if (socket) {
        socket.emit('sendMessage', {
          chatId,
          message: newMessage.trim(),
          senderId: user._id,
          receiverId: recipientId
        });

        // Optimistically add message to UI
        const messageData = {
          chatId,
          message: newMessage.trim(),
          senderId: user._id,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle typing
  const handleTyping = () => {
    const socket = socketRef.current;
    if (socket && chatId) {
      socket.emit('typing', {
        chatId,
        receiverId: recipientId
      });

      // Stop typing after 2 seconds
      setTimeout(() => {
        socket.emit('stopTyping', {
          chatId,
          receiverId: recipientId
        });
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-chat-modal>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-3/4 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {recipientName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{recipientName}</h3>
              <p className="text-sm text-gray-500">{recipientRole}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === user._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{message.message || message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === user._id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
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

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
