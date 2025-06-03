import React, { useState, useRef, useCallback,useEffect } from "react";
import "./profile.scss";
import profileEditIcon from "../../assets/editNewIcon.svg";
import shareIcon from "../../assets/shareNewIcon.svg";
import scannerImage from "../../assets/scannerIcon.svg";
import chatColor from "../../assets/chatColor1.svg";
import locationImage from "../../assets/sellerLocationIcon.svg";
import youtubeIcon from "../../assets/youtubeIcon.svg";
import SingleProduct from "../../components/singleProduct/SingleProduct";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import followerIcon from "../../assets/followerIconGrey.svg";
import { allProducts } from "../../utils/sampleData";
import { useNavigate } from "react-router-dom";
import ToggleYesNo from "../../components/toggleYesNo/ToggleYesNo";
import Search from "../../components/search/Search";
import OfferCategoryItem from "../../components/offerCategoryItem/OfferCategoryItem";
import forwardMoreIcon from "../../assets/forwardIcon.svg";
import Instagram from "../../assets/instagram.png"
import websiteIcon from "../../assets/websiteIcon.png"
import {
  useGetAllSellerProductsApiQuery,
  useGetAllShopsApiQuery,
} from "../../apis&state/apis/shopApiSlice";
import { useGetProfileApiQuery } from "../../apis&state/apis/authenticationApiSlice";
import { useLocation } from "react-router-dom";
import ProductDetailsPopup from "./productDetailsPopup/ProductDetailsPopup";
import SellerSingleProduct from "../../components/sellerSingleProduct/SellerSingleProduct";
import BusinessDetailsVideo from "../../components/commonComponents/businessDetailsVideo/BusinessDetailsVideo";
import userMask from "../../assets/userMask.svg";
import cameraIcon from "../../assets/cameraIcon.svg";
import { useGetAllDiscountsQuery } from "../../apis&state/apis/discounts";
import Loader from "../../components/loadingSkelton/LoadingSkelton";
import SharePopup  from "../../components/commonComponents/sharePopup/SharePopup"

