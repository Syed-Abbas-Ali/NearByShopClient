import React from "react";
import "./offerSubCategoryProducts.scss";
import OfferHeader from "../offerHeader/OfferHeader";
import Categories from "../../home/categories/Categories";
import OfferCategoryItem from "../../../components/offerCategoryItem/OfferCategoryItem";

const OfferSubCategoryProducts = () => {
  return (
    <div className="offer-sub-category-product">
      <OfferHeader />
      <div className="offer-sub-category-products-body">
        <Categories />
        <div className="all-discounts-list">
          <h3 className="sub-category-heading">Skin Care</h3>
          <div className="category-discount-cards">
            {[1, 2, 3, 4, 5, 6, 7,8,9,10,11].map((item, index) => (
              <OfferCategoryItem key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSubCategoryProducts;
