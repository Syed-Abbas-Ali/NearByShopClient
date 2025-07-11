// socket.js
import { io } from "socket.io-client";
import { accessTokenValue } from "./authenticationToken";

export default io("https://www.waytoshops.com/api", {
  auth: { token: accessTokenValue() },
});
