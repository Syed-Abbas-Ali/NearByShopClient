import React, { useState } from "react";
import Chat from "./components/chat/Chat";

const ChatComponent = () => {
  const [chatActive, setChatActive] = useState(false);
  return (
    <div>
      <Chat setChatActive={setChatActive} />
    </div>
  );
};

export default ChatComponent;
