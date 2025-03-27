import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../../../search/Search";
import arrowLeftLarge from "../../../../assets/arrowLeftLarge.svg";
import chatBlueTick from "../../../../assets/chatBlueTick.svg";
import chatGreyTick from "../../../../assets/chatGreyTick.svg";
import chatUser1 from "../../../../assets/chatUser1.svg";
import ChatDetails from "../chatDetails/ChatDetails";
import "./chat.scss";
// socket.js
import { useGetChatListQuery } from "../../../../apis&state/apis/chat";
import SocketContext from "../../../../context/socketContext";
import {
  accessTokenValue,
  userTypeValue,
} from "../../../../utils/authenticationToken";

const users = [
  {
    id: 1,
    name: "Virat Kohli",
    lastMessage: "Okay Rahul",
    time: "6:31 PM",
    isSee: true,
    imageUrl: chatUser1,
  },
  {
    id: 2,
    name: "MS Dhoni",
    lastMessage: "See you tomorrow!",
    time: "6:15 PM",
    isSee: false,
    imageUrl: chatUser1,
  },
  {
    id: 3,
    name: "Rohit Sharma",
    lastMessage: "Let’s catch up soon.",
    time: "5:45 PM",
    isSee: true,
    imageUrl: chatUser1,
  },
  {
    id: 4,
    name: "KL Rahul",
    lastMessage: "Sounds good to me.",
    time: "4:50 PM",
    isSee: true,
    imageUrl: chatUser1,
  },
  {
    id: 5,
    name: "Hardik Pandya",
    lastMessage: "On my way!",
    time: "4:15 PM",
    isSee: false,
    imageUrl: chatUser1,
  },
  {
    id: 6,
    name: "Rishabh Pant",
    lastMessage: "Got it!",
    time: "3:30 PM",
    isSee: true,
    imageUrl: chatUser1,
  },
  {
    id: 7,
    name: "Shikhar Dhawan",
    lastMessage: "Let me know.",
    time: "2:20 PM",
    isSee: true,
    imageUrl: chatUser1,
  },
  {
    id: 8,
    name: "Jasprit Bumrah",
    lastMessage: "All set!",
    time: "1:45 PM",
    isSee: false,
    imageUrl: chatUser1,
  },
  {
    id: 9,
    name: "Yuvraj Singh",
    lastMessage: "Take care.",
    time: "12:50 PM",
    isSee: false,
    imageUrl: chatUser1,
  },
  {
    id: 10,
    name: "Sourav Ganguly",
    lastMessage: "Will call you back.",
    time: "11:30 AM",
    isSee: true,
    imageUrl: chatUser1,
  },
  {
    id: 11,
    name: "Sachin Tendulkar",
    lastMessage: "Great work!",
    time: "10:15 AM",
    isSee: true,
    imageUrl: chatUser1,
  },
  {
    id: 12,
    name: "Ravindra Jadeja",
    lastMessage: "See you at the match.",
    time: "9:45 AM",
    isSee: false,
    imageUrl: chatUser1,
  },
  {
    id: 13,
    name: "Anil Kumble",
    lastMessage: "Thanks!",
    time: "8:20 AM",
    isSee: true,
    imageUrl: chatUser1,
  },
  {
    id: 14,
    name: "Zaheer Khan",
    lastMessage: "Talk soon.",
    time: "7:10 AM",
    isSee: true,
    imageUrl: chatUser1,
  },
  {
    id: 15,
    name: "Rahul Dravid",
    lastMessage: "That’s perfect.",
    time: "6:55 AM",
    isSee: false,
    imageUrl: chatUser1,
  },
];

const Chat = ({setChatActive,activeRoomId, setActiveRoomId}) => {
    const socketMethods = useContext(SocketContext);  
  const navigate = useNavigate();
  const [chatToggle, setChatToggle] = useState(true);
  const [currentUserType, setCurrentUserType] = useState("");
  const handleSingleChat = (singleRoomDetails) => {
    setChatToggle((prev) => !prev);
    setActiveRoomId(singleRoomDetails.roomId);
  };
  const handleGoBack = () => {
    setChatActive(false);
  };
  const { data: chatList } = useGetChatListQuery({
    currentUserType,
  });

  useEffect(() => {
    const handleConnectionPort = () => {
      const token = accessTokenValue();
      const decodedToken = jwtDecode(token);
      socketMethods.emit("connect_socket", {
        userId: decodedToken?.userId || "",
        roomId: activeRoomId??"",
      });
    };

    if (socketMethods) {
      handleConnectionPort();
    }
  }, [socketMethods,activeRoomId]);
  useEffect(() => {
    if (chatList?.data[0]?.roomId) {
      setActiveRoomId(chatList.data[0].roomId);
    }
  }, [chatList]);
  return (
    <>
      <div className="chat-bg-card-div">
        <div className="chat-card-container">
          <div
            className="chat-card"
            style={{
              display: chatToggle ? "" : "none",
            }}
            id="chat-users-list"
          >
            <div className="chat-header-card">
              <div className="left-card">
                <img src={arrowLeftLarge} alt="" onClick={handleGoBack} />
                <h3>Chats</h3>
              </div>
              {userTypeValue() === "SELLER" && (
                <div className="tabs-list">
                  <button className={currentUserType==="" ? "active-btn" : ""} onClick={() => setCurrentUserType("")}>User</button>
                  <button className={currentUserType!=="" ? "active-btn" : ""} onClick={() => setCurrentUserType("seller")}>
                    Seller
                  </button>
                </div>
              )}
            </div>
            <div className="chat-list-body">
              <Search />
              <div className="users-list">
                {chatList?.data?.map((user, index) => {
                  return (
                    <div
                      className={`user ${
                        user.roomId === activeRoomId ? "selected-user-bg" : ""
                      }`}
                      key={index}
                      onClick={() => handleSingleChat(user)}
                    >
                      <div className="default-user">
                        <img src={chatUser1} alt="" />
                      </div>
                      <div className="user-name">
                        <div className="time">
                          <h3>
                            {userTypeValue() === "USER"
                              ? user?.shopName
                              : user?.customerName}
                          </h3>
                          <p>{users[index].time}</p>
                        </div>
                        <p className="tick-message">
                          <img
                            src={
                              users[index].isSee ? chatBlueTick : chatGreyTick
                            }
                            alt="tick"
                          />
                          {users[index].lastMessage}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <ChatDetails
            chatToggle={chatToggle}
            setChatToggle={setChatToggle}
            activeRoomId={activeRoomId}
            currentUserType={currentUserType}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
