import React, { useState } from "react";
import "./chatbot.scss";
import cancelIcon from "../../../assets/cancelNewIcon.svg";
import chatbotUserIcon from "../../../assets/chatbotUserIcon.svg";
import { useDispatch } from "react-redux";
import { setIsChatbotOpen } from "../../../apis&state/state/globalStateName";
import chatbotSendIcon from "../../../assets/chatbotSendIcon.svg";
import locationIcon from "../../../assets/assistanceLocationIcon.svg";
import LogoPointer from "./logoPointer/LogoPointer";

const initialQuestion = {
  mainText: "Hi How can i help you ?",
  topics: [
    "Payment",
    "App related",
    "How to grow your business",
    "Report issue",
  ],
};

const Chatbot = () => {
  const dispatch = useDispatch();
  const [userSelectedQueriesList, setUserSelectedQueriesList] = useState();
  const cancelChatbot = () => {
    dispatch(setIsChatbotOpen());
  };
  const handleQuery = (item) => {
    setUserSelectedQueriesList(item);
  };
  const queryAndPoints = () => {
    return (
      <div className="sub-main-topics">
        {initialQuestion.topics.map((item, index) => {
          return (
            <p
              className="main-topics-text"
              key={index}
              onClick={() => handleQuery(item)}
            >
              {item}
            </p>
          );
        })}
      </div>
    );
  };
  const questionHeadingCard = () => {
    return (
      <div className="question-heading-card">
        <LogoPointer />
        {["Hi How can i help you ?"].map((item, index) => {
          return (
            <p className="main-question-topic-text">
              {initialQuestion.mainText}
            </p>
          );
        })}
      </div>
    );
  };
  return (
    <div className="chatbot-card">
      <div className="chatbot-top-header">
        <img src={chatbotUserIcon} alt="" />
        <p>Vertual Assistant</p>
        <img
          src={cancelIcon}
          alt=""
          className="cancel-icon"
          onClick={cancelChatbot}
        />
      </div>
      <div className="chat-with-bot">
       <div className="chat-content">
       <div className="initial-query-card">
          {questionHeadingCard()}
          {queryAndPoints()}
        </div>
       </div>
        <div className="input-card">
          <div className="language-dropdown">EN</div>
          <input type="text" placeholder="Type your message here..." />
          <div className="chatbot-icon-card">
            <img src={chatbotSendIcon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
