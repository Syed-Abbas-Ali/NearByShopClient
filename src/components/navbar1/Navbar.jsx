import React, { useContext, useEffect, useState } from "react";

import "./navbar.scss";

import logo from "../../assets/appLogo3.svg";
import chatIcon from "../../assets/chatColor1.svg";
import notificationIcon from "../../assets/notificationColor1.svg";
import userIcon from "../../assets/userIcon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import becomeSellerImage from "../../assets/shopBorderActive.svg";
import userBorderIcon from "../../assets/userIcon.svg";
import UserLocationPointer from "../userLocationPointer/UserLocationPointer";
import {
  accessTokenValue,
  userTypeValue,
} from "../../utils/authenticationToken";
import SocketContext from "../../context/socketContext";
import toast from "react-hot-toast";
import {
  useGetNotificationListQuery,
  useSetIsReadMutation,
} from "../../apis&state/apis/chat";
import NotificationCard from "./components/notification/NotificationCard";
// import Chat from "./components/chat/Chat";
import { useDispatch, useSelector } from "react-redux";
import { toggleChatActive } from "../../apis&state/state/chatState";

const mobileNavIcons = [
  {
    path: "/chat",
    icon: chatIcon,
  },
  // {
  //   path: "/notifications",
  //   icon: notificationIcon,
  // },
  {
    path: "/profile",
    icon: userIcon,
  },
];

const desktopNavbarLinks = [
  {
    name: "Home",
    path: "/",
  },
    {
    name: "shops",
    path: "/shop",
  },
    {
    name: "Deals",
    path: "/offer",
  },
   {
    name: "Chats",
    path: "/chat",
  },
  {
    name: "Wishlist",
    path: "/wishlist",
  },

 

];

const Navbar = () => {
  let token = accessTokenValue();
  const socketMethods = useContext(SocketContext);
  const { roomId } = useSelector(state => state.chatState)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { pathname } = useLocation();
  const [notificationActive, setNotificationActive] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const [totalNotification, setTotalNotification] = useState();
  const [activeRoomId, setActiveRoomId] = useState(null);

  const { data: notificationList } = useGetNotificationListQuery();
  const [handleIsReadMutation] = useSetIsReadMutation();
  const handleMobileNav = (pathName) => {
    navigate(pathName);
  };

  const handleDesktopNav = (pathName) => {
    navigate(pathName);
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

  const handleLogin = async (id) => {
    try {
      const response = await handleIsReadMutation(id);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLoginActive = () => {
    navigate("/login");
  };

  const handleChatActive = () => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(toggleChatActive());
    }
  };

  useEffect(() => {
    if (notificationList) {
      setTotalNotification(notificationList?.data);
    }
  }, [notificationList]);
  useEffect(() => {
    if (!socketMethods) return;
    socketMethods.on("notification", (data) => {
      setTotalNotification((prev) => [...prev, data]);
      toast.success("new notification");
    });
    return () => {
      socketMethods.off("notification");
    };
  }, [socketMethods]);
  return (
    <>
      <header className="mobile-navbar">
        <div className="logo-card" onClick={handleLogo}>
          <img className="logo-imgs" src={logo} alt="" />
          <div className="user-Location">
            <UserLocationPointer />
          </div>
        </div>

        <nav>
          <ul>
            {mobileNavIcons.map((link, index) => (
              <li onClick={() => handleMobileNav(link.path)} key={index}>
                <img src={link.icon} alt="" />
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <header className="desktop-navbar">
        <div className="logo-card-container">
          <div className="logo-card" onClick={handleLogo}>
            <img className="logo-imgs" src={logo} alt="" />
          </div>

          <UserLocationPointer />

        </div>
        {/* <UserLocationDetails /> */}
        <div className="right-card">
          <nav>
            <ul>
              {desktopNavbarLinks.map((link) => (
                <li
                  className={pathCorrect(link.path) ? "active-nav-link" : ""}
                  onClick={() => handleDesktopNav(link.path)}
                >
                  {link.name}
                </li>
              ))}
            </ul>
          </nav>
          {/* {token && (
            <div className="noti-icon">
              <img
                src={notificationIcon}
                alt=""
                onClick={() => setNotificationActive((prev) => !prev)}
              />
              {totalNotification?.length > 0 && (
                <div className="total-count">
                  {totalNotification && totalNotification?.length}
                </div>
              )}
              <div
                className={
                  notificationActive
                    ? "notification-slot-active"
                    : "notification-slot-deactive"
                }
              >
                {totalNotification?.map((item, index) => {
                  return (
                    <NotificationCard
                      item={item}
                      index={index}
                      handleLogin={handleLogin}
                      setActiveRoomId={setActiveRoomId}
                      setChatActive={setChatActive}
                    />
                  );
                })}
              </div>
            </div>
          )} */}

          {/* {isChatActive && token && (
            <div className="chat-component-popUp">
              
            </div>
          )} */}
          {/* dont delete this */}
          {/* <div className="chat-icon" onClick={handleChatActive}>
            <img src={chatIcon} alt="" />
          </div> */}
          {/* <div className="profile-card">
            {userTypeValue() === "USER" && token && (
              <div
                className="become-seller-image"
                onClick={() => navigate("/location-verification")}
              >
                <img src={becomeSellerImage} alt="" />
                <span>Become a Seller</span>
              </div>
            )}
            {userTypeValue() === "USER" && token ? (
              <div>
                <button onClick={() => navigate("/login")} >Login</button>
              </div>
            ) : (
              <div className="profile-image" onClick={() => navigate("/profile")}>

                <img src={userBorderIcon} alt="Profile" />
                <span>Profile</span>
              </div>
            )}
          </div> */}
          <div className="profile-card">
             <div className="profile-image" onClick={() => navigate("/profile")}>
                <img src={userBorderIcon} alt="Profile" />
                <span>Profile</span>
              </div>

          </div>

        </div>
      </header>
    </>
  );
};

export default Navbar;
