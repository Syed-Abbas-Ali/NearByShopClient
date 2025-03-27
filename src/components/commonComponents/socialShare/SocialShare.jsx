import React from "react";
// import { ShareSocial } from "react-share-social";
import "./socialShare.scss";

const SocialShare = ({ url, title }) => {
  const handleClick = (e) => {
    e.stopPropagation(); // Prevents the event from propagating
  };
  return (
    <div className="social-share-card" onClick={handleClick}>
      {/* <ShareSocial
        url={"https://google.com"}
        socialTypes={["facebook", "whatsapp", "telegram", "email"]}
        style={{
          backgroundColor: "none",
          iconSize: 32,
        }}
      /> */}
    </div>
  );
};

export default SocialShare;
