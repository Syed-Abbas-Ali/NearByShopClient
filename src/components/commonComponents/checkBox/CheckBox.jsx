import React from "react";
import checkBoxActive from "../../../assets/checkBoxActiveV1.svg";
import checkBoxInActive from "../../../assets/checkBoxInActiveV1.svg";
import "./checkBox.scss";

const CheckBox = ({ data, handleCheckBox, checkBoxValues }) => {
  const { labelText, value } = data;
  const handleCheckBoxClick = () => {
    handleCheckBox(value);
  };
  return (
    <div className="checkbox-card" onClick={handleCheckBoxClick}>
      <button>
        <img
          src={
            checkBoxValues?.includes(value) ? checkBoxActive : checkBoxInActive
          }
          alt=""
        />
      </button>
      <span>{labelText}</span>
    </div>
  );
};

export default CheckBox;
