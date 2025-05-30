import React, { useState } from "react";
import "./navbar.scss";

import appLogo from "../../assets/appLogoSvg.svg";
import logout from "../../assets/logout.svg";
import chatIcon from "../../assets/chatOne.svg";
import userBorderIcon from "../../assets/userIcon.svg";
import notificationIcon from "../../assets/notificationColor1.svg";
import { useLocation, useNavigate } from "react-router-dom";
import Search from "../search/Search";
``;
import becomeSellerImage from "../../assets/shopBorderActive.svg";
import { userTypeValue } from "../../utils/authenticationToken";
import UserLocationSelectPopup from "../commonComponents/userLocationSelectPopup/UserLocationSelectPopup";
import UserLocationDetails from "../commonComponents/userLocationDetails/UserLocationDetails";

const noNavbarPages = ["/wishlist", "/profile"];

const desktopLinksArray = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Shops",
    path: "/shop",
  },
  {
    name: "Wishlist",
    path: "/wishlist",
  },
  {
    name: "Chat",
    path: "/chat",
  },
  {
    name: "Notifications",
    path: "/notifications",
  },
  {
    name: "Discount",
    path: "/offer",
  },
];

const profileMenu = [
  {
    icon: userBorderIcon,
    name: "Profile",
  },
  {
    icon: logout,
    name: "Logout",
  },
];

const Navbar = () => {
  const { pathname } = useLocation();
  
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isShowChatIcon = pathname.includes("/chat");

  const handleNavigate = (navigatePath) => {
    navigate(navigatePath);
  };
  const handleMenuItem = (event, value) => {
    event.stopPropagation();
    let navigateTo;
    if (value === "profile") {
      navigateTo = "/profile";
    } else if (value === "logout") {
      sessionStorage.clear();
      navigateTo = "/login";
    }
    navigate(navigateTo);
  };
  const pathCorrect = (everyPath) => {
    if (everyPath.length === 1) {
      if (pathname === everyPath) {
        return true;
      }
      return false;
    } else if (pathname.startsWith(everyPath)) {
      return true;
    }
    return false;
  };
  const handleLogo = () => {
    navigate("/");
  };
  const handleUser = () => {
    navigate("/profile");
  };

  return (
    <div className={`navbar-card ${noNavbarPages.includes(pathname) && ""}`}>
      <div className="app-logo">
        <img src={appLogo} alt="logo" height={30} onClick={handleLogo} />
      </div>
      <div className="features-card">
        {!isShowChatIcon && (
          <div onClick={() => handleNavigate("/chat")}>
            <img src={chatIcon} alt="chat" />
          </div>
        )}
        <div onClick={() => handleNavigate("/notifications")}>
          <div className="count-badge">3</div>
          <img src={notificationIcon} alt="notification" />
        </div>
        <div onClick={() => setShowProfileMenu((prev) => !prev)}>
          {showProfileMenu && (
            <ul className="user-menu">
              {profileMenu.map((item, index) => (
                <li
                  className="single-feature"
                  onClick={(e) =>
                    handleMenuItem(e, item.name.toLocaleLowerCase())
                  }
                >
                  <img src={item.icon} />
                  <p>{item.name}</p>
                </li>
              ))}
            </ul>
          )}
          <img src={userBorderIcon} alt="user" />
        </div>
      </div>
      <div className="desktop-sub-nav">
        <div className="search-component-div-in-nav">
          <UserLocationDetails/>
          <div className="desktop-search">
            <Search />
          </div>
        </div>
        <div className="nav-one-div">
          <div className="desktop-nav-links">
            {desktopLinksArray.map((item, index) => {
              return (
                <p
                  key={index}
                  onClick={() => handleNavigate(item.path)}
                  className={pathCorrect(item.path) ? "active-nav-link" : ""}
                >
                  {item.name}
                </p>
              );
            })}
          </div>
          {/* {userTypeValue() === "USER" && (
            <div
              className="become-seller-card"
              onClick={() => navigate("/location-verification")}
            >
              <img src={becomeSellerImage} alt="" />
              <p>Become a Seller</p>
            </div>
          )} */}
          <div className="user-profile" onClick={handleUser}>
            <img src={userBorderIcon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
