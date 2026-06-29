import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const getSocketURL = () => {
      if (import.meta.env.VITE_API_URL) {
        // Strip /api if present to get the root server URL
        return import.meta.env.VITE_API_URL.replace(/\/api$/, '');
      }
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      return isLocal ? 'http://localhost:5001' : 'https://vendorpro-backend-qaf2.onrender.com';
    };

    const s = io(getSocketURL(), { transports: ['websocket', 'polling'] });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
