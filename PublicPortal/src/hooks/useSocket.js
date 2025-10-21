import { useState, useEffect, useRef } from 'react';
import { socketService } from '../utils/socketService';

export const useSocket = (user) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!user || initializedRef.current) return;

    initializedRef.current = true;

    // Connect socket
    const socketInstance = socketService.connect(user._id, user.role, user.accessToken);
    setSocket(socketInstance);

    // Set up connection status listener
    const checkConnection = () => {
      const connected = socketService.isConnected();
      setIsConnected(connected);
    };

    // Check connection immediately
    checkConnection();

    // Set up periodic connection checks
    const interval = setInterval(checkConnection, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  return {
    isConnected,
    socket
  };
};

export default useSocket;
