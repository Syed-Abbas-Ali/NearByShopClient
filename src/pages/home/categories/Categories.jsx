import React from "react";
import "./categories.scss";
import rightArrow from "../../../assets/forwardIcon.svg";

const categoriesList = [
  {
    icon: "",
    name: "Vegetables",
  },
  {
    icon: "",
    name: "Fruits",
  },
  {
    icon: "",
    name: "Grocery",
  },
  {
    icon: "",
    name: "Fashion",
  },
  {
    icon: "",
    name: "Mobiles",
  },
  {
    icon: "",
    name: "Clothes",
  },
  {
    icon: "",
    name: "Furniture",
  },
  {
    icon: "",
    name: "Vegetables",
  },
  {
    icon: "",
    name: "Fruits",
  },
  {
    icon: "",
    name: "Grocery",
  },
  {
    icon: "",
    name: "Fashion",
  },
  {
    icon: "",
    name: "Mobiles",
  },
  {
    icon: "",
    name: "Clothes",
  },
  {
    icon: "",
    name: "Furniture",
  },
  {
    icon: "",
    name: "Fashion",
  },
  {
    icon: "",
    name: "Mobiles",
  },
  {
    icon: "",
    name: "Clothes",
  },
  {
    icon: "",
    name: "Furniture",
  },
];

const Categories = ({ title = "Categories", handleCategory }) => {
  const handleClick = () => {
    handleCategory();
  };
  return (
    <div className="categories-card-div" style={{ padding: "0px" }}>
      <div className="header">
        <h3>{title}</h3>
        <img src={rightArrow} alt="arrow" />
      </div>
      <div className="categories-list-scroll">
        {categoriesList.map((item, index) => {
          return (
            <div
              className="single-category-card"
              key={index}
              onClick={handleClick}
            >
              <div className="default-card"></div>
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
