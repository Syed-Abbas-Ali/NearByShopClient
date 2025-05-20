import React, { useEffect, useMemo, useState } from "react";
import chatIcon from "../../assets/chatColor1.svg";
import "./shopProfileView.scss";
import { useNavigate, useParams } from "react-router-dom";
import backImage from "../../assets/arrowLeftLarge.svg";
import {
  useAddReviewToShopMutation,
  useAddToFollowingMutation,
  useGetAllFollowingApiQuery,
  useGetAllProductsApiQuery,
  useGetFollowingNumberQuery,
  useGetShopProfileApiQuery,
} from "../../apis&state/apis/shopApiSlice";
import userMask from "../../assets/userMask.svg";
import toast from "react-hot-toast";
import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import Input from "../../components/input/Input";
import followerIcon from "../../assets/followerIcon.svg";
import Search from "../../components/search/Search";
import { useDispatch, useSelector } from "react-redux";
import Video from "../home/video/Video";
import youtubeIcon from "../../assets/youtubeIcon.svg";
import locationIcon from "../../assets/locationIcon.svg";
import BusinessDetailsVideo from "../../components/commonComponents/businessDetailsVideo/BusinessDetailsVideo";
import RatingPopup from "./ratingPopup/RatingPopup";
import { ShowRating } from "../../components/rating/Rating";
import phoneCallIcon from "../../assets/phoneCall2.svg";
import {
  useCheckRoomExistQuery,
  useCreateRoomMutation,
  useGetChatListQuery,
} from "../../apis&state/apis/chat";
import { useGetProfileApiQuery } from "../../apis&state/apis/authenticationApiSlice";
import SingleProduct from "../../components/singleProduct/SingleProduct";
import FilterInputComponent from "../../components/commonComponents/filterInputComponent/FilterInputComponent";
import Pagination from "../../components/pagination/Pagination";
import SearchComponent from "../../components/search/Search";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import CircularLoader from "../../components/circularLoader/CircularLoader";
import { setRoomChatAndActive } from "../../apis&state/state/chatState";

