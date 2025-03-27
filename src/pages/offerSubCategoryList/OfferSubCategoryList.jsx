import React from "react";
import "./offerSubCategoryList.scss";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import OfferHeader from "../offer/offerHeader/OfferHeader";

const OfferSubCategoryList = () => {
  return (
    <WrapperComponent>
      <div className="offers-sub-category-list">
        <OfferHeader buttonText={"Add 1 more Discount"} />
      </div>
    </WrapperComponent>
  );
};

export default OfferSubCategoryList;
