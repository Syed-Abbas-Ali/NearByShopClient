import React, { useEffect, useState } from "react";
import "./home.scss";
import Search from "../../components/search/Search";
import Video from "./video/Video";
import Categories from "./categories/Categories";
import SingleProduct from "../../components/singleProduct/SingleProduct";
import Filters from "../../components/filters/Filters";
import { useSelector } from "react-redux";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import forwardIcon from "../../assets/forwardIcon.svg";
import { allProducts, categories } from "../../utils/sampleData";
import UserLocationPointer from "../../components/userLocationPointer/UserLocationPointer";
import { useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import Loader from "../../components/commonComponents/loader/Loader";
import { useGetAllProductsApiQuery } from "../../apis&state/apis/shopApiSlice";
import AutoSlider from "../../components/autoSlider/AutoSlider";
import AllCategories from "../../components/commonComponents/allCategories/AllCategories";
import SearchComponent from "../../components/commonComponents/searchComponent/SearchComponent";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../apis&state/apis/masterDataApis";
import UserLocationDetails from "../../components/commonComponents/userLocationDetails/UserLocationDetails";
import CategoriesList from "../../components/commonComponents/categoriesList/CategoriesList";
import Navbar from "../../components/navbar1/Navbar";
import FilterInputComponent from "../../components/commonComponents/filterInputComponent/FilterInputComponent";
import AppBanner from "../../components/commonComponents/auth&VerificatonComponents/appBanner/AppBanner";
import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import ProductSection from "./productsSection/ProductSection";
import SubCategoriesList from "../../components/commonComponents/subCategoriesList/SubCategoriesList";

const Home = () => {
  const navigate = useNavigate();
  const { isFilterPopupOpen } = useSelector((state) => state.globalState);

  const {
    mapDetailsState: {
      userMapDetails: { latitude, longitude, locationAddress },
    },
  } = useSelector((state) => state);

  const [searchData, setSearchData] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedSubCtegories, setSelectedSubCategory] = useState(null);

  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth < 500);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth < 500);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

 


  const handleCategory = (categoryName) => {
    setSelectedCategories(categoryName);
    setSelectedSubCategory("");
  };

  return (
    <WrapperComponent>
      <div className="home-container">
        {/* dont remove this */}
        {/* <div className="hero-section">
          <AutoSlider />
        </div> */}

        <div className="search-filter">

        {
          isWideScreen && (
            <div className="location-searchbar">
            <UserLocationPointer/>
            </div>
    )
  }
          <FilterInputComponent
            handleChange={(value) => setSearchData(value)}
          />
          {isFilterPopupOpen && <Filters />}
     
  
        </div>
        <div className="categories-section">
          <CategoriesList
            handleCategory={handleCategory}
            setAllCategories={setAllCategories}
            activeCategory={selectedCategories?.name}
          />
          {selectedCategories && (
            <SubCategoriesList
              selectedCategories={selectedCategories?.subcategories}
              handleSelect={(pre) => setSelectedSubCategory(pre)}
              selected={selectedSubCtegories}
            />
          )}
        </div>

        <div className="all-products">
          {selectedCategories ? (
            <ProductSection
              latitude={latitude}
              longitude={longitude}
              category={selectedCategories?.name}
              singleCategory={true}
              subCategory={selectedSubCtegories?.name}
              searchData={searchData}
            />
          ) : (
            allCategories?.map((item) => {
              return (
                <ProductSection
                  latitude={latitude}
                  longitude={longitude}
                  category={selectedCategories?.name || item?.name}
                  singleCategory={selectedCategories ? true : false}
                  searchData={searchData}
                />
              );
            })
          )}
        </div>
      </div>
    </WrapperComponent>
  );
};

export default Home;
