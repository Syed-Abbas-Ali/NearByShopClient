import React from "react";
import "./settings.scss";
import backIcon from "../../assets/arrowLeftLarge.svg";
import { Link, useNavigate } from "react-router-dom";
import rightIndicatorV1 from "../../assets/rightIndicatorV1.svg";
import { useGetProfileApiQuery } from "../../apis&state/apis/authenticationApiSlice";

const menuList = [
  {
    name: "Notifications",
    path: "",
  },
  {
    name: "Visit the Help Center",
    path: "",
  },
  {
    name: "Terms and Conditions",
    path: "",
  },
];

const Settings = () => {
  const navigate = useNavigate();
  const {
    data: userProfileData,
    isLoading: isUserProfileDataLoading,
    isError: isUserProfileDataError,
  } = useGetProfileApiQuery();
  const handleBack = () => {
    navigate(-1);
  };
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };
  return (
    <div className="settings-page">
      <div className="header-card">
        <div className="back-icon-card">
          <button onClick={handleBack}>
            <img src={backIcon} alt="" />
          </button>
          <span>Profile</span>
        </div>
      </div>
      <div className="settings-page-content">
        <div className="user-details">
          <h3>
            {userProfileData?.data
              ? `${userProfileData.data?.firstName} ${userProfileData.data?.lastName}`
              : "-----"}
          </h3>
          <div className="number-card">
            <h3>+91 {userProfileData?.data?.phone || "-----"}</h3>
            <button>
              <img src={rightIndicatorV1} alt="" />
            </button>
          </div>
        </div>
        <hr />
        <div className="links-card">
          {menuList.map((item, index) => (
            <div key={index}>
              <h3>{item.name}</h3>
              <button>
                <img src={rightIndicatorV1} alt="" />
              </button>
            </div>
          ))}
        </div>
        <div className="logout-card">
          <span onClick={handleLogout}>Logout</span>
        </div>
        <div className="version-card">
          <h3>Version 2025</h3>
        </div>
      </div>
    </div>
  );
};

export default Settings;
