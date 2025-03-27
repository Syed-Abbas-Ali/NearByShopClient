// SocketContext.js
import React from "react";
import  socket  from "../utils/socketIo"; 

const SocketContext = React.createContext(socket);

export default SocketContext;
