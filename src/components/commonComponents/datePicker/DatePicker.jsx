import React from "react";
import { DatePicker } from "antd";
import "./datePicker.scss";
import dayjs from "dayjs";

const DatePickerComponent = ({
  placeholder = "Date",
  handleDate,
  dateValue,
  disabled = false,error
}) => {
  return (
    <>
      <DatePicker
        value={dateValue ? dayjs(dateValue) : null} // Convert string to dayjs
        onChange={(date, dateString) => handleDate(dateString)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && (
        <p className="form-error-message">{error}</p>
      )}
    </>
  );
};

export default DatePickerComponent;
