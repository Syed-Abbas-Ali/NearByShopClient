import React from "react";
import backIcon from "../../../assets/arrowLeftLarge.svg";
import filterIcon from "../../../assets/filterNew1.svg";
import searchIcon from "../../../assets/searchNew1.svg";
import "./topSearchComponent.scss";
import { useNavigate } from "react-router-dom";

const TopSearchComponent = ({ isBackIcon = true }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="top-search-component">
      <button onClick={handleBack}>
        <img src={backIcon} alt="" />
      </button>
      <div className="input-div">
        <button>
          <img src={searchIcon} alt="" />
        </button>
        <input type="text" placeholder="Search" />
        <button>
          <img src={filterIcon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default TopSearchComponent;
