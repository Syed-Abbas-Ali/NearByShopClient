import React, { useEffect, useState } from "react";
import "./offerForm.scss";
import Selector from "../../../components/selector/Selector";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../../apis&state/apis/masterDataApis";

const OfferForm = ({
  handleCreateOrder,
  handleDates,
  handleCategoryDropdown,
  categoryData,
  offerUid,
  handleUpdateDiscount,
  datesObject,
  productDetail,
  handleOfferChange,
}) => {
  const { data: categories } = useGetAllCategoriesAndSubCategoriesQuery();

  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    if (categories?.data?.length > 0) {
      const allCategoriesList = categories?.data?.map((category) => ({
        value: category.categoryId,
        label: category.name,
      }));
      setCategoriesList(allCategoriesList);
    }
  }, [categories]);
  useEffect(() => {
    if (categoryData?.categoryId) {
      const subCategoryDataList = categories?.data?.find(
        (category) => category.categoryId === categoryData.categoryId
      );
      const allSubCategoriesList = subCategoryDataList?.subcategories?.map(
        (subCategory) => ({
          value: subCategory._id,
          label: subCategory.name,
        })
      );
      setSubCategories(allSubCategoriesList);
    }
  }, [categoryData]);
  const handleChangeDate = (e) => {
    handleDates(e);
  };
  const handleCategory = (data) => {
    handleCategoryDropdown({ ...data, name: "category" });
  };
  const handleSubCategory = (data) => {
    handleCategoryDropdown(data);
  };
  const handleDiscountPercentage = (e) => {
    handleOfferChange(e);
  };
  return (
    <div className="offer-form">
      <div className="main-labels-card">
        <p className="main-label-text">Date</p>
        <div className="dates-card">
          <div className="dates">
            <p>From</p>
            <input
              type="date"
              onChange={handleChangeDate}
              name="startDate"
              value={datesObject.startDate}
            />
          </div>
          <div className="dates">
            <p>To</p>
            <input
              type="date"
              onChange={handleChangeDate}
              name="endDate"
              value={datesObject.endDate}
            />
          </div>
        </div>
      </div>

      {offerUid !== "discountId" && (
        <div className="main-labels-card">
          <p className="main-label-text">Category</p>
          <Selector
            onSelectDropdown={handleCategory}
            dropdownList={categoriesList}
            placeholderText="Select Category"
          />
        </div>
      )}
      {offerUid !== "discountId" && (
        <div className="main-labels-card">
          <p className="main-label-text">Sub Category</p>
          <Selector
            onSelectDropdown={handleSubCategory}
            dropdownList={subCategories}
            placeholderText="Select Sub Category"
          />
        </div>
      )}
      <div className="main-labels-card">
        <p className="main-label-text">Discount Percentage</p>
        <input
          type="text"
          placeholder="Enter discount percentage"
          className="discount-input"
          onChange={handleDiscountPercentage}
          // value={productDetail?.offer || ""}
        />
      </div>
      <div className="final-amount">
        <p className="main-label">Amount</p>
        <div>
          <p className="total-price">
            Total Amount <span>₹120</span>
          </p>
          <p className="single-price">
            *Per day it will cost <span>₹40</span>
          </p>
        </div>
        {offerUid == "discountId" ? (
          <button className="proceed-btn" onClick={handleCreateOrder}>
            Proceed
          </button>
        ) : (
          <button className="proceed-btn" onClick={handleUpdateDiscount}>
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default OfferForm;
