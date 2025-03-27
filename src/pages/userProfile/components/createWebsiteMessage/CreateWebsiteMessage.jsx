import React from "react";
import "./createWebsiteMessage.scss";
import ToggleYesNo from "../../../../components/toggleYesNo/ToggleYesNo";
import { useNavigate } from "react-router-dom";
import userUploadedVideoDefaultImage from "../../../../assets/userSampleWebsite.jpg";

const CreateWebsiteMessage = () => {
  const navigate = useNavigate();
  const handleCreateWebsite = () => {
    navigate("/location-verification");
  };
  return (
    <div className="create-website-message-card">
      <div className="notifications-allow">
        <div className="yes-no-notifications">
          <h3>Allow Notifications</h3>
          <div className="toggle-yes-no-div">
            <ToggleYesNo />
          </div>
        </div>
        <p className="yes-no-des">
          About your wish list cards price changes and stocks availability and
          also your following Seller.
        </p>
      </div>
      <hr />
      <div className="website-creation-btn-card">
        <div className="sample-img">
          <img
            src={userUploadedVideoDefaultImage}
            alt=""
            className="user-uploaded-video-image"
          />
        </div>
        <div className="content">
          <p>
            Launch your online business today and unlock limitless opportunities
            for success!
          </p>
          <button onClick={handleCreateWebsite}>Become a seller</button>
        </div>
      </div>
    </div>
  );
};

export default CreateWebsiteMessage;
