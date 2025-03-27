import React from "react";

const MapUI = ({ mapRef }) => {
  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", borderRadius: "10px" }}
    />
  );
};

export default MapUI;
