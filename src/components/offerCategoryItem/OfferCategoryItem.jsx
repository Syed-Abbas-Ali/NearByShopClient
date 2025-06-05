import React from "react";
import "./offerCategoryItem.scss";

import deleteIcon from "../../assets/deleteBinIcon.png";
import editIcon from "../../assets/editNewIcon.svg";
import { useDeleteDiscountMutation, useGetDiscountsQuery } from "../../apis&state/apis/discounts";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userTypeValue } from "../../utils/authenticationToken";
import { useSelector } from "react-redux";

const defaultBackground =
  "linear-gradient(90deg, rgb(149,221,193) 0%, rgb(14,104,167) 100%)";
const defaultText = "#fff";

const OfferCategoryItem = ({ discountItem, isSeller = false }) => {
  const navigate = useNavigate();
  const [deleteDiscountItem] = useDeleteDiscountMutation();
  const handleDeleteDiscount = async (e) => {
    e.stopPropagation();
    const response = await deleteDiscountItem(discountItem._id);
    if (response.data) {
      toast.success("Discount item is deleted!");
    } else {
      toast.error("Something went wrong!");
    }
  };

  const handleEditDiscount = (e) => {
    e.stopPropagation();
    navigate(
      `/offer-edit/${"shopUid"}&${discountItem._id}/${discountItem.banner_uid}`
    );
  };
  const handleSellerProfile = (shopId) => {
    navigate(`/shop-profile-view/${shopId}`);
  };
  
  return (
    <div
      className="offer-content-card"
      onClick={() => handleSellerProfile(discountItem.shopId)}
      style={{ background: discountItem?.backgroundColor || defaultBackground }}
    >
      <div className="default-image">
        <img src={discountItem?.imageUrl} />
      </div>
      <div className="offer-details">
        {isSeller && (
          <div className="action-btns">
            <button className="delete-discount" onClick={handleEditDiscount}>
              <img src={editIcon} alt="" />
            </button>
            {/* <button className="delete-discount" onClick={handleDeleteDiscount}>
              <img src={deleteIcon} alt="" />
            </button> */}
          </div>
        )}
        <div className="shop-name-card">
          <h3
            className="shop-name"
            style={{ color: discountItem?.textColor || defaultText }}
          >
            {discountItem?.shop_name || "-----"}
          </h3>
          <p
            className="shop-address"
            style={{ color: discountItem?.textColor || defaultText }}
          >
            {discountItem?.shop_address?.slice(0, 20)}...
          </p>
           <h4 style={{ color: discountItem?.textColor || defaultText }}>
            {discountItem?.deal}
          </h4>
          <p style={{ color: discountItem?.textColor || defaultText }}>
            {discountItem?.offer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferCategoryItem;
