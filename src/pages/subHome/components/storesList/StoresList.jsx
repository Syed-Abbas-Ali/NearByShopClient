import React from "react";
import "./storesList.scss";
import searchIcon from "../../../../assets/searchNew1.svg";
import backIcon from "../../../../assets/arrowLeftLarge.svg";
import { useNavigate } from "react-router-dom";

const StoresList = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="stores-list">
      <div className="header-card">
        <button onClick={handleBack}>
          <img src={backIcon} />
        </button>
        <h3>Popular Stores</h3>
        <button>
          <img src={searchIcon} />
        </button>
      </div>
      <div className="stores-list-container">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div className="single-store-badge">
            <div className="badge-card"></div>
            <p>Sans Sen</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoresList;
