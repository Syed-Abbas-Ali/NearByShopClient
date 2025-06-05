import React, { useState, useEffect } from "react";
import "./colorPicker.scss";
import { ColorPicker, Space } from "antd";

const DEFAULT_COLOR = [
  { color: "rgb(16, 142, 233)", percent: 0 },
  { color: "rgb(135, 208, 104)", percent: 100 },
];

const parseGradient = (gradient) => {
  // Fallback if no gradient
  if (!gradient?.includes("gradient")) return DEFAULT_COLOR;

  // Attempt to extract RGB colors and approximate percentages
  const matches = [...gradient.matchAll(/rgb\([^)]+\)/g)];
  return matches.map((match, index) => ({
    color: match[0],
    percent: (index / (matches.length - 1)) * 100,
  }));
};

const ColorPickerComponent = ({ handleColorPicker, isSingle, initialColor }) => {
  const [color, setColor] = useState(isSingle ? "#ffffff" : DEFAULT_COLOR);

  useEffect(() => {
    if (initialColor) {
      if (isSingle) {
        setColor(initialColor);
      } else {
        const parsed = parseGradient(initialColor);
        setColor(parsed);
      }
    }
  }, [initialColor, isSingle]);

  return (
    <Space direction="vertical">
      <ColorPicker
        value={color}
        allowClear
        showText={false}
        mode={isSingle ? "single" : ["single", "gradient"]}
        onChangeComplete={(colorObj) => {
          const cssColor = colorObj.toCssString();
          setColor(cssColor);
          handleColorPicker(cssColor);
        }}
        className="custom-color-picker"
      />
    </Space>
  );
};

export default ColorPickerComponent;
