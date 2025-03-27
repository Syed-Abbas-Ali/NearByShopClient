import React from "react";
import locationIcon from "../../../../assets/assistanceLocationIcon.svg";
import "./logoPointer.scss";

const LogoPointer = () => {
  return (
    <div className="location-pointer">
      <img src={locationIcon} alt="" />
    </div>
  );
};

export default LogoPointer;