const Profile = () => {
  const navigate = useNavigate();
  const [productDetailsPopup, setProductDetailsPopup] = useState(false);
  const { data: sellerAllShops } = useGetAllShopsApiQuery();
  const [productUid, setProductUid] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showSharePopup, setSharePopup] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const loaderRef = useRef(null);

  const location = useLocation();
  const shopDetails = sellerAllShops?.data[0];
  
  const { data: userDetails } = useGetProfileApiQuery();
  const { data: sellerAllProducts, isLoading, isFetching } = useGetAllSellerProductsApiQuery(
    { shopUid: shopDetails?.shop_uid, keyword: search, pageNum: page },
    {
      skip: !shopDetails?.shop_uid,
    }
  );

  const { data: allDiscounts } = useGetAllDiscountsQuery(
    {
      shopId: shopDetails?.shop_id,
    },
    {
      skip: !shopDetails?.shop_id,
    }
  );
    useEffect(() => {
    setPage(1);
    setLoadedProducts([]);
    setHasMore(true);
    setInitialLoadComplete(false);
  }, [shopDetails?.shop_uid, search]);

  // Infinite scroll logic
  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isFetching && initialLoadComplete) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching, initialLoadComplete]);

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

  // Reset page and hasMore when search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [search]);

  // Check if we've reached the end of products
 useEffect(() => {
  if (sellerAllProducts?.data?.list) {
    const newProducts = sellerAllProducts.data.list;

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
      page >= sellerAllProducts.data.totalPages ||
      sellerAllProducts.data.list.length === 0
    ) {
      setHasMore(false);
    }
  }
}, [sellerAllProducts, page]);


  const handleAddProduct = () => {
    navigate(`/product-edit/${shopDetails?.shop_uid}&add_product`);
  };
  const handleEdit = () => {
    navigate(`/seller-profile-edit/${shopDetails?.shop_uid}`);
  };
  const handleAddDiscount = () => {
    navigate("/offer");
  };

  const handleSingleProductClick = (uid) => {
    setProductUid(uid);
    setProductDetailsPopup((prev) => !prev);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setSharePopup((prev) => !prev);
  };

  const handleTakeSubscription = () => {
    navigate(`/seller-plan-purchase/${shopDetails?.shop_uid}`);
  };

  const handleTickVerification = () => {
    navigate(`/shop-verification/${shopDetails?.shop_uid}`);
  };

  const pathSegments = location.pathname.split('/'); 
  const sellerChartIcon = pathSegments[1] == "profile";

  return (
    <WrapperComponent>
      {productDetailsPopup && (
        <ProductDetailsPopup
          setProductDetailsPopup={setProductDetailsPopup}
          productUid={productUid}
          shopUid={shopDetails?.shop_uid}
        />
      )}
      {showSharePopup && <SharePopup setIsShare={setSharePopup} shopId={shopDetails?.shop_id}  />}
      <div className="profile">
          <div className="page-header">
          <h3>My Account</h3>
          <img src={profileEditIcon} alt="edit" onClick={handleEdit} />
        </div>
        <div className="seller-profile-video-data-card">
          <div className="profile-data-card">
            <div className="profile-image-card">
              <div className="profile-image">
                <img src={userDetails?.data?.profilePic} alt="" className="user-mask" />
              </div>
              <div className="user-details">
                <div className="scanner-card">
                  <h3>{shopDetails?.shop_name || "Mobile Traders"}</h3>
                  {/* <img src={scannerImage} alt="scanner" /> */}
                   <img src={shareIcon} alt="tick-icon" onClick={handleShare} />
                </div>

                <div>
                  <h4>
                    {userDetails?.data?.firstName || "---"}{" "}
                    {userDetails?.data?.lastName || "---"}
                  </h4>
                </div>
                <div className="number-card">
                  <p>91+ {userDetails?.data?.phone || "---"}</p>
                  {sellerChartIcon? "":<img src={chatColor} alt="chat" /> }
                  
                </div>
                {/* <div className="followers-card">
                  <div className="followers-count">
                    <img src={followerIcon} alt="" />
                    <div>
                      <p>20K</p> <p className="followers-text">(followers)</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="enable-public">
              <div className="left-card">
                {/* <div className="account-public-card">
                  <h3>Do you want your Account in Public? </h3>
                  <ToggleYesNo />
                </div> */}
                {/* <p>
                  (If you keep it in Public out of your contacts customer can
                  see your website)
                </p> */}
                {/* <button
                  onClick={handleTakeSubscription}
                  className="subscription-btn"
                >
                  Take Subscription
                </button> */}
                <button
                  onClick={handleTickVerification}
                  className="subscription-btn"
                >
                  Want trust on shop?
                </button>
              </div>
            </div>
          </div>
          <div className="video-links-card">
            {/* <div className="about-video">
              <h3>About my Business</h3>
              <div className="video-default-div">
                <BusinessDetailsVideo />
              </div>
            </div> */}
            <div className="links">
              {sellerAllShops?.data[0]?.shop_address && (
                <a href={`https://www.google.com/maps?q=${sellerAllShops?.data[0]?.store_location?.latitude},${sellerAllShops?.data[0]?.store_location?.longitude}`}
  target="_blank"
  rel="noopener noreferrer"
  className="location-link"
  onClick={(e) => e.stopPropagation()} >
                  <img src={locationImage} alt="location" />
                  <p>{sellerAllShops?.data[0]?.shop_address}.</p>
                </a>
              )}

               {sellerAllShops?.data[0]?.shop_contact?.xLink ?  <div>

                <a href={sellerAllShops?.data[0]?.shop_contact?.xLink}  onClick={(e) => e.stopPropagation()}   className="location-link">
               
                <img src={youtubeIcon} alt="youtube" />
                <p>Youtube Link</p>
                </a>
              </div> : " " }

               {sellerAllShops?.data[0]?.shop_contact?.instagramLink ?  <div>

                <a href={sellerAllShops?.data[0]?.shop_contact?.instagramLink}  onClick={(e) => e.stopPropagation()}   className="location-link">
               
                <img src={Instagram} alt="youtube" />
                <p>Instagram Link</p>
                </a>
              </div> : " " }

                {sellerAllShops?.data[0]?.shop_contact?.website ?  <div>

                <a href={sellerAllShops?.data[0]?.shop_contact?.website}  onClick={(e) => e.stopPropagation()}   className="location-link">
               
                <img src={websiteIcon} alt="website" />
                <p>My website</p>
                </a>
              </div> : " " }
              
             
            </div>
          </div>
        </div>
        <hr />
        <div className="discount-products-card">
          <div className="heading-card-arrow">
            <h3>Your discount products</h3>
            <img src={forwardMoreIcon} alt="" />
          </div>
          <div className="discount-products">
            {allDiscounts?.data?.map((item, index) => (
              <OfferCategoryItem
                key={index}
                discountItem={item}
                isSeller={true}
              />
            ))}
          </div>
        </div>
        <div className="search-div-in-profile">
          <Search setSearch={setSearch} />
        </div>
        
       <div className="all-products-container">
        <div className="products-header">
          <h3 className="products-heading">Products</h3>
          <div>
            <button onClick={handleAddProduct}>+Add Product</button>
            <button onClick={handleAddDiscount}>+Add Discount</button>
          </div>
        </div>
        <div className="all-products grid-card">
          {loadedProducts.map((item, index) => (
            <SellerSingleProduct
              product={item}
              key={`${item.product_uid}-${index}`} // More stable key
              handleSingleProductClick={handleSingleProductClick}
            />
          ))}
        </div>
        
        <div ref={loaderRef} className="loading-container">
          {isFetching && <Loader />}
          {!hasMore && loadedProducts.length > 0 && (
            <p className="end-message">You've reached the end of products</p>
          )}
        </div>
      </div>
      </div>
    </WrapperComponent>
  );
};

export default Profile;