const ShopProfileView = () => {
  const dispatch = useDispatch();
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [addReviewText, setAddReviewText] = useState();
  const [isShowPopup, setIsShowPopup] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page, totalPages) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const {
    mapDetailsState: {
      userMapDetails: { latitude, longitude },
    },
  } = useSelector((state) => state);

  const { data: products, isLoading: isProductListLoading } =
    useGetAllProductsApiQuery({
      page: 1,
      shopId,
      keyword: search,
      pageNum: currentPage,
    });

  const [addReview] = useAddReviewToShopMutation();
  const [followSeller] = useAddToFollowingMutation();
  const { data: singleShopDetails, isLoading: loadingShopDetails } =
    useGetShopProfileApiQuery(shopId, {
      skip: !shopId,
    });
  const { data: followersData, isLoading: folowersoading } =
  useGetFollowingNumberQuery(shopId, {
      skip: !shopId,
    });
    console.log(followersData)
  const {
    data: roomExistData,
    isLoading: roomExistLoading,
    refetch,
  } = useCheckRoomExistQuery(shopId, {
    skip: !shopId,
  });

  const [createChatRoom] = useCreateRoomMutation();
  const { data: followingData } = useGetAllFollowingApiQuery();
  const {
    data: userProfileData,
    isLoading: isUserProfileDataLoading,
    isError: isUserProfileDataError,
  } = useGetProfileApiQuery();
  const { data: chatList } = useGetChatListQuery({
    currentUserType: "",
  });
  const isUserFollowing = useMemo(() => {
    if (followingData?.data) {
      return followingData.data.find((item) => item.shop_id == shopId);
    }
    return false;
  }, [followingData?.data]);

  const handleFollow = async () => {
    try {
      const response = await followSeller(
        singleShopDetails?.data?.shopDetails?.shop_id
      );
      if (!response?.data) {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  const handleNavigate = async (roomId) => {
    if (!singleShopDetails) {
      toast.error("Something went wrong!");
      return;
    }
    try {
      if (roomId) {
        dispatch(setRoomChatAndActive(roomId));
        navigate("/chat")
      } else {
        const roomDetails = {
          sellerId: singleShopDetails?.data?.shopDetails?.shop_owner_id,
          userName:
            userProfileData?.data?.firstName +
            " " +
            userProfileData?.data?.lastName,
          shopName: singleShopDetails?.data?.shopDetails?.shop_name,
          shopId: singleShopDetails?.data?.shopDetails?.shop_id,
        };
        const response = await createChatRoom(roomDetails);
        if (response?.data) {
          dispatch(setRoomChatAndActive(response?.data?.data?.roomId));
          refetch();
          toast.success("Chat created successfully!");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  function formatNumber(num) {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num?.toString();
  }
  return (
    <WrapperComponent>
      <div className="seller-profile-view">
        {isShowPopup && (
          <RatingPopup setIsShowPopup={setIsShowPopup} shopId={shopId} />
        )}
        <header>
          <button onClick={handleBack}>
            <img src={backImage} alt="" />
          </button>
          <h3>Seller Profile</h3>
        </header>
        <div className="content-card">
          {loadingShopDetails ? (
            <CircularLoader />
          ) : (
            <div className="profile-data-card">
              <div className="profile-pic-card">
                <img src={userMask} alt="" />
              </div>
              <div className="profile-details">
                <h1>
                  {singleShopDetails?.data?.shopDetails?.shop_name || "-----"}
                </h1>
                {/* <div className="ratings-card">
                  <div className="stars-card">
                    <ShowRating rating={singleShopDetails?.data?.rating ?? 0} />
                  </div>
                  <button onClick={() => setIsShowPopup(true)}>
                    Add Rating
                  </button>
                </div> */}
                <h3>
                  {singleShopDetails?.data?.shopDetails?.first_name}{" "}
                  {singleShopDetails?.data?.shopDetails?.last_name}
                </h3>
                <div className="phone-number-card">
                  <div
                    className="chat-card"
                    onClick={() => handleNavigate("/chat")}
                  >
                    <img src={phoneCallIcon} alt="" />
                    <a href={`tel:+91${singleShopDetails?.data?.shopDetails?.phone}`}>{singleShopDetails?.data?.shopDetails?.phone}</a>
                  </div>
                  {roomExistLoading ? (
                    <button>
                      <img src={chatIcon} />
                      <span>Loading...</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleNavigate(roomExistData?.data?.roomId)
                      }
                    >
                      <img src={chatIcon} />
                      <span>Chat</span>
                    </button>
                  )}
                </div>
                {/* <div className="follow-card">
                  <button
                    onClick={handleFollow}
                    className={`follow-btn ${
                      isUserFollowing ? "active-btn" : "in-active-btn"
                    }`}
                  >
                    {isUserFollowing ? "Following" : "Follow"}
                  </button>
                  <div className="count-card">
                    <img src={followerIcon} alt="" />
                    <p>
                      <span className="number">
                        {formatNumber(followersData?.data)}
                      </span>{" "}
                      <span className="text">(Followers)</span>
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          )}
          {/* <div className="video-section">
            <h3>About My Business</h3>
            <BusinessDetailsVideo />
            <div className="social-media-links">
              <p>
                <img src={youtubeIcon} alt="" />
                <span>14-1-140, Madhapur, Ayappa socity, Hyderabad.</span>
              </p>
              <p>
                <img src={youtubeIcon} alt="" /> <span>YouTube Channel</span>
              </p>
            </div>
          </div> */}
          <div className="all-products-card">
            <div>
              <SearchComponent setSearch={setSearch} />
            </div>
            <div className="products-card">
              <h3 className="products-header">Products</h3>
              {isProductListLoading && <CircularLoader />}

              <div className="grid-card">
                {products?.data?.items?.map((item, index) => {
                  return <SingleProduct product={item} key={index} />;
                })}
              </div>
            </div>
            {products?.data?.items?.length == 0 && (
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                no-data
              </div>
            )}
            {products?.data?.totalPages > 1 && (
              <Pagination
                totalPages={products?.data?.totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
        {/* <p>
        Name:{singleShopDetails?.data?.shopDetails?.first_name} -{" "}
        {singleShopDetails?.data?.shopDetails?.last_name}
      </p>
      <input type="text" onChange={handleInputChange} value={addReviewText} />
      <div>
        <button onClick={handleFollow}>Follow</button>
      </div> */}
        <BottomNavbar />
      </div>
    </WrapperComponent>
  );
};

export default ShopProfileView;
