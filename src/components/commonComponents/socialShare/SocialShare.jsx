import React from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  EmailIcon,
} from "react-share";
import "./socialShare.scss";
import toast from "react-hot-toast";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // or use your own icon

const SocialShare = ({ shopIds, productIds, title = "Check this out!" }) => {
  const isProduct = Boolean(productIds);
  const shareUrl = `${window.location.origin}/${
    isProduct ? `product-details/${productIds}` : `shop-profile-view/${shopIds}`
  }`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  return (
    <div className="social-share-container">
      <h3 className="share-title">Share</h3>
      
      <div className="share-buttons">
        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={32} round />
          <span>WhatsApp</span>
        </WhatsappShareButton>
        
        <FacebookShareButton url={shareUrl} quote={title}>
          <FacebookIcon size={32} round />
          <span>Facebook</span>
        </FacebookShareButton>
        
        <TwitterShareButton url={shareUrl} title={title}>
          <TwitterIcon size={32} round />
          <span>X</span>
        </TwitterShareButton>
        
        <EmailShareButton url={shareUrl} subject={title} body={title}>
          <EmailIcon size={32} round />
          <span>Email</span>
        </EmailShareButton>
      </div>
      
      <div className="link-copy-section">
        <div className="link-text">{shareUrl}</div>
        <button className="copy-button" onClick={handleCopyLink}>
          <ContentCopyIcon fontSize="small" />
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
};

export default SocialShare;