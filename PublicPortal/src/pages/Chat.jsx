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
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ✅ Initialize socket connection when user logs in
  useEffect(() => {
    if (user) {
      const socket = io('http://localhost:3000', {
        auth: { token: localStorage.getItem('token') },
      });
      socketRef.current = socket;

      // Join room
      socket.emit('join', user._id);

      // ✅ Listen for incoming messages
      socket.on('receiveMessage', (data) => {
        if (data.chatId === selectedChat?._id) {
          setMessages((prev) => [...prev, data]);
        }
        fetchChats(); // refresh chat list with latest message
      });

      // ✅ Typing indicators
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

      // ✅ Cleanup
      return () => socket.disconnect();
    }
  }, [user, selectedChat]);

  // ✅ Fetch all user chats
  const fetchChats = async () => {
    try {
      const res = await userRequest.get('/chats');
      setChats(res.data.data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // ✅ Fetch messages for a selected chat
  const fetchMessages = async (chatId) => {
    try {
      const res = await userRequest.get(`/chats/${chatId}`);
      setMessages(res.data.data?.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Load chats on mount
  useEffect(() => {
    if (user) fetchChats();
  }, [user]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Handle selecting a chat
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
  };

  // ✅ Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const receiverId = selectedChat.participants.find(
      (p) => p.userId._id !== user._id
    )?.userId._id;

    try {
      // Save to database
      await userRequest.post(`/chats/${selectedChat._id}/messages`, {
        content: newMessage.trim(),
      });

      // Emit real-time message
      socketRef.current?.emit('sendMessage', {
        chatId: selectedChat._id,
        message: newMessage.trim(),
        senderId: user._id,
        receiverId,
      });

      // Optimistically update UI
      setMessages((prev) => [
        ...prev,
        {
          chatId: selectedChat._id,
          message: newMessage.trim(),
          senderId: user._id,
          timestamp: new Date(),
        },
      ]);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // ✅ Handle typing indicators
  const handleTyping = () => {
    if (!selectedChat) return;
    const receiverId = selectedChat.participants.find(
      (p) => p.userId._id !== user._id
    )?.userId._id;

    const socket = socketRef.current;
    socket?.emit('typing', { chatId: selectedChat._id, receiverId });

    // Auto stop typing after 2 seconds
    setTimeout(() => {
      socket?.emit('stopTyping', { chatId: selectedChat._id, receiverId });
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar: Chat List */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {chats.map((chat) => {
            const other = chat.participants.find((p) => p.userId._id !== user._id);
            return (
              <div
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedChat?._id === chat._id
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {other?.userId?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900">{other?.userId?.name}</p>
                    <p className="text-sm text-gray-500">{other?.role}</p>
                    {chat.lastMessage && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {chat.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {
                  selectedChat.participants.find(
                    (p) => p.userId._id !== user._id
                  )?.userId.name?.charAt(0).toUpperCase()
                }
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">
                  {
                    selectedChat.participants.find(
                      (p) => p.userId._id !== user._id
                    )?.userId.name
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {
                    selectedChat.participants.find(
                      (p) => p.userId._id !== user._id
                    )?.role
                  }
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.senderId === user._id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      m.senderId === user._id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{m.message || m.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        m.senderId === user._id ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(m.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
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
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
