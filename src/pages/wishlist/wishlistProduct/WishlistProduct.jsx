import "./wishlistProduct.scss";

// Assets
import locationImage from "../../../assets/locationPoint.svg";
import deleteIcon from "../../../assets/deleteIcon.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteWishlistProductMutation } from "../../../apis&state/apis/shopApiSlice";
import { getAddress } from "../../../utils/global";
import shareIcon from "../../../assets/shareNewIcon.svg";

import SharePopup from "../../../components/commonComponents/sharePopup/SharePopup";

const WishlistProduct = ({ product }) => {
  const navigate = useNavigate();
  const [isPopupShow, setIsPopupShow] = useState(null);
  const [deleteProductFromWishlist,{isLoading}] = useDeleteWishlistProductMutation();
  const [showSharePopup, setSharePopup] = useState(false);
  const handleDelete = (e) => {
    e.stopPropagation();
    setIsPopupShow((prev) => !prev);
  };

       const handleShare = (e) => {
    e.stopPropagation();
    setSharePopup((prev) => !prev);
  };

  const removeProductFromWishlist = async () => {
    try {
      const response = await deleteProductFromWishlist(product.item_uid);
      setIsPopupShow(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleActionButton = async (e, selectedAction) => {
    e.stopPropagation();
    if (selectedAction === "NO") {
      setIsPopupShow(null);
    } else if (selectedAction === "YES") {
      await removeProductFromWishlist();
    }
  };
  const handleProduct = () => {
    navigate(`/product-details/${product.item_uid}`);
  };
  const [address, setAddress] = useState("Fetching location...");

  useEffect(() => {
    async function fetchAddress() {
      const fetchedAddress = await getAddress(17.4343459, 78.3948765);
      setAddress(fetchedAddress);
    }
    fetchAddress();
  }, []); 
  return (
    <div className="wishlist-product" onClick={handleProduct}>
      {showSharePopup && <SharePopup setIsShare={setSharePopup} productId={product.item_uid}  />}
      <div className="product-div">
        <div className="image-default-card">
          <img src={product?.image} className="product-image" />
        </div>
        <div className="product-details">
          <p className="product-name">{product?.title}</p>
          <div className="price-card">
            <h2 className="discount-price">₹{product?.price}</h2>
            <p className="actual-price">₹{product?.mainPrice}</p>
            <p className="offer-percentage">{product?.discountPercentage?.toFixed(0)}%off</p>
          </div>
          <div className="location-div">
            <img src={locationImage} alt="" />
            <p>{product?.shop_address}</p>
          </div>
        </div>
      </div>
      <div className="delete-card">
        {isPopupShow && (
          <div className="popup-div">
            <p>Are you sure you want to remove this product?</p>
            <div className="action-buttons-card">
              <button onClick={(e) => handleActionButton(e, "NO")}>
                CANCEL
              </button>
              <button onClick={(e) => handleActionButton(e, "YES")}>
               {isLoading?"loading...":" YES REMOVE"}
              </button>
            </div>
          </div>
        )}
        <img src={deleteIcon} alt="" onClick={(e) => handleDelete(e)} />

 <img src={shareIcon} onClick={handleShare}/>

      </div>
    </div>
  );
};

export default WishlistProduct;
