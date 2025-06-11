import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
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
  const [inputValue, setInputValue] = useState("");
  const chatBoxRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const { data: chatDetails, refetch, isLoading, error } = useGetSingleChatQuery(
    activeRoomId || roomId,
    {
      skip: !activeRoomId && !roomId,
    }
  );

  const [sendMessage] = useSendMessageMutation();
  const [allChatList, setAllChatList] = useState([]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [allChatList]);

  // Handle click outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update chat list when data changes
  useEffect(() => {
    if (chatDetails?.data?.messages) {
      setAllChatList(chatDetails.data.messages);
      handleIsRead();
    }
  }, [chatDetails]);

  // Socket event handlers
  useEffect(() => {
    if (!socketMethods) return;

    const handleReceiveMessage = (data) => {
      setAllChatList((prev) => [
        ...prev,
        {
          ...data.messageData,
          senderType: currentUserType === "seller" ? "USER" : "SELLER",
          senderId: allChatList[0]?.senderId,
          createdAt: new Date().toISOString()
        },
      ]);
      handleIsRead();
    };

    const handleIsReadEvent = () => refetch();

    socketMethods.on("receive_message", handleReceiveMessage);
    socketMethods.on("is_read", handleIsReadEvent);

    return () => {
      socketMethods.off("receive_message", handleReceiveMessage);
      socketMethods.off("is_read", handleIsReadEvent);
    };
  }, [socketMethods, currentUserType, allChatList]);

  const handleIsRead = useCallback(() => {
    if (!socketMethods || !chatDetails?.data) return;
    
    socketMethods.emit("is_read", {
      receiverId: decodedToken.userId,
      roomId: activeRoomId ?? roomId,
      senderId: userTypeValue() !== "SELLER"
        ? chatDetails.data.createdBy
        : chatDetails.data.recieverId,
    });
  }, [socketMethods, chatDetails, activeRoomId, roomId, decodedToken]);

  const handleIsBlock = useCallback(() => {
    if (!socketMethods || !chatDetails?.data) return;

    socketMethods.emit("block", {
      receiverId: userTypeValue() === "SELLER"
        ? chatDetails.data.createdBy
        : chatDetails.data.recieverId,
      senderId: decodedToken.userId,
      roomId: activeRoomId ?? roomId,
    });
    refetch();
  }, [socketMethods, chatDetails, activeRoomId, roomId, decodedToken]);

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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

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
      // Optimistic update
      const tempId = Date.now();
      setAllChatList(prev => [
        ...prev,
        {
          ...messageData,
          id: tempId,
          senderId: decodedToken.userId,
          senderType: userTypeValue(),
          createdAt: new Date().toISOString()
        }
      ]);

      const response = await sendMessage({
        roomId: activeRoomId ?? roomId,
        data: messageData,
      });

      if (response?.data) {
        if (socketMethods) {
          socketMethods.emit("send_message", {
            receiverId: userTypeValue() === "SELLER"
              ? chatDetails?.data?.createdBy
              : chatDetails?.data?.recieverId,
            senderId: decodedToken.userId,
            roomId: activeRoomId ?? roomId,
            messageData: { ...messageData, ...response?.data?.data?.socket },
          });
          setInputValue("");
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      // Revert optimistic update on error
      setAllChatList(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return "";
    
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
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const renderMessageStatus = (isRead) => (
    <img src={isRead ? chatBlueTick : chatGreyTick} alt={isRead ? "Read" : "Unread"} />
  );

  if (isLoading) return <div className="chat-details loading">Loading chat...</div>;
  if (error) return <div className="chat-details error">Error loading chat</div>;

  return (
    <div
      className="chat-details"
      style={{ display: chatToggle ? "none" : "flex" }}
      id="chat-details-visible"
    >
      <div className="header">
        <img src={backIcon} alt="Back" className="back-icon" onClick={handleBack} />
        <div className="current-user">
          <div className="user-default">
            <img src={chatUser1} alt="User" />
          </div>
          <div className="user-name">
            <h3>
              {chatDetails?.data?.shopName
                ? chatDetails.data.shopName.length > 20
                  ? `${chatDetails.data.shopName.slice(0, 20)}...`
                  : chatDetails.data.shopName
                : chatDetails?.data?.customerName?.length > 20
                ? `${chatDetails.data.customerName.slice(0, 20)}...`
                : chatDetails?.data?.customerName}
            </h3>
            <p>{chatDetails?.data?.shopName ? "Merchant" : "Customer"}</p>
          </div>
        </div>
        {chatDetails?.data?.blockedBy ? (
          <div className="blocked-label">Blocked</div>
        ) : (
          <button className="block" onClick={handleIsBlock}>
            Block
          </button>
        )}
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {allChatList.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          allChatList.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.senderId === decodedToken.userId ? "right" : "left"}`}
            >
              <p className="message-content">{msg.message}</p>
              <div className="message-timestamp">
                {msg.senderId === decodedToken.userId && renderMessageStatus(msg.isRead)}
                <span>{formatCreatedAt(msg.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {chatDetails?.data?.blockedBy ? (
        <div className="blocked-message">
          This conversation has been blocked
        </div>
      ) : (
        <div className="bottom-div">
          {showEmojiPicker && (
            <div className="emoji-picker-card" ref={emojiPickerRef}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <img
            src={emojiPickerImage}
            alt="Emoji Picker"
            className="smile-image"
            onClick={handleEmojiPicker}
          />
          <textarea
            className="search-input"
            placeholder="Send a Message"
            rows={1}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <img
            src={messageSendIcon}
            alt="Send"
            className="message-send-icon"
            onClick={handleSendMessage}
          />
        </div>
      )}
    </div>
  );
};

export default ChatDetails;