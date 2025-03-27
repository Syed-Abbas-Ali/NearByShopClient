import React from "react";
import "./offerItemCard.scss";
import rightArrow from "../../assets/forwardIcon.svg";
import OfferCategoryItem from "../offerCategoryItem/OfferCategoryItem";

const OfferItemCard = ({ categoryWiseDiscounts }) => {
  return (
    <div className="offer-item-card-div">
      {categoryWiseDiscounts?.map((item, index) => {
        return (
          <div className="offer-item-div" key={index}>
            <div className="category-name">
              <h3>{item[0]}</h3>
              <img src={rightArrow} alt="right arrow" />
            </div>
            <div className="category-discount-cards">
              {item[1]?.map((item, index) => (
                <OfferCategoryItem key={index} discountItem={item}/>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OfferItemCard;
