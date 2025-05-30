import React from "react";
import "./userProfile.scss";
import ProfileHeader from "./components/profileHeader/ProfileHeader";
import CreateWebsiteMessage from "./components/createWebsiteMessage/CreateWebsiteMessage";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import Navbar from "../../components/navbar/Navbar";
import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import backIcon from "../../assets/arrowLeftLarge.svg";
import settingsIcon from "../../assets/settingsIcon.svg";
import { useNavigate } from "react-router-dom";
import { useGetProfileApiQuery } from "../../apis&state/apis/authenticationApiSlice";

const UserProfile = () => {
  const navigate = useNavigate();
    const { data: userDetails } = useGetProfileApiQuery();
  
  const handleBack = () => {
    navigate(-1);
  };
  const handleSettings = () => {
    navigate("/settings");
  };
  return (
    <div className="user-profile-page">
      <div className="header-card">
        <div className="back-icon-card">
          <button onClick={handleBack}>
            <img src={backIcon} alt="" />
          </button>
          <span>Profile</span>
        </div>
        {/* <button onClick={handleSettings}>
          <img src={settingsIcon} alt="" />
        </button> */}
      </div>
      <div className="user-profile-card">
        <ProfileHeader />
        <hr />
        <CreateWebsiteMessage />
        
      </div>
      <BottomNavbar />
    </div>
  );
};

export default UserProfile;
