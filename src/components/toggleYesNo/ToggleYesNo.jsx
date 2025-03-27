import * as React from "react";
import "./toggleYesNo.scss";

const ToggleYesNo = ({ handleYesShop }) => {
  const handleCheckBox = (e) => {
    handleYesShop(e.target.checked);
  };
  return (
    <div className="toggle-yes-no">
      <input
        type="checkbox"
        name="checkbox"
        id="toggle"
        onChange={handleCheckBox}
      />
      <label htmlFor="toggle" className="switch"></label>
    </div>
  );
};

export default ToggleYesNo;
