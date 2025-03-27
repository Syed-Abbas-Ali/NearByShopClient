import React from "react";
import "./noDataFound.scss";
import noDataFoundImage from "../../assets/noDataFound.png";

const NoDataFound = () => {
  return (
    <div className="no-data-found">
      <img src={noDataFoundImage} alt="" />
      <h3>Pick your favorites</h3>
    </div>
  );
};

export default NoDataFound;
