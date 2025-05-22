import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import arrowLeftLarge from "../../../../assets/arrowLeftLarge.svg";
import chatBlueTick from "../../../../assets/chatBlueTick.svg";
import chatGreyTick from "../../../../assets/chatGreyTick.svg";
import chatUser1 from "../../../../assets/chatUser1.svg";
import Search from "../../../../components/search/Search";
import ChatDetails from "../chatDetails/ChatDetails";
import "./chat.scss";
// socket.js
import { useSelector } from "react-redux";
import { useGetChatListQuery } from "../../../../apis&state/apis/chat";
import SocketContext from "../../../../context/socketContext";
import {
  accessTokenValue,
  userTypeValue,
} from "../../../../utils/authenticationToken";

function formatCreatedAt(createdAt) {
  const date = new Date(createdAt);
  const now = new Date();

  // Check if it's today
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Get start of current week (Sunday) and end of week (Saturday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (6 - now.getDay())); // Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  // If it's within this week
  if (date >= startOfWeek && date <= endOfWeek) {
    return date.toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Wed", etc.
  }

  // Otherwise, show full date
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; // e.g., "1/2/2025"
}

const Chat = ({ activeRoomId, setActiveRoomId }) => {
  const { roomId } = useSelector((state) => state.chatState);
  const socketMethods = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [chatToggle, setChatToggle] = useState(true);
  const [currentUserType, setCurrentUserType] = useState("");
  const handleSingleChat = (singleRoomDetails) => {
    setChatToggle((prev) => !prev);
    setActiveRoomId(singleRoomDetails.roomId);
  };

  const handleGoBack = () => {
    navigate(-1);
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
        roomId: activeRoomId ?? "",
      });
    };

    if (socketMethods) {
      handleConnectionPort();
    }
  }, [socketMethods, activeRoomId]);
  useEffect(() => {
    if (chatList?.data[0]?.roomId && !roomId) {
      setActiveRoomId(chatList.data[0].roomId);
    }
    if (!activeRoomId && roomId) {
      setActiveRoomId(roomId);
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
                  <button
                    className={currentUserType === "" ? "active-btn" : ""}
                    onClick={() => setCurrentUserType("")}
                  >
                    User
                  </button>
                  <button
                    className={currentUserType !== "" ? "active-btn" : ""}
                    onClick={() => setCurrentUserType("seller")}
                  >
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
                            {currentUserType !== "seller"
                              ? user?.shopName
                              : user?.customerName}
                          </h3>

                          <p>{user?.lastMessage?.time}</p>
                        </div>
                        <p className="tick-message">
                          <img
                            src={
                              user?.lastMessage?.isRead
                                ? chatBlueTick
                                : chatGreyTick
                            }
                            alt="tick"
                          />
                          {user?.lastMessage?.message}
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
            activeRoomId={activeRoomId ?? roomId}
            currentUserType={currentUserType}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
