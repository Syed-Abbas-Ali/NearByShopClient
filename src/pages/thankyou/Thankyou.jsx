import React from "react";
import "./thankyou.scss";
import { useNavigate } from "react-router-dom";
import successfullyCompleted from "../../assets/successfullyCompleted.jpg";

const Thankyou = () => {
  const navigate = useNavigate();

  const handleGoToWebsite = () => {
    navigate("/");
  };

  return (
    <div className="thankyou-page">
      <div className="thankyou-card">
        <div className="thankyou-content">
          <div className="image-card">
            <img src={successfullyCompleted} />
          </div>
          <h2>Thank You</h2>
          <h3>Your Request has been Processed</h3>
          <p>with in 1 to 3 days </p>
          <div className="go-to-website-card">
            <button onClick={handleGoToWebsite}>Go to Website</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thankyou;
