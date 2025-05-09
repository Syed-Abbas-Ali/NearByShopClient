import React from "react";
import "./sellerSingleProduct.scss";
import locationIcon from "../../assets/locationIconYellow.svg";

const SellerSingleProduct = ({ product, handleSingleProductClick }) => {
  const handleSingleProduct = () => {
    handleSingleProductClick(product?.item_uid);
  };

  return (
    <div className="single-product" onClick={handleSingleProduct}>
      <div className="default-product">
        {product.image && <img src={product.image} className="product-image" />}
      </div>
      <div className="product-details">
        <h3>{product.title}</h3>
        <div className="prices-and-offers">
          <h2>₹{product.price}</h2>
          <p className="actual-price">₹{product.mainPrice}</p>
          <p className="offer-text">{product.discountPercentage.toFixed(2)} Off</p>
        </div>
        <div className="location">
          <img src={locationIcon} alt="location" />
          <p>{product.shop_address.slice(0,15)}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerSingleProduct;
