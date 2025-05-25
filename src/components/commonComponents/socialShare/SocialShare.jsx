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

const SocialShare = ({ shopIds, productIds, title = "Check this out!" }) => {
  const handleClick = (e) => {
    e.stopPropagation();
  };

  console.log(shopIds,30)


  const isProduct = Boolean(productIds);
  const shareUrl = `${window.location.origin}/${isProduct ? `product-details/${productIds}` : `shop-profile-view/${shopIds}`}`;

  const shareButtons = [
    {
      Component: FacebookShareButton,
      Icon: FacebookIcon,
      props: { quote: title }
    },
    {
      Component: WhatsappShareButton,
      Icon: WhatsappIcon,
      props: { title }
    },
    {
      Component: TelegramShareButton,
      Icon: TelegramIcon,
      props: { title }
    },
    {
      Component: EmailShareButton,
      Icon: EmailIcon,
      props: { subject: title, body: title }
    }
  ];

  return (
    <div className="social-share-card" onClick={handleClick}>
      {shareButtons.map(({ Component, Icon, props }, index) => (
        <Component url={shareUrl} key={index} {...props}>
          <Icon size={32} round />
        </Component>
      ))}
    </div>
  );
};

export default SocialShare;
