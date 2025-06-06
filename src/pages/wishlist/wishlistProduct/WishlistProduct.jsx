import React, { useState, useEffect } from "react";
import "./wishlistProduct.scss";
import locationImage from "../../../assets/locationPoint.svg";
import deleteIcon from "../../../assets/deleteIcon.svg";
import shareIcon from "../../../assets/shareNewIcon.svg";
import { useNavigate } from "react-router-dom";
import { useDeleteWishlistProductMutation } from "../../../apis&state/apis/shopApiSlice";
import SharePopup from "../../../components/commonComponents/sharePopup/SharePopup";

const WishlistProduct = ({ product }) => {
  const navigate = useNavigate();
  const [isPopupShow, setIsPopupShow] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [deleteProductFromWishlist, { isLoading }] = useDeleteWishlistProductMutation();

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsPopupShow(true);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowSharePopup(true);
  };

  const removeProductFromWishlist = async () => {
    try {
      await deleteProductFromWishlist(product.item_uid);
      setIsPopupShow(false);
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const handleActionButton = (e, action) => {
    e.stopPropagation();
    if (action === "YES") {
      removeProductFromWishlist();
    } else {
      setIsPopupShow(false);
    }
  };

  const handleProductClick = () => {
    navigate(`/product-details/${product.item_uid}`);
  };

  return (
    <div className="wishlist-product" onClick={handleProductClick}>
      {showSharePopup && (
        <SharePopup 
          setIsShare={setShowSharePopup} 
          productId={product.item_uid} 
        />
      )}

      <div className="product-image-container">
        <img 
          src={product?.image} 
          alt={product?.title} 
          className="product-image"
        />
        <div className="action-buttons">
          <button className="action-button" onClick={handleShare}>
            <img src={shareIcon} alt="Share" />
          </button>
          <button className="action-button" onClick={handleDelete}>
            <img src={deleteIcon} alt="Delete" />
          </button>
        </div>
      </div>

      <div className="product-details">
        <h3 className="product-title">
          {product?.title?.length > 20 
            ? `${product.title.slice(0,20)}...` 
            : product?.title}
        </h3>
        
        <div className="price-section">
          <span className="current-price">₹{product?.price}</span>
          {product?.mainPrice && (
            <span className="original-price">₹{product.mainPrice}</span>
          )}
          {product?.discountPercentage && (
            <span className="discount-badge">
              {product.discountPercentage.toFixed(0)}% OFF
            </span>
          )}
        </div>

        <div className="location-section">
          <img src={locationImage} alt="Location" />
          <span>{product?.shop_address || "Location not available"}</span>
        </div>
      </div>

      {isPopupShow && (
        <div className="confirmation-popup">
          <p>Remove this item from your wishlist?</p>
          <div className="popup-actions">
            <button 
              className="cancel-btn"
              onClick={(e) => handleActionButton(e, "NO")}
            >
              Cancel
            </button>
            <button 
              className="confirm-btn"
              onClick={(e) => handleActionButton(e, "YES")}
              disabled={isLoading}
            >
              {isLoading ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistProduct;