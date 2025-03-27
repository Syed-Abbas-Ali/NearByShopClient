import React from "react";
import "./loadingSkelton.scss";

const LoadingSkelton = () => {
  return (
    <div className="loading-skelton">
      {[1, 2, 3, 4, 5, 6,7,8].map((item, index) => {
        return (
          <div className="skelton-item">
            <div className="image-card"></div>
            <div className="details-card">
              <div className="name-card"></div>
              <div className="des-card"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LoadingSkelton;
