import React from "react";
import "./offerHeader.scss";
import backIcon from "../../../assets/arrowLeftLarge.svg";
import { useNavigate } from "react-router-dom";
import { userTypeValue } from "../../../utils/authenticationToken";

const OfferHeader = ({ buttonText, shopUidValue }) => {
  const navigate = useNavigate();
  const handleDiscount = () => {
    if (shopUidValue) {
      navigate(`/offer-edit/${shopUidValue}/discountId`);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="top-header-div">
      <div className="back-name">
        <img src={backIcon} alt="back icon" onClick={handleBack} />
        <h3>Discount</h3>
      </div>
      {buttonText && userTypeValue() === "SELLER" && (
        <button onClick={handleDiscount}>{buttonText}</button>
      )}
    </div>
  );
};

export default OfferHeader;
