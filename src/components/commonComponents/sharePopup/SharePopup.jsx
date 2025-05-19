import React from "react";
import "./sharePopup.scss";
import SocialShare from "../socialShare/SocialShare";
import cancelIcon from "../../../assets/cancelIconRed.svg";


const SharePopup = ({ setIsShare,productId }) => {
  const handleCancel = (e) => {
    e.stopPropagation()
    setIsShare((prev) => !prev);
  };
  const handleParent = (e) => {
    if (e.target.id === "Parent") {
      handleCancel();
    }
  };
  console.log(productId)
  return (
    <div className="share-popup" onClick={handleParent} id="Parent">
      <div className="details-card">
        <div className="cancel-icon-card">
          <img src={cancelIcon} alt="" onClick={handleCancel} />
        </div>
        <SocialShare productIds={productId} />
      </div>
    </div>
  );
};

export default SharePopup;
