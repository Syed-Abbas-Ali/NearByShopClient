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

  const {
    data: roomExistData,
    isLoading: roomExistLoading,
    refetch,
  } = useCheckRoomExistQuery(shopIdValue, {
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
      console.log(roomId);
      if (roomId) {
        dispatch(setRoomChatAndActive(roomId));
        navigate("/chat");
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
          refetch();
          navigate("/chat");
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

  return (
    <>
      {showSharePopup && <SharePopup setIsShare={setShowSharePopup} />}
      <div className="single-product-details-mobile">
        <div className="product-images-container">
          <div className="product-image-card">
            {/* <img src={singleProductDetails?.image} alt="" /> */}
            {previewImagesList && (
              <ImagesPreviewSwiper previewImagesList={previewImagesList} />
            )}
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
          <div className="sub-images-card">
            {singleProductDetails?.previweImages?.length <= 0
              ? [1, 2, 3, 4].map((item, index) => {
                  return <div className="image-card" key={index}></div>;
                })
              : singleProductDetails?.previweImages.map((item, index) => {
                  return (
                    <div className="image-card" key={index}>
                      <img src={item.fileUrl} alt="Product preview" />
                    </div>
                  );
                })}
          </div>
        </div>
        <div className="show-product-details-card">
          <div className="div-one">
            <h3 className="offer-price">
              ₹{singleProductDetails?.price || 950}/-
            </h3>
            <p className="real-price">
              ₹{singleProductDetails?.mainPrice || 1000}/-
            </p>
            <p className="offer-percentage">
              {singleProductDetails?.discountPercentage}% off
            </p>
          </div>
          <div className="div-two">
            <h4>{singleProductDetails?.title || "Summer Caps"}</h4>
            <p>
              {singleProductDetails?.description ||
                "It seems like there's a syntax issue in your CSS background-image definition."}
            </p>
            {/* <div className="colors-div">
            <p>Available Colors</p>
            <ul>
              {["#FF5050", "#7B76FF", "#00C8FF", "#000000", "#F2F2F2"].map(
                (item, index) => (
                  <li key={index} style={{ background: item }}></li>
                )
              )}
            </ul>
          </div> */}
            <div className="extra-details">
              <button onClick={handleShopProfile}>
                <img src={userProfile} />
                <span>Seller Profile</span>
              </button>
              {/* <button onClick={() => dispatch(setRoomChatAndActive())}> */}
              <button
                onClick={() => handleNavigate(roomExistData?.data?.roomId)}
              >
                <img src={chatIcon} />
                <span>Chat</span>
              </button>
            </div>
            <div className="button-card">
              <button>
                <img src={callerIcon} alt="caller" />
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="single-product-details-desktop">
        <div className="images-div">
          {/* <div className="product-images-container"> */}
          <div className="product-image-card">
            <img src={singleProductDetails?.image} alt="" />
            <div className="action-btns">
              <div>
                <img src={checkIcon} alt="tick-icon" />
              </div>
              <div>
                <img src={heartIcon} alt="tick-icon" onClick={handleWishlist} />
              </div>
              <div>
                <img src={shareIcon} alt="tick-icon" onClick={handleShare} />
              </div>
            </div>
          </div>
          <div className="sub-images-card">
            {singleProductDetails?.previweImages?.length <= 0
              ? [1, 2, 3, 4].map((item, index) => {
                  return <div className="image-card" key={index}></div>;
                })
              : singleProductDetails?.previweImages.map((item, index) => {
                  return (
                    <div className="image-card" key={index}>
                      <img src={item.fileUrl} alt="Product preview" />
                    </div>
                  );
                })}
          </div>
          {/* </div> */}
        </div>
        <div className="content-div">
          <div className="text-content">
            <div className="section-one">
              <h1>{singleProductDetails?.title}</h1>
              <p className="product-description">
                {singleProductDetails?.description}
              </p>
            </div>
            <h2>
              From ₹<span>{singleProductDetails?.mainPrice}</span>
            </h2>
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
