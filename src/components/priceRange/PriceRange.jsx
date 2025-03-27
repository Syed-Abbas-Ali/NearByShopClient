import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

const PriceRange = ({
  min,
  max,
  minLabel,
  maxLabel,
  step,
  handleRange,
}) => {
  const [val, setVal] = React.useState([min, max]); // Initialize with min & max

  const handleChange = (event, newValue) => {
    setVal(newValue);
    handleRange(newValue[1]);
  };

  return (
    <Box sx={{ width: "100%", paddingLeft: "10px" }}>
      <Slider
        marks={[
          { value: min, label: minLabel },
          { value: max, label: maxLabel },
        ]}
        step={step}
        value={val}
        valueLabelDisplay="auto"
        min={min}
        max={max}
        onChange={handleChange}
        sx={{
          "& .MuiSlider-thumb": {
            color: "#FF6600",
          },
          "& .MuiSlider-track": {
            color: "#FF6600",
          },
          "& .MuiSlider-rail": {
            color: "#E0E0E0",
          },
          "& .MuiSlider-valueLabel": {
            backgroundColor: "#fff", // White background
            color: "#000", // Black text
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Shadow effect
            borderRadius: "5px",
            padding: "4px 8px",
            fontSize: "14px",
            fontWeight: "bold",
          },
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="body2"
          onClick={() => setVal([min, val[1]])}
          sx={{ cursor: "pointer" }}
        >
          {min} {minLabel}
        </Typography>
        <Typography
          variant="body2"
          onClick={() => setVal([val[0], max])}
          sx={{ cursor: "pointer" }}
        >
          {max} {maxLabel}
        </Typography>
      </Box>
    </Box>
  );
};

export default PriceRange;
