import React, { useState } from "react";
import "./subCategoriesList.scss";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../../apis&state/apis/masterDataApis";
import { useNavigate,useLocation } from "react-router-dom";


const SubCategoriesList = ({ categoryName , selectedCategories,handleSelect,selected }) => {
  const navigate = useNavigate();
  const { data } = useGetAllCategoriesAndSubCategoriesQuery();
  const [subcategoryList, setSubcategoryList] = useState([]);
  useState(() => {
    if (data?.data) {
      const subcategoryItems = data?.data?.filter(
        (item) => item.name === categoryName
      );
      setSubcategoryList(subcategoryItems);
    } else {
      setSubcategoryList([]);
    }
  }, [data]);

  const handleCategory = (categoryName) => {
    handleSelect(categoryName)
  };

  // console.log( )

  let selectedStyle={
    background:"#ffd9c0",
    color:"white"
  }
   const location = useLocation()
    const froStyle = location.pathname.split("/");
  return (
    <div className="categories-list" style={froStyle[1] ? {} : { margin: "16px 16px" }}>
      <h3>Sub Categories</h3>
      {selectedCategories ? (
        <div className="category-items">
          {selectedCategories?.length > 0 &&
            selectedCategories?.map((category) => {
              return (
                <div
                  className="single-category"
                  onClick={() => handleCategory(category)}
                  
                >
                  <div className="category-image" style={selected?.name==category?.name?{...selectedStyle}:{}}>
                    <img src={category.imageUrl} alt="" />
                  </div>
                  <p>{category?.name}</p>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="category-items">
          {subcategoryList?.length > 0 &&
            subcategoryList[0]?.subcategories?.map((category) => {
              return (
                <div
                  className="single-category"
                  onClick={() => handleCategory(category?.name)}
                >
                  <div className="category-image" >
                    <img src={category.imageUrl} alt="" />
                  </div>
                  <p>{category?.name}</p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default SubCategoriesList;