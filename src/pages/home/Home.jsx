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

const Home = () => {
  const navigate = useNavigate();
  const [isShowSearch, setIsShowSearch] = useState(false);
  const { isFilterPopupOpen } = useSelector((state) => state.globalState);

  const {
    mapDetailsState: {
      userMapDetails: { latitude, longitude, locationAddress },
    },
  } = useSelector((state) => state);

  const [categoryWiseProducts, setCategoryWiseProducts] = useState([]);

  const { data, isLoading, isError } = useGetAllProductsApiQuery(
    {
      latitude,
      longitude,
      maxPrice: 1000000,
      radius: 100000000,
      page: 1,
    },
    {
      skip: !latitude || !longitude,
    }
  );

  const { data: allCategoriesData } =
    useGetAllCategoriesAndSubCategoriesQuery();

  useEffect(() => {
    if (data?.data?.items?.length > 0) {
      const newProductsObject = {};
      data?.data?.items?.forEach((product) => {
        if (newProductsObject[product.category]) {
          newProductsObject[product.category].push(product);
        } else {
          newProductsObject[product.category] = [product];
        }
      });
      setCategoryWiseProducts(Object.entries(newProductsObject));
    }
  }, [data]);

  // const handleCategory = () => {
  //   navigate("/sub-home");
  // };

  const handleSearchShow = (value) => {
    if (value === "FOCUS") {
      setIsShowSearch(true);
    } else if (value === "CANCEL") {
      setIsShowSearch(false);
    }
  };

  const handleCategory = (categoryName) => {
    navigate(`/sub-category-page/${categoryName}`);
  };

  return (
    // <WrapperComponent>
    //   {isShowSearch && <SearchComponent handleSearchShow={handleSearchShow} />}
    //   <div className="home-page">
    //     {isFilterPopupOpen && <Filters />}
    //     <div className="search-card">
    //       <Search handleSearchShow={handleSearchShow} />
    //     </div>
    //     <UserLocationPointer />

    //     {/* <Video /> */}
    //     <AutoSlider />
    //     <CategoriesList handleCategory={handleCategory} />
    //     <div className="all-products">
    //       {categoryWiseProducts.map((categoryObj, index) => {
    //         return (
    //           <div className="each-category-container" key={index}>
    //             <div className="category-name-header-card">
    //               <h3>{categoryObj[0]}</h3>
    //               <img src={forwardIcon} alt="" />
    //             </div>
    //             <div className="products-scroll">
    //               {categoryObj[1]?.map((product) => {
    //                 return (
    //                   <SingleProduct product={product} key={product._id} />
    //                 );
    //               })}
    //             </div>
    //           </div>
    //         );
    //       })}
    //     </div>
    //     {/* <Loader /> */}
    //     {/* <Categories handleCategory={handleCategory}/>
    //     <div className="all-products">
    //       {categories.map((categoryObj, index) => {
    //         return (
    //           <div className="each-category-container" key={index}>
    //             <div className="category-name-header-card">
    //               <h3>{categoryObj.category}</h3>
    //               <img src={forwardIcon} alt="" />
    //             </div>
    //             <div className="products-scroll">
    //               {data?.data.map((product) => {
    //                 return <SingleProduct product={product} key={product._id}/>;
    //               })}
    //             </div>
    //           </div>
    //         );
    //       })}
    //     </div> */}
    //     {/* <AllCategories handleCategory={handleCategory} /> */}
    //     {/* <CategoriesList /> */}
    //     {/* <div className="all-products-list ">
    //       <h3 className="heading-of-products">
    //         Now you can buy products from Near By your favorite shops !
    //       </h3>
    //       <div className="grid-card">
    //         {data &&
    //           data?.data?.items?.map((product) => {
    //             return <SingleProduct product={product} key={product._id} />;
    //           })}
    //       </div>
    //     </div> */}
    //   </div>
    // </WrapperComponent>
    <>
      <Navbar />
      <div className="home-page">
        <div className="section-one">
          <FilterInputComponent />
          <UserLocationPointer />
        </div>
        <div className="section-two">
          <AutoSlider />
          <div className="products-category-section">
            <CategoriesList handleCategory={handleCategory} />
            <div className="all-products">
              {categoryWiseProducts.map((categoryObj, index) => {
                return (
                  <div className="each-category-container" key={index}>
                    <div className="category-name-header-card">
                      <h3>{categoryObj[0]}</h3>
                      <img src={forwardIcon} alt="" />
                    </div>
                    <div className="products-scroll">
                      {categoryObj[1]?.map((product) => {
                        return (
                          <SingleProduct product={product} key={product._id} />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </>
  );
};

export default Home;
