import React, { useState, useEffect } from "react";
import "./singleProduct.scss";
import locationIcon from "../../assets/productLocationPointerV1.svg";
import { useNavigate,useLocation } from "react-router-dom";
import {
  useAddToWishlistMutation,
  useDeleteWishlistProductMutation,
  useGetAllWishlistProductsIdsApiQuery,
} from "../../apis&state/apis/shopApiSlice";
import toast from "react-hot-toast";
import checkIcon from "../../assets/checkV1.svg";
import shareIcon from "../../assets/shareV1.svg";
import heartIcon from "../../assets/heartV1.svg";
import { getAddress } from "../../utils/global";
import SharePopup from "../commonComponents/sharePopup/SharePopup";
import wishlistActiveIcon from "../../assets/wishlistActiveIconV1.svg";
import { useSelector } from "react-redux";

const SingleProduct = ({ product }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state) => state.authState.isAuthenticated
  );

  const [addToWishlist] = useAddToWishlistMutation();
  const [deleteToWishlist] = useDeleteWishlistProductMutation();
  const { data } = useGetAllWishlistProductsIdsApiQuery();
  const [showSharePopup, setSharePopup] = useState(false);
  const [address, setAddress] = useState("Super Grocery, San Francisco");

    const location = useLocation();      

  useEffect(() => {
    const fetchAddress = async () => {
      if (product?.location) {
        const addr = await getAddress(
          product.location.coordinates[0],
          product.location.coordinates[1]
        );
        setAddress(addr);
      }
    };
    fetchAddress();
  }, [product]);
  const pathSegments = location.pathname.split('/'); 

   const styleHomecard = pathSegments[1]== false

   const styleCardTag= pathSegments[1] == "shop-profile-view"
const forTopscroll = pathSegments[1] === "product-details";
const forSellerShare= pathSegments[1] === "profile";

const handleNavigate = () => {
  if (forTopscroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  navigate(`/product-details/${product.item_uid}`);
};

  const handleWishlist = async (e) => {
    e.stopPropagation();
    try {
      if(!isAuthenticated){
        navigate("/login")
      }
      const response = await addToWishlist(product.item_uid);
      if (response?.data) {
        toast.success("Successfully added to wishlist !");
      } else {
        toast.error("Something went wrong !");
      }
    } catch (error) {
      toast.error("Something went wrong !");
    }
  };

  const handleDeleteWishlistProduct = async (e) => {
    e.stopPropagation();
    try {
      const response = await deleteToWishlist(product.item_uid);
      if (response?.data) {
        toast.success("Successfully removed from wishlist !");
      } else {
        toast.error("Something went wrong !");
      }
    } catch (error) {
      toast.error("Something went wrong !");
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setSharePopup((prev) => !prev);
  };

  const isProductInWishlist = data?.data?.includes(
    product?.item_uid || undefined
  );

 






  return (
    <div className={styleHomecard ? "homeSingle-product" : "single-product"} onClick={handleNavigate}>
      {showSharePopup && <SharePopup setIsShare={setSharePopup} productId={product.item_uid}  />}
      {/* <button className="trending-btn">Trending</button> */}
      <div className="product-distance"><p className="distance-div">
     {styleCardTag ? "" : `Radius ${ (product?.distance / 1000).toFixed(1) } km`}

        </p></div>
      <div className="default-product">
        {product.image && <img src={product.image} className="product-image" />}
        <div className="action-btns">
          <div>
            <img src={checkIcon} alt="tick-icon" />
          </div>
            <div>
              <img
                src={isProductInWishlist ? wishlistActiveIcon : heartIcon}
                alt="tick-icon"
                onClick={
                  isProductInWishlist
                    ? handleDeleteWishlistProduct
                    : handleWishlist
                }
              />
            </div>
          
          <div>
            <img src={shareIcon} alt="tick-icon" onClick={handleShare} />
          </div>
        </div>
      </div>
      <div className="product-details">
        <h3>{product.title}</h3>
        <div className="prices-and-offers">
          <h2>₹{product.price.toFixed(0)}</h2>
          <p className="actual-price">₹{product.mainPrice?.toFixed(0)}</p>
          {product?.discountPercentage?.toFixed(0)>5 ?
            <p className="offer-text">
            {product?.discountPercentage &&
              product?.discountPercentage?.toFixed(0)}
            %off
          </p> : ""
        }
        
        </div>
        <div className="location">
          <img src={locationIcon} alt="location" />
          <p>{product?.shop_address?.slice(0,20)+".."}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;