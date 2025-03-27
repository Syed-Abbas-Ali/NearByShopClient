import React from "react";
import "./subHome.scss";
import backIcon from "../../assets/arrowLeftLarge.svg";
import Search from "../../components/search/Search";
import Categories from "../home/categories/Categories";
import SubCategoriesListVertical from "./components/subCategoriesListVertical/SubCategoriesListVertical";
import ProductsList from "./components/productsList/ProductsList";
import { useNavigate } from "react-router-dom";
import StoresList from "./components/storesList/StoresList";

const SubHome = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="sub-home-page">
      {/* <div className="search-wrapper">
        <img
          src={backIcon}
          alt=""
          className="back-icon"
          onClick={handleBack}
        />
        <Search />
      </div> */}
      <StoresList />
      <div className="sub-categories-and-products">
        <SubCategoriesListVertical />
        <ProductsList />
      </div>
    </div>
  );
};

export default SubHome;
