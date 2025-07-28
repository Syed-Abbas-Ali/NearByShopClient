import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import arrowLeftLarge from "../../../../assets/arrowLeftLarge.svg";
import chatBlueTick from "../../../../assets/chatBlueTick.svg";
import chatGreyTick from "../../../../assets/chatGreyTick.svg";
import chatUser1 from "../../../../assets/chatUser1.svg";
import Search from "../../../../components/search/Search";
import ChatDetails from "../chatDetails/ChatDetails";
import "./chat.scss";
// socket.js
import { useDispatch, useSelector } from "react-redux";
import { useGetChatListQuery } from "../../../../apis&state/apis/chat";
import { userTypeValue } from "../../../../utils/authenticationToken";
import { setRoomChat } from "../../../../apis&state/state/chatState";
// import socket from "../../../../utils/socketIo";

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

const Chat = () => {
  const { roomId } = useSelector((state) => state.chatState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [chatToggle, setChatToggle] = useState(true);
  const [currentUserType, setCurrentUserType] = useState("");
  const handleSingleChat = (singleRoomDetails) => {
    setChatToggle((prev) => !prev);
    dispatch(setRoomChat(singleRoomDetails.roomId));
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  const { data: chatList } = useGetChatListQuery({
    currentUserType,
  });

  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    if (date >= startOfWeek && date <= endOfWeek) {
      return date.toLocaleDateString("en-US", { weekday: "short" }); // e.g., Mon, Wed
    }

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleChangeTab = (tabName) => {
    setCurrentUserType(tabName);
    dispatch(setRoomChat(""))
  };

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
                    onClick={() => handleChangeTab("")}
                  >
                    User
                  </button>
                  <button
                    className={currentUserType !== "" ? "active-btn" : ""}
                    onClick={() => handleChangeTab("seller")}
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
                        user.roomId === roomId ? "selected-user-bg" : ""
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
                              ? user?.shopName?.length > 20
                                ? user?.shopName.slice(0, 20) + ".."
                                : user?.shopName
                              : user?.customerName?.length > 20
                              ? user?.customerName.slice(0, 20) + ".."
                              : user?.customerName}
                          </h3>

                          <p>{formatCreatedAt(user?.lastMessage?.createdAt)}</p>
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
                          {user?.lastMessage?.message?.length > 30
                            ? user?.lastMessage?.message?.slice(0, 30) + ".."
                            : user?.lastMessage?.message}
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
            activeRoomId={roomId}
            currentUserType={currentUserType}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
