// socket.js
import { io } from "socket.io-client";
import { accessTokenValue } from "./authenticationToken";

export default io(import.meta.env.VITE_AUTH_URL, {
  auth: { token: accessTokenValue() },
});
