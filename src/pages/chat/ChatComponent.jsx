import React, { useState } from "react";
import Chat from "./components/chat/Chat";

const ChatComponent = () => {
    
      const [chatActive, setChatActive] = useState(false);
      const [activeRoomId, setActiveRoomId] = useState(null);
  return (
    <div>
      <Chat
        setChatActive={setChatActive}
        setActiveRoomId={setActiveRoomId}
        activeRoomId={activeRoomId}
      />
    </div>
  );
};

export default ChatComponent;
