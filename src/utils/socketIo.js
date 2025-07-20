// socket.js
import { io } from "socket.io-client";
import { accessTokenValue } from "./authenticationToken";

export default io(`https://api.waytoshops.com`, {
  auth: { token: accessTokenValue() },
});
