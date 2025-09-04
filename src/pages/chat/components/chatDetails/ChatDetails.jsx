import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../../../../context/socketContext";
import { useLocation } from "react-router-dom";
import socketService from "../../../../context/socket.service";
import { setRoomChat } from "../../../../apis&state/state/chatState";
import { debounce } from "lodash";
// import { AppState, Platform } from "react-native";

const ChatDetails = ({ chatToggle, setChatToggle }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { roomId } = useSelector((state) => state.chatState);
  const token = accessTokenValue();
  const decodedToken = jwtDecode(token);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatBoxRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [isReadCalled, setIsReadCalled] = useState(false);
  const { messages, sendMessage } = useChat();
  const {
    data: chatDetails,
    refetch,
    isLoading,
    error,
    isFetching,
  } = useGetSingleChatQuery(roomId, {
    skip: !roomId,
  });

  const [sendMessageMutation] = useSendMessageMutation();
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
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location?.search > 5) {
      let rid = location?.search?.splice(0, 1);
      dispatch(setRoomChat(rid));
    }
  }, []);

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
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async (text) => {
    if (!inputValue.trim() && !text) {
      toast.error("Empty message can't be sent!");
      return;
    }

    const messageData = {
      isRead: false,
      message: text ?? inputValue,
    };

    try {
      const response = await sendMessageMutation({
        roomId: roomId ?? "",
        data: messageData,
      });

      if (response?.data) {
        await sendMessage(
          { ...messageData, ...response?.data?.data?.socket },
          roomId,
          userTypeValue() === "SELLER"
            ? currentRoomId?.createdBy
            : currentRoomId?.recieverId,
          decodedToken.userId
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      // Revert optimistic update on error
      setAllChatList((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  const handleIsRead = async () => {
    socketService.setIsRead({
      receiverId: decodedToken.userId,
      senderType: userTypeValue() !== "SELLER" ? "createdBy" : "recieverId",
    });
  };

  const handleIsBlock = () => {
    if (!socketService || !chatDetails?.data) return;

    socketService.setIsBlock({
      receiverId:
        userTypeValue() === "SELLER"
          ? chatDetails.data.createdBy
          : chatDetails.data.recieverId,
      senderId: decodedToken.userId,
      roomId: roomId,
    });
    setTimeout(async() => {
      await handleSendMessage("blocked")
      refetch();
    }, 500);
  };

  const handleIsReadDeBounce = debounce(async () => {
    await handleIsRead();
    refetch();
  }, 500); // 300ms delay (adjust as needed)

  const handleIsReadDeBounceCall = (p) => {
    if (p == false) {
      handleIsReadDeBounce();
    }
  };
  useEffect(() => {
    socketService.onReceiveMessage(async (message) => {
      setAllChatList((prev) => [...prev, message.messageData]);
      await handleIsRead();
    });

    return () => {
      socketService.offReceiveMessage();
    };
  }, [socketService]);

  useEffect(() => {
    const handleIsReadEvent = () => refetch();
    socketService.setIsReadEvent(handleIsReadEvent);
    return () => {
      socketService.setIsReadEventOff();
    };
  }, []);

  useEffect(() => {
    if (roomId?.length > 5 && chatDetails?.data) {
      handleIsRead();
    }
  }, [roomId]);
  useEffect(() => {
    if (chatDetails?.data) {
      setAllChatList(chatDetails?.data?.messages);
      setCurrentRoomId(chatDetails?.data);
      if (!isReadCalled) {
        handleIsRead();
        setIsReadCalled(true);
      }
    }
  }, [chatDetails, isFetching]);

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
    <img
      src={isRead ? chatBlueTick : chatGreyTick}
      alt={isRead ? "Read" : "Unread"}
    />
  );

  if (isLoading)
    return <div className="chat-details loading">Loading chat...</div>;
  if (error)
    return <div className="chat-details error">Error loading chat</div>;

  return (
    <div
      className="chat-details"
      style={{ display: chatToggle ? "none" : "flex" }}
      id="chat-details-visible"
    >
      <div className="header">
        <img
          src={backIcon}
          alt="Back"
          className="back-icon"
          onClick={handleBack}
        />
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
          [...allChatList].map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.senderId === decodedToken.userId ? "right" : "left"
              }`}
            >
              <p className="message-content">{msg.message}</p>
              <div className="message-timestamp">
                {msg.senderId === decodedToken.userId &&
                  renderMessageStatus(msg.isRead)}
                {msg.senderId != decodedToken.userId &&
                  handleIsReadDeBounceCall(msg.isRead)}
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
