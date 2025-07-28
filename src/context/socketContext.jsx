// SocketContext.js
// import React from "react";
// import  socket  from "../utils/socketIo";

// const SocketContext = React.createContext(socket);

// export default SocketContext;

// src/contexts/ChatContext.tsx
// import { createContext, useContext, useEffect, useState } from "react";
// import SocketService from "./socket.service";

// const ChatContext = createContext(SocketService);

// export function ChatProvider({ children }) {
//   const [messages, setMessages] = useState([]);
//   const [currentRoom, setCurrentRoom] = useState(null);
//   const socketService = SocketService.getInstance();

//   useEffect(() => {
//     socketService.onReceiveMessage((message) => {
//       setMessages((prev) => [...prev, message.messageData]);
//     });

//     return () => {
//       socketService.offReceiveMessage();
//     };
//   }, [socketService]);

//   const joinRoom = (roomId) => {
//     setCurrentRoom(roomId);
//     socketService.joinRoom(roomId);
//   };

//   const sendMessage = (text, roomId, receiverId) => {
//     const message = {
//       text,
//       roomId,
//       receiverId,
//       timestamp: new Date().toISOString(),
//     };

//     socketService.sendMessage({
//       roomId,
//       receiverId,
//       messageData: message,
//     });
//     setMessages((prev) => [...prev, message]);
//   };

//   const value = {
//     messages,
//     sendMessage,
//     joinRoom,
//     currentRoom,
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
// }

// export function useChat() {
//   return useContext(ChatContext);
// }


import { createContext, useContext, useEffect, useState } from "react";
import SocketService from "./socket.service";

// 🛠️ Correct default value (null or {})
const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const socketService = SocketService;

  useEffect(() => {
    socketService.onReceiveMessage((message) => {
      setMessages((prev) => [...prev, message.messageData]);
    });

    return () => {
      socketService.offReceiveMessage();
    };
  }, [socketService]);

  const joinRoom = (roomId) => {
    setCurrentRoom(roomId);
    socketService.joinRoom(roomId);
  };

  const sendMessage = (text, roomId, receiverId,senderId) => {
    const message = {
      text,
      roomId,
      receiverId,
      timestamp: new Date().toISOString(),
      senderId
    };

    socketService.sendMessage({
      roomId,
      receiverId,
      messageData: message,
      senderId
    });
    setMessages((prev) => [...prev, {...message,message:message?.text?.message}]);
  };

  const value = {
    messages,
    sendMessage,
    joinRoom,
    currentRoom,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
