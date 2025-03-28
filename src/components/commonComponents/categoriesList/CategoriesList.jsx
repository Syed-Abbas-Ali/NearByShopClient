import React, { useEffect } from "react";
import "./categoriesList.scss";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../../apis&state/apis/masterDataApis";
import { useNavigate } from "react-router-dom";

const CategoriesList = ({
  activeCategory = "",
  handleCategory,
  labelText = "Categories",
  setAllCategories,
}) => {
  const { data } = useGetAllCategoriesAndSubCategoriesQuery();

  useEffect(() => {
    if (data?.data) {
      setAllCategories(data?.data);
    }
  }, [data]);
  return (
    <div className="categories-list">
      <h3>{labelText}</h3>
      <div className="category-items">
        {data?.data?.map((category) => {
          return (
            <div
              className="single-category"
              onClick={() => handleCategory(category)}
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
