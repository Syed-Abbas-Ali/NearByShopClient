import React from "react";
import "./yesNoPopup.scss";

const YesNoPopup = ({ message, handleYesNoPopup }) => {
  return (
    <div className="yes-no-popup">
      <div className="yes-no-popup-content">
        <h1>{message}</h1>
        <div className="yes-no-btns">
          <button onClick={() => handleYesNoPopup("YES")}>Yes</button>
          <button onClick={() => handleYesNoPopup("NO")}>No</button>
        </div>
      </div>
    </div>
  );
};

export default YesNoPopup;
