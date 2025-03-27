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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";

const Offer = () => {
  const [showExistingDiscounts, setExistingRecords] = useState(false);
  const [categoryWiseDiscounts, setCategoryWiseDiscounts] = useState([]);
  const navigate = useNavigate();
  const {
    mapDetailsState: {
      userMapDetails: { latitude, longitude },
    },
  } = useSelector((state) => state);
  const { data } = useGetDiscountsQuery(
    {
      latitude,
      longitude,
      minPrice: 1,
      maxPrice: 1000000,
      radius: 100000000,
      page: 1,
    },
    {
      skip: !latitude || !longitude,
    }
  );
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
    if (data?.data?.length > 0) {
      const newDiscountObject = {};
      data?.data?.forEach((discount) => {
        if (discount?.categoryName) {
          if (newDiscountObject[discount.categoryName]) {
            newDiscountObject[discount.categoryName].push(discount);
          } else {
            newDiscountObject[discount.categoryName] = [discount];
          }
        }
      });
      setCategoryWiseDiscounts(Object.entries(newDiscountObject));
    }
  }, [data]);

  const handleCategory = (categoryName) => {
    navigate(`/offer-sub-category/${categoryName}`);
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
          <CategoriesList handleCategory={handleCategory} />
          <OfferItemCard categoryWiseDiscounts={categoryWiseDiscounts} />
        </div>
        <BottomNavbar />
      </div>
    </WrapperComponent>
  );
};

export default Offer;
