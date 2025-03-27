import React from "react";
import "./fullShops.scss";
import TopHeader from "../../components/topHeader/TopHeader";
import { useNavigate } from "react-router-dom";
import AllCategories from "../../components/commonComponents/allCategories/AllCategories";
import SubCategoriesListVertical from "../subHome/components/subCategoriesListVertical/SubCategoriesListVertical";
import HorizontalCards from "../../components/horizontalCards/HorizontalCards";
import ShopCard from "../../components/shopCard/ShopCard";

const FullShops = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="full-shops-card">
      <TopHeader name={"Shops"} handler={handleBack} />
      <div className="content-card">
        <HorizontalCards />
        <div className="sub-categories-card">
          <SubCategoriesListVertical />
          <div className="near-shops-container">
            {[1, 2, 3, 4, 5, 6,7,8,10,11,12,13,14,15].map((item, index) => (
              <ShopCard id={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullShops;
