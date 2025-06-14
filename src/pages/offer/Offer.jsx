import React, { useEffect, useState } from "react";
import "./offer.scss";
import OfferItemCard from "../../components/offerItemCard/OfferItemCard";
import OfferHeader from "./offerHeader/OfferHeader";
import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import MyDiscounts from "./myDiscounts/MyDiscounts";
import cancelIconRed from "../../assets/cancelIconRed.svg";
import {
  useGetAllDiscountsQuery,
  useGetDiscountsQuery,
} from "../../apis&state/apis/discounts";
import { useGetAllShopsApiQuery } from "../../apis&state/apis/shopApiSlice";
import { userTypeValue } from "../../utils/authenticationToken";
import CategoriesList from "../../components/commonComponents/categoriesList/CategoriesList";
import { useDispatch, useSelector } from "react-redux";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import { setIsFilterPopupOpen } from "../../apis&state/state/globalStateName";
import SubCategoriesList from "../../components/commonComponents/subCategoriesList/SubCategoriesList";

const Offer = () => {
  const { isFilterPopupOpen } = useSelector((state) => state.globalState);
  const [showExistingDiscounts, setExistingRecords] = useState(false);
  const [allCategories, setAllCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedSubCategories, setSelectedSubCategory] = useState(null);
  const [discountPage, setDiscountPage] = useState(1);
  const [allDiscounts, setAllDiscounts] = useState([]);
  const [hasMoreDiscounts, setHasMoreDiscounts] = useState(true);
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState(null);


  const dispatch = useDispatch();

  // Fetch shop details if user is seller
  const { data: sellerDetails, isLoading: isLoadingShop } = useGetAllShopsApiQuery(undefined, {
    skip: userTypeValue() !== "SELLER"
  });

  const shopId = sellerDetails?.data?.[0]?.shop_id || null;
  const shopUid = sellerDetails?.data?.[0]?.shop_uid || null;

  // Fetch discounts with proper shopId dependency
  const {
    data: discountsResponse,
    isLoading: isLoadingDiscounts,
    isFetching: isFetchingDiscounts,
  } = useGetAllDiscountsQuery(
    { shopId, page: discountPage },
    { skip: !shopId }
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Update discounts when response changes
  useEffect(() => {
    if (discountsResponse?.data?.items) {
      if (discountPage === 1) {
        setAllDiscounts(discountsResponse.data.items);
      } else {
        setAllDiscounts(prev => [...prev, ...discountsResponse.data.items]);
      }
      setHasMoreDiscounts(discountsResponse.data.items.length === 10);
    }
  }, [discountsResponse, discountPage]);

  const openPopup = () => {
    dispatch(setIsFilterPopupOpen());
  };

  const handleExistingDiscounts = () => {
    setExistingRecords(prev => !prev);
  };

  const handleCategory = (categoryName) => {
    setSelectedCategories(categoryName);
    setSelectedSubCategory(null);
    setSelectedSubCategoryName(null);
  };

    const handleSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedSubCategoryName(subCategory?.name || null);
  };

  const fetchMoreDiscounts = () => {
    if (hasMoreDiscounts && !isFetchingDiscounts) {
      setDiscountPage(prev => prev + 1);
    }
  };

   const { data: discountsData, isLoading: loadingDiscounts } = useGetDiscountsQuery(
    {
      category: selectedCategories?.name || "",
      subcategory: selectedSubCategoryName || "", // Changed from subCategory to subcategory to match API
    },
    {
      skip: !selectedCategories?.name, // Only fetch when category is selected
    }
  );

  return (
    <WrapperComponent>
      <div className="offer-container">
        <OfferHeader
          buttonText={userTypeValue() === "SELLER" ? "Add Deals" : ""}
          shopUidValue={shopUid}
        />
        <div className="categories-card-container-div">
          {showExistingDiscounts && (
            <div className="all-discounts-cards-list-popup">
              <div className="cancel-icon-card">
                <img
                  src={cancelIconRed}
                  alt=""
                  onClick={handleExistingDiscounts}
                />
              </div>
              <div className="existing-discounts">
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
              </div>
            </div>
          )}
          
          {userTypeValue() === "SELLER" && (
            <MyDiscounts
              handleExistingDiscounts={handleExistingDiscounts}
              allDiscounts={allDiscounts}
              fetchMoreDiscounts={fetchMoreDiscounts}
              hasMore={hasMoreDiscounts}
              isLoading={isFetchingDiscounts}
            />
          )}
      
          <CategoriesList
            handleCategory={handleCategory}
            setAllCategories={setAllCategories}
            activeCategory={selectedCategories?.name}
          />
          
          {selectedCategories && (
          <SubCategoriesList
            selectedCategories={selectedCategories?.subcategories}
            handleSelect={handleSubCategory} // Updated handler
            selected={selectedSubCategories}
          />
        )}
      
     {!selectedCategories &&
          allCategories?.map((item, index) => (
            <OfferItemCard key={index} categoryList={item?.name} />
          ))}
          
        {selectedCategories && (
          <OfferItemCard
            categoryList={selectedCategories?.name}
            subcategory={selectedSubCategoryName} // Pass the name directly
          />
        )}
        </div>
        
        <BottomNavbar />
      </div>
    </WrapperComponent>
  );
};

export default Offer;