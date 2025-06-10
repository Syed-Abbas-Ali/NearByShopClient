import React from "react";
import "./offerItemCard.scss";
import rightArrow from "../../assets/forwardIcon.svg";
import OfferCategoryItem from "../offerCategoryItem/OfferCategoryItem";
import { useGetDiscountsQuery } from "../../apis&state/apis/discounts";
import { useSelector } from "react-redux";

const OfferItemCard = ({ categoryList,subcategory,discountItem }) => {
  const { globalFilter } = useSelector((state) => state.globalState);
  const {
    mapDetailsState: {
      userMapDetails: { latitude, longitude },
    },
  } = useSelector((state) => state);
  const { data } = useGetDiscountsQuery(
    {
      ...globalFilter,
      // latitude: 17.3914116,
      // longitude: 78.4624902,
      latitude,
      longitude,
      category: categoryList,
      subcategory
    },
    {
      skip: !latitude || !longitude,
    }
  );

  console.log(55,data)

   if (discountItem) {
    return (
      <div className="offer-item-card-div">
        <OfferCategoryItem discountItem={discountItem} />
      </div>
    );
  }

  return (
    <div className="offer-item-card-div">
      {data?.data?.items?.length > 0 && (
        <div className="offer-item-div">
          <div className="category-name">
            <h3>{categoryList}</h3>
            <img src={rightArrow} alt="right arrow" />
          </div>
          <div className="category-discount-cards">
            {data?.data?.items?.map((item, index) => (
              <OfferCategoryItem key={index} discountItem={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferItemCard;