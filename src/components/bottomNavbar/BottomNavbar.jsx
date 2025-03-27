import React from "react";
import "./bottomNavbar.scss";
import wishlistIcon from "../../assets/wishList.svg";
import homeIcon from "../../assets/home.svg";
import shop from "../../assets/shop.svg";
import shopActive from "../../assets/shopBorderActive.svg";
import offerIcon from "../../assets/offerIcon.svg";
import wishlistIconActive from "../../assets/wishListActive.svg";
import homeIconActive from "../../assets/homeBorderActive.svg";
import offerIconActive from "../../assets/offerActiveOutline.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../apis&state/apis/masterDataApis";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleNavigate = (pathText) => {
    navigate(pathText);
  };

  const { data: allCategoriesData } =
    useGetAllCategoriesAndSubCategoriesQuery();

  const activeTab = (everyPath) => {
    if (pathname === "/") {
      if (everyPath === "/") {
        return true;
      }
      return false;
    } else if (everyPath !== "/" && pathname.startsWith(everyPath)) {
      return true;
    }
    return false;
  };

  const categoryName = allCategoriesData?.data[0]?.name || "";

  const bottomTabs = [
    {
      name: activeTab("/") ? homeIconActive : homeIcon,
      path: "/",
      alt: "Home",
    },
    {
      name: activeTab("/shop") ? shopActive : shop,
      path: `/shop/${categoryName}`,
      alt: "Shops",
    },
    {
      name: activeTab("/wishlist") ? wishlistIconActive : wishlistIcon,
      path: "/wishlist",
      alt: "Wishlist",
    },
    {
      name: activeTab("/offer") ? offerIconActive : offerIcon,
      path: "/offer",
      alt: "Discount",
    },
  ];
  return (
    <div className="bottom-navbar">
      {bottomTabs.map((item, index) => {
        return (
          <div key={index} onClick={() => handleNavigate(item.path)}>
            <img src={item.name} alt={item.alt} />
            <p className={activeTab(item.path) ? "active-text" : ""}>
              {item.alt}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNavbar;
