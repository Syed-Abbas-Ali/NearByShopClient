import React, { useContext, useEffect, useRef, useState } from "react";
import "./chatDetails.scss";
import backIcon from "../../../../assets/arrowLeftLarge.svg";
import messageSendIcon from "../../../../assets/messageSendIcon.svg";
import emojiPickerImage from "../../../../assets/emojiPickerImage.svg";
import EmojiPicker from "emoji-picker-react";
import chatUser1 from "../../../../assets/chatUser1.svg";
import chatBlueTick from "../../../../assets/chatBlueTick.svg";
import chatGreyTick from "../../../../assets/chatGreyTick.svg";
import {
  useCreateRoomMutation,
  useGetSingleChatQuery,
  useSendMessageMutation,
} from "../../../../apis&state/apis/chat";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import {
  accessTokenValue,
  userTypeValue,
} from "../../../../utils/authenticationToken";
import SocketContext from "../../../../context/socketContext";
import { useSelector } from "react-redux";

const ChatDetails = ({
  chatToggle,
  setChatToggle,
  activeRoomId,
  currentUserType,
}) => {
  const socketMethods = useContext(SocketContext);
  const { roomId } = useSelector((state) => state.chatState);
  const token = accessTokenValue();
  const decodedToken = jwtDecode(token);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [allChatList, setAllChatList] = useState([]);
  const { data: chatDetails, refetch } = useGetSingleChatQuery(
    activeRoomId || roomId,
    {
      skip: !activeRoomId && !roomId,
    }
  );
  const [inputValue, setInputValue] = useState("");
  const [sendMessage] = useSendMessageMutation();
  const emojiPickerRef = useRef(null);
  const handleBack = () => {
    setChatToggle((prev) => !prev);
  };
  const handleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };
  const onEmojiClick = (emojiObject) => {
    setInputValue((prevValue) => prevValue + emojiObject.emoji);
  };
  const handleInput = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    if (chatDetails?.data?.messages) {
      setAllChatList(chatDetails?.data?.messages);
    }
  }, [chatDetails]);

  useEffect(() => {
    if (!socketMethods) return;
    socketMethods.on("receive_message", (data) => {
      setAllChatList((prev) => [
        ...prev,
        {
          ...data.messageData,
          senderType: currentUserType === "seller" ? "USER" : "SELLER",
          senderId: allChatList[0]?.senderId,
        },
      ]);
    });

    return () => {
      socketMethods.off("receive_message");
    };
  }, [socketMethods]);

  const handleSendMessage = async () => {
      if (!inputValue.trim()) {
    toast.error("Empty message can't be sent!");
    return;
  }
    const messageData = {
      isRead: false,
      message: inputValue,
    };
    try {
      const response = await sendMessage({
        roomId: activeRoomId ?? roomId,
        data: messageData,
      });

      if (response?.data) {
        if (socketMethods) {
          socketMethods.emit("send_message", {
            receiverId:
              userTypeValue() === "SELLER"
                ? chatDetails?.data?.createdBy
                : chatDetails?.data?.recieverId,
            senderId: decodedToken.userId,
            roomId: activeRoomId ?? roomId,
            messageData: { ...messageData, ...response?.data?.data?.socket },
          });
          setInputValue("");
        } else {
          console.log("Socket is not defined");
        }
        toast.success("Message send successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chatDetails) {
      refetch();
    }
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //this for date and time 
  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    if (date >= startOfWeek && date <= endOfWeek) {
      return date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., Mon, Wed
    }

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };


  return (
    <div
      className="chat-details"
      style={{
        display: chatToggle ? "none" : "flex",
      }}
      id="chat-details-visible"
    >
      <div className="header">
        <img src={backIcon} alt="" className="back-icon" onClick={handleBack} />
        <div className="current-user">
          <div className="user-default">
            <img src={chatUser1} alt="" />
          </div>
          <div className="user-name">
            <h3>{
              chatDetails?.data?.shopName
                ? chatDetails?.data?.shopName?.length > 20
                  ? chatDetails?.data?.shopName?.slice(0, 20) + "..."
                  : chatDetails?.data?.shopName
                : chatDetails?.data?.customerName?.length > 20
                  ? chatDetails?.data?.customerName?.slice(0, 20) + "..."
                  : chatDetails?.data?.customerName
            }</h3>
            <p>{chatDetails?.data?.shopName ? "Merchant" : "Customer"}</p>
          </div>
        </div>
      </div>
      <div className="chat-box">
        {allChatList?.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.senderId === decodedToken.userId ? "right" : "left"
              }`}
          >
            {console.log(msg.senderId === decodedToken.userId)}
            <p className="message-content">{msg.message}</p>
            <div className="message-timestamp">
              <img
                src={
                  msg?.isRead ? chatBlueTick : chatGreyTick
                }
                alt="tick"
              />

              <span>{formatCreatedAt(msg.createdAt)}</span></div>

          </div>
        ))}
      </div>
      <div className="bottom-div">
        {showEmojiPicker && (
          <div className="emoji-picker-card" ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <img
          src={emojiPickerImage}
          alt=""
          className="smile-image"
          onClick={handleEmojiPicker}
        />
        <textarea
          className="search-input"
          placeholder="Send a Message"
          rows={1}
          value={inputValue}
          onChange={handleInput}
        ></textarea>
        <img
          src={messageSendIcon}
          alt=""
          className="message-send-icon"
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatDetails;
