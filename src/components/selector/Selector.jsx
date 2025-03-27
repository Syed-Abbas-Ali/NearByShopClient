import React, { useEffect, useState } from "react";
import "./selector.scss";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const Selector = ({ dropdownList, placeholderText, onSelectDropdown,selected }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#f2f2f2" : "#f2f2f2", // Normal and Focused Border Color
      borderWidth: 1, // Border width
      borderRadius: 4, // Border radius
      boxShadow: state.isFocused ? "0 0 0 1px #f2f2f2" : null, // Focused shadow
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 4, // Menu border radius
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Shadow for menu
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#f2f2f2" : null, // Background color when selected
      color: state.isSelected ? "#333" : "#000", // Text color when selected
    }),
  };

  const handleSelector = (e) => {
    setSelectedOption(e)
    onSelectDropdown(e)
  };

  return (
    <div className="selector">
      <Select
        defaultValue={selectedOption??selected}
        onChange={handleSelector}
        options={dropdownList}
        placeholder={placeholderText}
      />
    </div>
  );
};

export default Selector;
