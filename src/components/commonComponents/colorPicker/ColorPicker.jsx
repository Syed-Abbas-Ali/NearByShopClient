import React from "react";
import "./colorPicker.scss";
import { ColorPicker, Space } from "antd";

const DEFAULT_COLOR = [
  {
    color: "rgb(16, 142, 233)",
    percent: 0,
  },
  {
    color: "rgb(135, 208, 104)",
    percent: 100,
  },
];

const ColorPickerComponent = ({ handleColorPicker, isSingle }) => (
  <Space direction="vertical">
    <ColorPicker
      defaultValue={DEFAULT_COLOR}
      allowClear
      showText={false} // Hides color value
      mode={isSingle ? "single" : ["single", "gradient"]}
      onChangeComplete={(color) => {
        handleColorPicker(color.toCssString());
      }}
      className="custom-color-picker" // Apply styles
    />
  </Space>
);

export default ColorPickerComponent;
