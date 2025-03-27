import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

export const GiveRating = ({ setValue, value }) => {
  return (
    <Box sx={{ "& > legend": { mt: 2 } }}>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </Box>
  );
};

export const ShowRating = () => {
  return (
    <Box sx={{ "& > legend": { mt: 2 } }}>
      <Rating name="half-rating" defaultValue={3.5} precision={0.1} />
    </Box>
  );
};
