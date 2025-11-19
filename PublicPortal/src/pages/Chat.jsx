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

  useEffect(() => {
    if (user) {
      const socket = io('http://localhost:3000', {
        auth: { token: localStorage.getItem('token') },
      });
      socketRef.current = socket;

      socket.emit('join', user._id);

      socket.on('receiveMessage', (data) => {
        if (data.chatId === selectedChat?._id) {
          setMessages((prev) => [...prev, data]);
        }
        fetchChats();
      });

      socket.on('userTyping', (data) => {
        if (data.chatId === selectedChat?._id) setIsTyping(true);
      });
      socket.on('userStopTyping', (data) => {
        if (data.chatId === selectedChat?._id) setIsTyping(false);
      });

      return () => socket.disconnect();
    }
  }, [user, selectedChat]);

  const fetchChats = async () => {
    try {
      const res = await userRequest.get('/chats');
      setChats(res.data.data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await userRequest.get(`/chats/${chatId}`);
      setMessages(res.data.data?.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (user) fetchChats();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const receiverId = selectedChat.participants.find(
      (p) => p.userId._id !== user._id
    )?.userId._id;

    try {
      await userRequest.post(`/chats/${selectedChat._id}/messages`, {
        content: newMessage.trim(),
      });

      socketRef.current?.emit('sendMessage', {
        chatId: selectedChat._id,
        message: newMessage.trim(),
        senderId: user._id,
        receiverId,
      });

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

  const handleTyping = () => {
    if (!selectedChat) return;
    const receiverId = selectedChat.participants.find(
      (p) => p.userId._id !== user._id
    )?.userId._id;

    socketRef.current?.emit('typing', { chatId: selectedChat._id, receiverId });

    setTimeout(() => {
      socketRef.current?.emit('stopTyping', { chatId: selectedChat._id, receiverId });
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/3 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {chats.map((chat) => {
            const other = chat.participants.find((p) => p.userId._id !== user._id);
            return (
              <div
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`flex items-center p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                  selectedChat?._id === chat._id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                }`}
              >
                <img
                  src={other?.userId?.avatar || `https://ui-avatars.com/api/?name=${other?.userId?.name}`}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3 flex-1">
                  <p className="font-semibold text-gray-900">{other?.userId?.name}</p>
                  <p className="text-sm text-gray-500">{other?.role}</p>
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {chat.lastMessage.content}
                    </p>
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
            {/* Header */}
            <div className="p-4 bg-white border-b flex items-center shadow-sm">
              <img
                src={
                  selectedChat.participants.find(
                    (p) => p.userId._id !== user._id
                  )?.userId.avatar ||
                  `https://ui-avatars.com/api/?name=${selectedChat.participants.find(
                    (p) => p.userId._id !== user._id
                  )?.userId.name}`
                }
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-900">
                  {selectedChat.participants.find((p) => p.userId._id !== user._id)?.userId.name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedChat.participants.find((p) => p.userId._id !== user._id)?.role}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-5 py-3 rounded-2xl max-w-xs lg:max-w-md ${
                      m.senderId === user._id
                        ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    } shadow`}
                  >
                    <p className="break-words">{m.message || m.content}</p>
                    <p className="text-xs mt-1 text-right text-gray-200">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-4 py-2 rounded-xl">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <img
              src="https://img.icons8.com/ios/100/000000/chat--v1.png"
              alt="No chat"
              className="w-24 h-24 opacity-40"
            />
            <p className="text-lg font-medium">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
