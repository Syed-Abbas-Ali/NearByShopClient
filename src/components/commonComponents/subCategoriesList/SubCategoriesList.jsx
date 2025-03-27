import React, { useState } from "react";
import "./subCategoriesList.scss";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../../apis&state/apis/masterDataApis";
import { useNavigate } from "react-router-dom";

const SubCategoriesList = ({ categoryName = "" }) => {
  const navigate = useNavigate();
  const { data } = useGetAllCategoriesAndSubCategoriesQuery();
  const [subcategoryList, setSubcategoryList] = useState([]);
  useState(() => {
    if (data?.data) {
      const subcategoryItems = data?.data?.filter(
        (item) => item.name === categoryName
      );
      setSubcategoryList(subcategoryItems);
    }
  }, [data]);


  const handleCategory = (categoryName) => {
    navigate(`/sub-category-page/${categoryName}`);
  };

  return (
    <div className="categories-list">
      <h3>Sub Categories</h3>
      <div className="category-items">
        {subcategoryList?.length > 0 &&
          subcategoryList[0]?.subcategories?.map((category) => {
            return (
              <div
                className="single-category"
                onClick={() => handleCategory(category?.name)}
              >
                <div className="category-image">
                  <img src={category.imageUrl} alt="" />
                </div>
                <p>{category?.name}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SubCategoriesList;
