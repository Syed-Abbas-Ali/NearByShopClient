import React from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon
} from "react-share";
import "./socialShare.scss";

const SocialShare = ({ url = "https://google.com", title = "Check this out!" }) => {
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="social-share-card" onClick={handleClick}>
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>

      <EmailShareButton url={url} subject={title} body={title}>
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
  );
};

export default SocialShare;
