import React from "react";
import "./shop.scss";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import AllCategories from "../../components/commonComponents/allCategories/AllCategories";
import ShopCard from "../../components/shopCard/ShopCard";
import shopImag from "../../assets/groceries1.svg";
import backIcon from "../../assets/arrowLeftLarge.svg";
import { useSelector } from "react-redux";
import {
  useAddToFollowingMutation,
  useGetAllFollowingApiQuery,
  useGetAllNearByShopsApiQuery,
} from "../../apis&state/apis/shopApiSlice";
import CategoriesList from "../../components/commonComponents/categoriesList/CategoriesList";
import Search from "../../components/search/Search";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar1/Navbar";
import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import FilterInputComponent from "../../components/commonComponents/filterInputComponent/FilterInputComponent";

const Shop = () => {
  const { shopCategory } = useParams();
  const [followSeller] = useAddToFollowingMutation();
  const { data: followingData } = useGetAllFollowingApiQuery();
  const navigate = useNavigate();
  const {
    mapDetailsState: {
      userMapDetails: { latitude, longitude },
    },
  } = useSelector((state) => state);
  const { data, isError, isLoading } = useGetAllNearByShopsApiQuery(
    {
      latitude,
      longitude,
      category: shopCategory,
    },
    {
      skip: !latitude || !longitude,
    }
  );
  console.log(data, 100);
  const handleCategory = (categoryName) => {
    navigate(`/shop/${categoryName}`);
  };
  const handleBack = () => {
    navigate(-1);
  };
  const handleFollow = async (shopUidValue) => {
    try {
      const response = await followSeller(shopUidValue);
      if (!response?.data) {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    // <WrapperComponent>
    //   <div className="shop-container">
    //     {/* <AllCategories /> */}
    //     <div className="search-back-icon">
    //       <img
    //         src={backIcon}
    //         alt=""
    //         className="back-icon"
    //         onClick={handleBack}
    //       />
    //       <Search />
    //     </div>
    //     <CategoriesList
    //       activeCategory={shopCategory}
    //       handleCategory={handleCategory}
    //     />
    //     <div className="near-shops">
    //       {data?.data?.list?.map((item, index) => (
    //         <ShopCard
    //           id={item}
    //           singleShop={item}
    //           key={index}
    //           handleFollow={handleFollow}
    //         />
    //       ))}
    //     </div>
    //   </div>
    // </WrapperComponent>
    <>
      <div className="shop-container">
        <div className="search-back-icon">
          <img
            src={backIcon}
            alt=""
            className="back-icon"
            onClick={handleBack}
          />
         <FilterInputComponent/>
        </div>
        <CategoriesList
          activeCategory={shopCategory}
          handleCategory={handleCategory}
        />
        <div className="near-shops">
          {data?.data?.list?.map((item, index) => (
            <ShopCard
              id={item}
              singleShop={item}
              key={index}
              handleFollow={handleFollow}
            />
          ))}
        </div>
      </div>
      <BottomNavbar />
    </>
  );
};

export default Shop;
