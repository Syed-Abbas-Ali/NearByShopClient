import { useState } from "react";
import "./tabsComponent.scss";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const TabsComponent = ({value, setValue}) => {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="tabs-component">
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="danger"
          aria-label="secondary tabs example"
          className="tabs"
        >
          <Tab value="wishlist" label="Wishlist" className="tab" />
          <Tab value="new-item" label="Following" className="tab" />
          <Tab value="message" label="chat" className="tab" />
        </Tabs>
      </Box>
    </div>
  );
};

export default TabsComponent;
