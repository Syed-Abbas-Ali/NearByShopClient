import React, { useState } from "react";
import "./input.scss";
import viewIcon from "../../assets/view.png";
import hideIcon from "../../assets/hide.png";

const Input = ({ initialData, handleInput, value = "" }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const handleChange = (e) => {
    handleInput(e);
  };
  const handleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };
  return (
    <div className="input-el">
      <input
        autocomplete="off"
        autofill="off"
        aria-autocomplete="none"
        value={value}
        type={
          initialData?.type === "password" && !isShowPassword
            ? initialData?.type
            : "text"
        }
        name={initialData?.name}
        placeholder={initialData?.placeholderText}
        onChange={handleChange}
      />
      {initialData?.type === "password" && (
        <img
          src={isShowPassword ? hideIcon : viewIcon}
          alt=""
          onClick={handleShowPassword}
        />
      )}
    </div>
  );
};

export default Input;
