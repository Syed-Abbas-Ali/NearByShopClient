import React from "react";
import fallbackImage from "../../assets/fallbackImage.gif";
import "./fallback.scss";

const Fallback = () => {
  return (
    <div className="fallback">
      <img src={fallbackImage} />
    </div>
  );
};

export default Fallback;
