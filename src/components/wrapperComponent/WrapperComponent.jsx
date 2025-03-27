import React from "react";
import "./wrapperComponent.scss";
import { useLocation } from "react-router-dom";
import Navbar from "../navbar1/Navbar";
import BottomNavbar from "../bottomNavbar/BottomNavbar";
import Footer from "../footer/Footer";

const WrapperComponent = ({ children }) => {
  const { pathname } = useLocation();
  const ignoreNavbar =
    // pathname.startsWith("/offer") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/user-profile");

  // const ignoreBottomNavbar = pathname.startsWith("/chat");

  return (
    <div className="wrapper-component">
      {!ignoreNavbar && <Navbar />}
      <div
        className={`child-component ${
          ignoreNavbar ? "margin-top-no" : "margin-top-yes"
        }`}
      >
        <div className="sample">{children}</div>
        {/* <Footer/> */}
      </div>
      {<BottomNavbar />}
    </div>
  );
};

export default WrapperComponent;
