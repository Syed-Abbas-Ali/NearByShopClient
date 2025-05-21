import React, { useEffect, useState } from "react";
import "./singleProductDetails.scss";
import callerIcon from "../../assets/caller.svg";
import userProfile from "../../assets/userProfile2.svg";
import chatIcon from "../../assets/chatOne.svg";
import { useNavigate } from "react-router-dom";
import {
  useCheckRoomExistQuery,
  useCreateRoomMutation,
} from "../../apis&state/apis/chat";
import toast from "react-hot-toast";
import { useGetProfileApiQuery } from "../../apis&state/apis/authenticationApiSlice";
import checkIcon from "../../assets/checkV1.svg";
import shareIcon from "../../assets/shareV1.svg";
import heartIcon from "../../assets/heartV1.svg";
import wishlistActiveIcon from "../../assets/wishlistActiveIconV1.svg";
import {
  useAddToWishlistMutation,
  useDeleteWishlistProductMutation,
  useGetAllWishlistProductsIdsApiQuery,
} from "../../apis&state/apis/shopApiSlice";
import SharePopup from "../commonComponents/sharePopup/SharePopup";
import ImagesPreviewSwiper from "../commonComponents/imagesPreviewSwiper/ImagesPreviewSwiper";
import { useDispatch, useSelector } from "react-redux";
import { setRoomChatAndActive } from "../../apis&state/state/chatState";

const SingleProductDetails = ({
  singleProductDetails,
  shopData,
  shopIdValue,
}) => {
  const {
    data: userProfileData,
    isLoading: isUserProfileDataLoading,
    isError: isUserProfileDataError,
  } = useGetProfileApiQuery();
  const isAuthenticated = useSelector(
    (state) => state.authState.isAuthenticated
  );

  const { data: roomExistData, isLoading: roomExistLoading,refetch } =
    useCheckRoomExistQuery(shopIdValue, {
      skip: !shopIdValue,
    });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addToWishlist] = useAddToWishlistMutation();
  const [deleteToWishlist] = useDeleteWishlistProductMutation();
  const [previewImagesList, setPreviewImagesList] = useState([]);
  const [createChatRoom] = useCreateRoomMutation();
  const { data } = useGetAllWishlistProductsIdsApiQuery();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showMore, setShowMore] = useState(false);
  
 
  const isProductInWishlist = data?.data?.includes(
    singleProductDetails?.itemUid || undefined
  );
  useEffect(() => {
    if (singleProductDetails?.previweImages) {
      const newImagesList = [singleProductDetails?.image];
      singleProductDetails?.previweImages.forEach((item) => {
        newImagesList.push(item.fileUrl);
      });
      setPreviewImagesList(newImagesList);
    }
  }, [singleProductDetails]);

  const handleNavigate = async (roomId) => {
    if (!shopData) {
      toast.error("Something went wrong!");
      return;
    }
    try {
      if (roomId) {
        dispatch(setRoomChatAndActive(roomId));
      } else {
        const roomDetails = {
          sellerId: shopData?.data?.shopDetails?.shop_owner_id,
          userName:
            userProfileData?.data?.firstName +
            " " +
            userProfileData?.data?.lastName,
          shopName: shopData?.data?.shopDetails?.shop_name,
          shopId: shopData?.data?.shopDetails?.shop_id,
        };
        const response = await createChatRoom(roomDetails);
        if (response?.data) {
          dispatch(setRoomChatAndActive(response?.data?.data?.roomId));
          refetch()
          toast.success("Chat created successfully!");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleWishlist = async () => {
    try {
      if (!isAuthenticated) {
        navigate("/login");
      }
      const response = await addToWishlist(singleProductDetails.itemUid);
      if (response?.data) {
        toast.success("Successfully added to wishlist !");
      } else {
        toast.error("Something went wrong !");
      }
    } catch (error) {
      toast.error("Something went wrong !");
    }
  };

  const handleDeleteWishlistProduct = async () => {
    try {
      const response = await deleteToWishlist(singleProductDetails.itemUid);
      if (response?.data) {
        toast.success("Successfully removed from wishlist !");
      } else {
        toast.error("Something went wrong !");
      }
    } catch (error) {
      toast.error("Something went wrong !");
    }
  };

  const handleShopProfile = () => {
    navigate(`/shop-profile-view/${shopIdValue}`);
  };
  const handleShare = () => {
    setShowSharePopup((prev) => !prev);
  };
   const description = singleProductDetails?.description || "";
     const toggleShow = () => {
    setShowMore((prev) => !prev);
  };

  const shouldTruncate = description.length > 100;
  const displayedText = showMore ? description : description.slice(0, 100);

  return (
    <>
      {showSharePopup && <SharePopup setIsShare={setShowSharePopup} />}
   
      <div className="single-product-details-desktop">
        <div className="images-div">
  <div className="product-image-card">
    <img src={previewImagesList[0]} alt="Main product" />
    <div className="action-btns">
      <div>
        <img src={checkIcon} alt="tick-icon" />
      </div>
      <div>
        <img
          src={isProductInWishlist ? wishlistActiveIcon : heartIcon}
          alt="wishlist-icon"
          onClick={
            isProductInWishlist
              ? handleDeleteWishlistProduct
              : handleWishlist
          }
        />
      </div>
      <div>
        <img src={shareIcon} alt="share-icon" onClick={handleShare} />
      </div>
    </div>
  </div>

  <div className="sub-images-card">
    {previewImagesList.slice(1).map((imageUrl, index) => (
      <div
        className="image-card"
        key={index}
        onClick={() => {
          const updatedImages = [...previewImagesList];
          // Swap main image with clicked sub image
          [updatedImages[0], updatedImages[index + 1]] = [
            updatedImages[index + 1],
            updatedImages[0],
          ];
          setPreviewImagesList(updatedImages);
        }}
      >
        <img src={imageUrl} alt={`Sub preview ${index + 1}`} />
      </div>
    ))}
  </div>
</div>

        <div className="content-div">
          <div className="text-content">
            <div className="section-one">
              <h1>{singleProductDetails?.title}</h1>
             <p className="product-description">
      {displayedText}
      {shouldTruncate && (
        <>
          {!showMore && "... "}
          <span
            onClick={toggleShow}
            style={{ color: "blue", cursor: "pointer" }}
          >
            {showMore ? "Show Less" : "Show More"}
          </span>
        </>
      )}
    </p>
            </div>

            <div className="price-container">
              <span className="price">₹{singleProductDetails?.price.toFixed(0)}/-</span>
               <span className="main-price">₹{singleProductDetails?.mainPrice.toFixed(0)}/-</span>
                <span className="main-discount">{singleProductDetails?.discountPercentage?.toFixed(0)}%off</span>
            </div>
          </div>
          <div className="extra-details">
            <button>
              <img src={callerIcon} alt="caller" />
              Contact Seller
            </button>
            <button onClick={handleShopProfile}>
              <img src={userProfile} />
              <span>Seller Profile</span>
            </button>
            {roomExistLoading ? (
              <button>
                <img src={chatIcon} />
                <span>Loading...</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavigate(roomExistData?.data?.roomId)}
              >
                <img src={chatIcon} />
                <span>Chat</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProductDetails;
