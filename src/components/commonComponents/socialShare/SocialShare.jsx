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

const SocialShare = ({ productIds, title = "Check this out!" }) => {
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="social-share-card" onClick={handleClick}>
      <FacebookShareButton url={`${window.location.origin}/product-details/${productIds}`} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <WhatsappShareButton url={`${window.location.origin}/product-details/${productIds}`} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <TelegramShareButton url={`${window.location.origin}/product-details/${productIds}`} title={title}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>

      <EmailShareButton url={`${window.location.origin}/product-details/${productIds}`} subject={title} body={title}>
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
  );
};

export default SocialShare;
