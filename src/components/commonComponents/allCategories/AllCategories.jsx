import React, { useState } from "react";
import "./allCategories.scss";

import vegetables1 from "../../../assets/vegetables1.svg";
import groceries1 from "../../../assets/groceries1.svg";
import fashion1 from "../../../assets/fashion1.svg";
import mobiles1 from "../../../assets/mobiles1.svg";
import furniture1 from "../../../assets/furniture1.svg";
import toys1 from "../../../assets/toys1.svg";

const categoriesList = [
  {
    icon: vegetables1,
    name: "Vegetables",
  },
  {
    icon: groceries1,
    name: "Grocery",
  },
  {
    icon: fashion1,
    name: "Fashion",
  },
  {
    icon: mobiles1,
    name: "Mobiles",
  },
  {
    icon: toys1,
    name: "Toys",
  },
  {
    icon: furniture1,
    name: "Furniture",
  },
  {
    icon: vegetables1,
    name: "Vegetables",
  },
  {
    icon: groceries1,
    name: "Grocery",
  },
  {
    icon: fashion1,
    name: "Fashion",
  },
  {
    icon: mobiles1,
    name: "Mobiles",
  },
  {
    icon: toys1,
    name: "Toys",
  },
  {
    icon: furniture1,
    name: "Furniture",
  },
];

const AllCategories = ({ handleCategory }) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const handleCategoryClick = () => {
    handleCategory();
  };
  const handleSeeMore = () => {
    setIsShowMore((prev) => !prev);
  };
  const allCategories = isShowMore
    ? categoriesList.slice(0, 12)
    : categoriesList.slice(0, 6);
  return (
    <div className="all-categories">
      <div className="see-more-card">
        <h3>Categories</h3>
        <button onClick={handleSeeMore}>
          See {isShowMore ? "less" : "more"}
        </button>
      </div>
      <div className="categories-list">
        {allCategories.map((item) => {
          return (
            <div className="single-category" onClick={handleCategoryClick}>
              <img src={item.icon} />
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllCategories;
