import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { userRequest } from '../requestMethods';

const Chat = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      socketRef.current = io('http://localhost:3000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      const socket = socketRef.current;

      // Join user to socket
      socket.emit('join', user._id);

      // Listen for events
      socket.on('receiveMessage', (data) => {
        if (data.chatId === selectedChat?._id) {
          setMessages(prev => [...prev, data]);
        }
        // Update chat list
        fetchChats();
      });

      socket.on('userTyping', (data) => {
        if (data.chatId === selectedChat?._id) {
          setIsTyping(true);
        }
      });

      socket.on('userStopTyping', (data) => {
        if (data.chatId === selectedChat?._id) {
          setIsTyping(false);
        }
      });

      socket.on('messageSent', (data) => {
        // Message sent confirmation
        console.log('Message sent:', data);
      });

      socket.on('messageError', (error) => {
        console.error('Message error:', error);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user, selectedChat]);

  // Fetch user's chats
  const fetchChats = async () => {
    try {
      const res = await userRequest.get('/chats');
      setChats(res.data.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Fetch messages for selected chat
  const fetchMessages = async (chatId) => {
    try {
      const res = await userRequest.get(`/chats/${chatId}`);
      setMessages(res.data.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Load chats on component mount
  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle chat selection
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const socket = socketRef.current;
      if (socket) {
        const receiverId = selectedChat.participants.find(p => p.userId._id !== user._id)?.userId._id;

        socket.emit('sendMessage', {
          chatId: selectedChat._id,
          message: newMessage.trim(),
          senderId: user._id,
          receiverId
        });

        // Optimistically add message to UI
        const messageData = {
          chatId: selectedChat._id,
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
    if (socket && selectedChat) {
      const receiverId = selectedChat.participants.find(p => p.userId._id !== user._id)?.userId._id;
      socket.emit('typing', {
        chatId: selectedChat._id,
        receiverId
      });

      // Stop typing after 2 seconds
      setTimeout(() => {
        socket.emit('stopTyping', {
          chatId: selectedChat._id,
          receiverId
        });
      }, 2000);
    }
  };

  // Create new chat
  const createNewChat = async (participantId) => {
    try {
      const res = await userRequest.post('/chats', { participantId });
      setSelectedChat(res.data.data);
      fetchChats();
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {chats.map((chat) => {
            const otherParticipant = chat.participants.find(p => p.userId._id !== user._id);
            return (
              <div
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedChat?._id === chat._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {otherParticipant?.userId.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900">{otherParticipant?.userId.name}</p>
                    <p className="text-sm text-gray-500">{otherParticipant?.role}</p>
                    {chat.lastMessage && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {chat.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {chat.unreadCount?.[user._id] > 0 && (
                    <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chat.unreadCount[user._id]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedChat.participants.find(p => p.userId._id !== user._id)?.userId.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {selectedChat.participants.find(p => p.userId._id !== user._id)?.userId.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedChat.participants.find(p => p.userId._id !== user._id)?.role}
                  </p>
                </div>
              </div>
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
            <div className="p-4 bg-white border-t border-gray-200">
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
