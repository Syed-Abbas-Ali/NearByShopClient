import React from "react";
import "./termsAndConditions.scss";
import cancelIcon from "../../../assets/cancelIconRed.svg";

const TermsAndConditions = ({setShowPopup}) => {
  return (
    <div className="terms-and-conditions-popup">
      <div className="details-card">
        <div className="cancel-icon">
          <img src={cancelIcon} alt="" onClick={()=>setShowPopup(prev=>!prev)}/>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
