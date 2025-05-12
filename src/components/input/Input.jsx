import React, { useState } from "react";
import "./input.scss";
import viewIcon from "../../assets/view.png";
import hideIcon from "../../assets/hide.png";

const Input = ({ initialData, handleInput, value = "" }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const handleChange = (e) => {
    const { value, name } = e.target;

    if (initialData?.isString) {
      const onlyLetters = value.replace(/[^A-Za-z\s]/g, "");
      handleInput({ target: { name, value:onlyLetters } });
    } else {
      handleInput(e);
    }
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
        pattern={initialData?.pattern ?? ""}
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
