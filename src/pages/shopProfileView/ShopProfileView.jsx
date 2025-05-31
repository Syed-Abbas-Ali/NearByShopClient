import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
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
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import CircularLoader from "../../components/circularLoader/CircularLoader";
import { setRoomChatAndActive } from "../../apis&state/state/chatState";
import shareIcon from "../../assets/shareNewIcon.svg";
import SharePopup from "../../components/commonComponents/sharePopup/SharePopup";
import Loader from "../../components/loadingSkelton/LoadingSkelton";

const ShopProfileView = () => {
  const dispatch = useDispatch();
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [addReviewText, setAddReviewText] = useState();
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [showSharePopup, setSharePopup] = useState(false);
  const [search, setSearch] = useState("");
  
  // Infinite scroll states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const loaderRef = useRef(null);

  const {
    mapDetailsState: {
      userMapDetails: { latitude, longitude },
    },
  } = useSelector((state) => state);

  const { data: products, isLoading: isProductListLoading, isFetching } =
    useGetAllProductsApiQuery({
      page: 1,
      shopId,
      keyword: search,
      pageNum: page,
    });

  // Reset states when shopId or search changes
  useEffect(() => {
    setPage(1);
    setLoadedProducts([]);
    setHasMore(true);
    setInitialLoadComplete(false);
  }, [shopId, search]);

  // Infinite scroll observer callback
  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isFetching && initialLoadComplete) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching, initialLoadComplete]);

  // Set up Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleObserver]);

  // Accumulate products and check if we've reached the end
  useEffect(() => {
    if (products?.data?.items) {
      const newProducts = products.data.items;

      setLoadedProducts(prev => {
        const existingUids = new Set(prev.map(p => p.item_uid));
        const filteredNew = newProducts.filter(p => !existingUids.has(p.item_uid));

        if (page === 1) {
          return filteredNew;
        } else {
          return [...prev, ...filteredNew];
        }
      });

      setInitialLoadComplete(true);

      if (
        page >= products.data.totalPages ||
        products.data.items.length === 0
      ) {
        setHasMore(false);
      }
    }
  }, [products, page]);

  // Rest of your existing functions remain the same...
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

  const handleShare = (e) => {
    e.stopPropagation();
    setSharePopup((prev) => !prev);
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
        {showSharePopup && <SharePopup setIsShare={setSharePopup} shopId={singleShopDetails?.data?.shopDetails?.shop_id} />}
        
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
                <img src={singleShopDetails?.data?.shopDetails?.profile_pic} alt="" />
              </div>
              <div className="profile-details">
                <div className="name-share">
                  <h1>
                    {singleShopDetails?.data?.shopDetails?.shop_name || "-----"}
                  </h1>
                  <img src={shareIcon} onClick={handleShare}/>
                </div>
                
                <div>
                  <h3>
                    {singleShopDetails?.data?.shopDetails?.first_name}{" "}
                    {singleShopDetails?.data?.shopDetails?.last_name}
                  </h3>
                </div>

                <div className="phone-number-card">
                  <div className="chat-card">
                    <img src={phoneCallIcon} alt="" />
                    <a href={`tel:+91${singleShopDetails?.data?.shopDetails?.phone}`}>
                      {singleShopDetails?.data?.shopDetails?.phone}
                    </a>
                  </div>
                  {roomExistLoading ? (
                    <button onClick={() => handleNavigate("/chat")}>
                      <img src={chatIcon} />
                      <span>Loading...</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavigate(roomExistData?.data?.roomId)}
                      className="chat-btn"
                    >
                      <span>Chat</span>
                    </button>
                  )}
                  <div><button onClick={handleShare} className="chat-btn">Share </button></div>
                </div>
              </div>
            </div>
          )}

          <div className="all-products-card">
            <div>
              <Search setSearch={setSearch} />
            </div>
            <div className="products-card">
              <h3 className="products-header">Products</h3>
              
              <div className="all-products">
                {loadedProducts.map((item, index) => (
                  <SingleProduct product={item} key={`${item.items_id}-${index}`} />
                ))}
              </div>
              
              <div ref={loaderRef} className="loading-container">
                {isFetching && <Loader />}
                {!hasMore && loadedProducts.length > 0 && (
                  <p className="end-message">You've reached the end of products</p>
                )}
              </div>
              
              {loadedProducts.length === 0 && !isFetching && (
                <div className="no-products-message">
                  No products found
                </div>
              )}
            </div>
          </div>
        </div>
        
        <BottomNavbar />
      </div>
    </WrapperComponent>
  );
};

export default ShopProfileView;