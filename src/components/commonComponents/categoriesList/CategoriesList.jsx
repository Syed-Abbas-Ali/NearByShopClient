import React from "react";
import "./categoriesList.scss";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../../apis&state/apis/masterDataApis";
import { useNavigate } from "react-router-dom";

const CategoriesList = ({
  activeCategory = "",
  handleCategory,
  labelText = "Categories",
}) => {
  const { data } = useGetAllCategoriesAndSubCategoriesQuery();
  return (
    <div className="categories-list">
      <h3>{labelText}</h3>
      <div className="category-items">
        {data?.data?.map((category) => {
          return (
            <div
              className="single-category"
              onClick={() => handleCategory(category?.name)}
            >
              <div
                className="category-image"
                id={`${
                  activeCategory === category.name ? "active-category" : ""
                }`}
              >
                <img src={category.imageUrl} alt="" />
              </div>
              <p
                id={`${
                  activeCategory === category.name ? "active-category-name" : ""
                }`}
              >
                {category?.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesList;
