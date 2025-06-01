import { useState } from "react";
import "./sellerSingleProduct.scss";
import locationIcon from "../../assets/locationIconYellow.svg";
import shareIcon from "../../assets/shareV1.svg";
import SharePopup from "../commonComponents/sharePopup/SharePopup";

const SellerSingleProduct = ({ product, handleSingleProductClick }) => {
  const [showSharePopup, setSharePopup] = useState(false); // ✅ Move useState here

  const handleSingleProduct = () => {
    handleSingleProductClick(product?.item_uid);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setSharePopup((prev) => !prev);
  };

  return (
    <div className="single-product" onClick={handleSingleProduct}>
      {showSharePopup && (
        <SharePopup setIsShare={setSharePopup} productId={product.item_uid} />
      )}
      <div className="default-product">
        {product?.image && (
          <img src={product?.image} className="product-image" alt="Product" />
        )}
      </div>

      <div className="seller-shareIcon" onClick={handleShare}>
        <img src={shareIcon} alt="share-icon" className="share-icon" />
      </div>

      <div className="product-details">
        <h3>{product?.title}</h3>
        <div className="prices-and-offers">
          <h2>₹{product.our_price}</h2>
          <p className="actual-price">₹{product?.market_price?.toFixed(0)}</p>
          <p className="offer-text">
            {product?.discountPercentage?.toFixed(0)}%Off
          </p>
        </div>
        <div className="location">
          <img src={locationIcon} alt="location" />
          <p>{product.shop_address?.slice(0, 15)}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerSingleProduct;
