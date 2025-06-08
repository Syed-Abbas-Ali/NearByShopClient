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
  defaultValue,
  singleThumb = false,
  valueType = "currency" // 'currency' or 'distance'
}) => {
  const initialValue = singleThumb ? defaultValue : [min, max];
  const [val, setVal] = React.useState(initialValue);

  const handleChange = (event, newValue) => {
    setVal(newValue);
    if (singleThumb) {
      handleRange({ maxPrice: newValue });
    } else {
      const [minPrice, maxPrice] = newValue;
      handleRange({ minPrice, maxPrice });
    }
  };

  const valueLabelFormat = (value) => {
    if (valueType === "distance") {
      return value >= 1000 ? `${value/1000}km` : `${value}m`;
    }
    // Default currency formatting
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
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
        valueLabelFormat={valueLabelFormat}
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
            backgroundColor: "#fff",
            color: "#000",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
            padding: "4px 8px",
            fontSize: "14px",
            fontWeight: "bold",
          },
        }}
      />
      {!singleThumb && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="body2"
            onClick={() => setVal([min, val[1]])}
            sx={{ cursor: "pointer" }}
          >
            {valueType === 'distance' 
              ? (min >= 1000 ? `${min/1000}km` : `${min}m`)
              : new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0
                }).format(min)}
          </Typography>
          <Typography
            variant="body2"
            onClick={() => setVal([val[0], max])}
            sx={{ cursor: "pointer" }}
          >
            {valueType === 'distance'
              ? (max >= 1000 ? `${max/1000}km` : `${max}m`)
              : new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0
                }).format(max)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PriceRange;