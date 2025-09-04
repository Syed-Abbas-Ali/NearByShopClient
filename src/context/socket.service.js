import { io } from "socket.io-client";
import { accessTokenValue } from "../utils/authenticationToken";
import { jwtDecode } from "jwt-decode";

const SOCKET_URL =
  `${import.meta.env.VITE_AUTH_URL}` || "http://localhost:3307";

const handleConnectionPort = () => {
  const token = accessTokenValue();
  if (!token) return null;
  const decodedToken = jwtDecode(token);
  return decodedToken?.userId;
};

class SocketService {
  static instance;
  socket;

  constructor() {
    if (SocketService.instance) {
      return SocketService.instance;
    }

    this.socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
      auth: {
        token: accessTokenValue(),
      },
      withCredentials: true,
    });

    this.setupEventListeners();
    SocketService.instance = this;
  }

  static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect() {
    let userId = handleConnectionPort();
    const token = accessTokenValue();
    if (!token) {
      console.error("Token is missing. Cannot connect to socket.");
      return;
    }

    this.socket.auth = { token, userId };
    this.socket.connect();
  }

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  setupEventListeners() {
    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    this.socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });
  }

  // Chat methods
  joinRoom(roomId) {
    let userId = handleConnectionPort();
    console.log("joinroom");
    console.log({ roomId, userId });
    this.socket.emit("connect_socket", { roomId, userId });
  }

  sendMessage(messageData) {
    this.socket.emit("send_message", messageData);
  }

  onReceiveMessage(callback) {
    this.socket.on("receive_message", callback);
  }

  offReceiveMessage() {
    this.socket.off("receive_message");
  }

  // Notification methods
  onNotification(callback) {
    this.socket.on("notification", callback);
  }

  // Status methods
  setIsBlock(data) {
    console.log(data)
    this.socket.emit("block", { ...data });
  }
  setIsBlockEvent(callback) {
    this.socket.on("block", callback);
  }
  setIsBlockOff() {
    this.socket.off("block");
  }
  setIsRead(data) {
    this.socket.emit("is_read", { data });
  }
  setIsReadEvent(callback) {
    this.socket.on("is_read",callback);
  }
  setIsReadEventOff() {
    this.socket.off("is_read");
  }
  setOnline() {
    let userId = handleConnectionPort();
    this.socket.emit("online", { userId });
  }

  setOffline() {
    let userId = handleConnectionPort();
    this.socket.emit("offline", { userId });
  }
}

export default SocketService.getInstance();
