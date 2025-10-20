// Create new file: PublicPortal/src/hooks/useChat.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { publicRequest } from '../requestMethods';

export const useChat = (user) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!user?.accessToken) return;

    if (socketRef.current?.connected) return;

    socketRef.current = io('http://localhost:3000', {
      auth: {
        token: `Bearer ${user.accessToken}`
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current.id);
      socketRef.current.emit('join', { userId: user._id, role: user.role });
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    socketRef.current.on('userOnline', (data) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]));
    });

    socketRef.current.on('userOffline', (data) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        updated.delete(data.userId);
        return updated;
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // Fetch all chats
  const fetchChats = useCallback(async () => {
    if (!user?.accessToken) return;

    try {
      setLoading(true);
      const res = await publicRequest.get('/chats', {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setChats(res.data.data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch messages for selected chat
  const fetchMessages = useCallback(async (chatId) => {
    if (!user?.accessToken) return;

    try {
      const res = await publicRequest.get(`/chats/${chatId}`, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setMessages(res.data.data?.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [user]);

  // Select chat and join socket room
  const handleSelectChat = useCallback((chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
    
    if (socketRef.current) {
      socketRef.current.emit('joinChat', chat._id);
    }
  }, [fetchMessages]);

  // Send message
  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || !selectedChat || !user?.accessToken) return;

    try {
      // Send via socket for real-time
      if (socketRef.current) {
        const receiverId = selectedChat.participants.find(
          p => p.userId._id !== user._id
        )?.userId._id;

        socketRef.current.emit('sendMessage', {
          chatId: selectedChat._id,
          message: content.trim(),
          senderId: user._id,
          receiverId
        });
      }

      // Also save to database
      await publicRequest.post(
        `/chats/${selectedChat._id}/messages`,
        { content },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );

      // Clear input
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, [selectedChat, user]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!selectedChat || !socketRef.current) return;

    const receiverId = selectedChat.participants.find(
      p => p.userId._id !== user._id
    )?.userId._id;

    socketRef.current.emit('typing', {
      chatId: selectedChat._id,
      receiverId
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stopTyping', {
        chatId: selectedChat._id,
        receiverId
      });
    }, 2000);
  }, [selectedChat, user]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socketRef.current) return;

    const handleReceiveMessage = (data) => {
      if (data.chatId === selectedChat?._id) {
        setMessages(prev => [...prev, data]);
      }
    };

    const handleUserTyping = (data) => {
      if (data.chatId === selectedChat?._id) {
        setIsTyping(true);
      }
    };

    const handleUserStopTyping = (data) => {
      if (data.chatId === selectedChat?._id) {
        setIsTyping(false);
      }
    };

    socketRef.current.on('receiveMessage', handleReceiveMessage);
    socketRef.current.on('userTyping', handleUserTyping);
    socketRef.current.on('userStopTyping', handleUserStopTyping);

    return () => {
      socketRef.current?.off('receiveMessage', handleReceiveMessage);
      socketRef.current?.off('userTyping', handleUserTyping);
      socketRef.current?.off('userStopTyping', handleUserStopTyping);
    };
  }, [selectedChat]);

  // Create or get chat with user
  const startChat = useCallback(async (participantId) => {
    if (!user?.accessToken) return;

    try {
      const res = await publicRequest.post(
        '/chats',
        { participantId },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      const newChat = res.data.data;
      handleSelectChat(newChat);
      await fetchChats();
      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  }, [user, handleSelectChat, fetchChats]);

  return {
    chats,
    selectedChat,
    messages,
    isTyping,
    onlineUsers,
    loading,
    fetchChats,
    handleSelectChat,
    sendMessage,
    handleTyping,
    startChat,
    socketRef
  };
};

export default useChat;