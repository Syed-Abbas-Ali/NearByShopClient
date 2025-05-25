import React from "react";
import "./sharePopup.scss";
import SocialShare from "../socialShare/SocialShare";
import cancelIcon from "../../../assets/cancelIconRed.svg";


const SharePopup = ({ setIsShare,productId,shopId }) => {
  const handleCancel = (e) => {
    e.stopPropagation()
    setIsShare((prev) => !prev);
  };
  const handleParent = (e) => {
    if (e.target.id === "Parent") {
      handleCancel();
    }
  };

  console.log(shopId,12);

  return (
    <div className="share-popup" onClick={handleParent} id="Parent">
      <div className="details-card">
        <div className="cancel-icon-card">
          <img src={cancelIcon} alt="" onClick={handleCancel} />
        </div>
        {shopId? <SocialShare shopIds={shopId} /> : <SocialShare productIds={productId} />}
        
      </div>
    </div>
  );
};

export default SharePopup;
