import React from "react";
import backIcon from "../../assets/arrowLeftLarge.svg";
import search from "../../assets/searchNew1.svg";
import "./topHeader.scss";

const TopHeader = ({ name, handler }) => {
  return (
    <div className="top-header">
      <div className="header-text">
        <button onClick={() => handler()}>
          <img src={backIcon} alt="" />
        </button>
        <h3>{name}</h3>
      </div>
      <button>
        <img src={search} alt="" />
      </button>
    </div>
  );
};

export default TopHeader;
