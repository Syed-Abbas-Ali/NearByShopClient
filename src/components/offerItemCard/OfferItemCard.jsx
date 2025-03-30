import React from "react";
import "./offerItemCard.scss";
import rightArrow from "../../assets/forwardIcon.svg";
import OfferCategoryItem from "../offerCategoryItem/OfferCategoryItem";
import { useGetDiscountsQuery } from "../../apis&state/apis/discounts";
import { useSelector } from "react-redux";

const OfferItemCard = ({ categoryList,subcategory }) => {
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

  return (
    <div className="offer-item-card-div">
      {data?.data?.length > 0 && (
        <div className="offer-item-div">
          <div className="category-name">
            <h3>{categoryList}</h3>
            <img src={rightArrow} alt="right arrow" />
          </div>
          <div className="category-discount-cards">
            {data?.data?.map((item, index) => (
              <OfferCategoryItem key={index} discountItem={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferItemCard;
