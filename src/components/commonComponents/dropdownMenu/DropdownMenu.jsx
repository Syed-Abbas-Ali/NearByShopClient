import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import "./dropdownMenu.scss"; // Import SCSS file

const DropdownMenu = ({
  dataArray = [],
  handleDropdown,
  type,
  defaultValue,
  placeholder,
}) => {
  const [selectedItem, setSelectedItem] = useState({
    label: placeholder,
  }); // Default text
  // Set default value when component mounts or when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      const defaultLabel = dataArray.find(
        (item) => item.label === defaultValue
      );
      if (defaultLabel) setSelectedItem(defaultLabel);
    }
  }, [defaultValue, dataArray]);

  const handleMenuClick = (e) => {
    const selectedLabel = dataArray.find(
      (item) => String(item.key) === e.key
    )?.label;
    if (selectedLabel) setSelectedItem(selectedLabel);

    if (type === "category") {
      handleDropdown({
        label: selectedLabel,
        name: selectedLabel,
        value: e.key,
      });
    } else if (type === "subCategory") {
      handleDropdown({
        label: selectedLabel,
        value: e.key,
      });
    }
  };

  // Convert `dataArray` to the correct Ant Design `items` format
  const menuItems = dataArray.map((item) => ({
    label: item.label,
    key: String(item.key), // Ensure key is a string
  }));

  return (
    <Dropdown
      overlay={<Menu onClick={handleMenuClick} items={menuItems} />}
      trigger={["click"]}
    >
      <div className="dropdown-container">
        <span>{selectedItem.label}</span>
        <DownOutlined />
      </div>
    </Dropdown>
  );
};

export default DropdownMenu;
