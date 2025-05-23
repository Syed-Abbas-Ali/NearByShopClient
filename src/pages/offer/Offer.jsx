import React, { useEffect, useState } from "react";
import "./offer.scss";
import Categories from "../home/categories/Categories";
import OfferItemCard from "../../components/offerItemCard/OfferItemCard";
import OfferHeader from "./offerHeader/OfferHeader";
import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import MyDiscounts from "./myDiscounts/MyDiscounts";
import cancelIconRed from "../../assets/cancelIconRed.svg";
import OfferCategoryItem from "../../components/offerCategoryItem/OfferCategoryItem";
import {
  useGetAllDiscountsQuery,
  useGetDiscountsQuery,
} from "../../apis&state/apis/discounts";
import { useGetAllShopsApiQuery } from "../../apis&state/apis/shopApiSlice";
import { userTypeValue } from "../../utils/authenticationToken";
import CategoriesList from "../../components/commonComponents/categoriesList/CategoriesList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import Filters from "../../components/filters/Filters";
import { setIsFilterPopupOpen } from "../../apis&state/state/globalStateName";
import SubCategoriesList from "../../components/commonComponents/subCategoriesList/SubCategoriesList";
import FilterInputComponent from "../../components/commonComponents/filterInputComponent/FilterInputComponent";

const Offer = () => {
  const { isFilterPopupOpen } = useSelector((state) => state.globalState);
  const [showExistingDiscounts, setExistingRecords] = useState(false);
  const [allCategories, setAllCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedSubCtegories, setSelectedSubCategory] = useState(null);
  const [searchData, setSearchData] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const openPopup = () => {
    dispatch(setIsFilterPopupOpen());
  };
  const handleExistingDiscounts = () => {
    setExistingRecords((prev) => !prev);
  };
  const { data: sellerDetails } = useGetAllShopsApiQuery(undefined, {
    skip: userTypeValue() === "SELLER" ? false : true,
  });
  const shopDetails = sellerDetails?.data[0];
  const { data: allDiscounts, isLoading } = useGetAllDiscountsQuery(
    {
      shopId: shopDetails?.shop_id,
    },
    {
      skip: !shopDetails?.shop_id,
    }
  );
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" }); // or "auto" for instant scroll
}, []);
  const handleCategory = (categoryName) => {
    setSelectedCategories(categoryName);
    setSelectedSubCategory("");
  };

  return (
    <WrapperComponent>
      <div className="offer-container">
        <OfferHeader
          buttonText={userTypeValue() === "SELLER" ? "Add Discount" : ""}
          shopUidValue={shopDetails?.shop_uid || null}
        />
        <div className="categories-card-container-div">
          {showExistingDiscounts && (
            <div className="all-discounts-cards-list-popup">
              <div className="cancel-icon-card">
                <img
                  src={cancelIconRed}
                  alt=""
                  onClick={handleExistingDiscounts}
                />
              </div>
              <div className="existing-discounts">
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
              </div>
            </div>
          )}
          {userTypeValue() === "SELLER" && (
            <MyDiscounts
              handleExistingDiscounts={handleExistingDiscounts}
              allDiscounts={allDiscounts?.data}
            />
          )}
          <div className="search-filter">
            <FilterInputComponent
              handleChange={(value) => setSearchData(value)}
            />
            {isFilterPopupOpen && <Filters />}
          </div>
          <CategoriesList
            handleCategory={handleCategory}
            setAllCategories={setAllCategories}
            activeCategory={selectedCategories?.name}
          />
          {selectedCategories && (
            <SubCategoriesList
              selectedCategories={selectedCategories?.subcategories}
              handleSelect={(pre) => setSelectedSubCategory(pre)}
              selected={selectedSubCtegories}
            />
          )}
      
          {!selectedCategories &&
            allCategories?.map((item) => {
              return <OfferItemCard categoryList={item?.name} />;
            })}
          {selectedCategories && (
            <OfferItemCard
              categoryList={selectedCategories?.name}
              subcategory={selectedSubCtegories?.name}
            />
          )}
        </div>
        <BottomNavbar />
      </div>
    </WrapperComponent>
  );
};

export default Offer;
