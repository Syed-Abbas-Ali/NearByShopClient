import React from "react";
import "./businessDetailsVideo.scss";
import videoSource from "../../../assets/businessVideo.mp4";

const BusinessDetailsVideo = () => {
  return (
    <video controls>
      <source src={videoSource} type="video/ogg" />
    </video>
  );
};

export default BusinessDetailsVideo;
