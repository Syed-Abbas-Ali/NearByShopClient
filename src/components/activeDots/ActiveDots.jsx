import React from "react";
import "./activeDots.scss";

const ActiveDots = ({ activeDotNumber }) => {
  return (
    <div className="active-dots">
      {[1, 2].map((item, index) => (
        <span
          key={index}
          className={item === activeDotNumber ? "active-span" : ""}
        ></span>
      ))}
    </div>
  );
};

export default ActiveDots;
