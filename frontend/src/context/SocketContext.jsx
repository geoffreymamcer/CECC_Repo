import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only connect if there is a logged-in user
    if (user) {
      const newSocket = io(process.env.REACT_APP_API_URL); // Your backend URL
      setSocket(newSocket);

      // Tell the server who we are
      newSocket.emit("addUser", user.id || user._id);

      // Cleanup on component unmount
      return () => newSocket.close();
    } else {
      // If user logs out, disconnect the socket
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
