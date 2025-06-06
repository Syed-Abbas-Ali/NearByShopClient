import React, { useEffect, useState, useRef, useCallback } from "react";
import "./home.scss";
import { useSelector } from "react-redux";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import { useNavigate } from "react-router-dom";
import UserLocationPointer from "../../components/userLocationPointer/UserLocationPointer";
import CategoriesList from "../../components/commonComponents/categoriesList/CategoriesList";
import SubCategoriesList from "../../components/commonComponents/subCategoriesList/SubCategoriesList";
import ProductSection from "./productsSection/ProductSection";
import FilterInputComponent from "../../components/commonComponents/filterInputComponent/FilterInputComponent";
import Filters from "../../components/filters/Filters";

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
  const [selectedSubCategories, setSelectedSubCategories] = useState(null);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth < 500);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [scrollMode, setScrollMode] = useState('horizontal');
  const observer = useRef();
  const loadingRef = useRef(false);
  const [loadedCategoryIndex, setLoadedCategoryIndex] = useState(0);
  const categoriesPerLoad = 1;

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth < 500);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (allCategories) {
      setVisibleCategories(allCategories.slice(0, categoriesPerLoad));
      setLoadedCategoryIndex(categoriesPerLoad);
    }
  }, [allCategories]);

  const handleCategory = (categoryName) => {
    setSelectedCategories(categoryName);
    setSelectedSubCategories("");
    setScrollMode('horizontal');
  };

  const handleSubCategory = (subCategory) => {
    setSelectedSubCategories(subCategory);
    setScrollMode('vertical');
  };

  const lastCategoryRef = useCallback(
    (node) => {
      if (!allCategories || loadingRef.current || selectedCategories) return;
      
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && loadedCategoryIndex < allCategories.length) {
            loadingRef.current = true;
            setLoadingMore(true);
            
            setTimeout(() => {
              const nextIndex = loadedCategoryIndex + categoriesPerLoad;
              setVisibleCategories(prev => [
                ...prev,
                ...allCategories.slice(loadedCategoryIndex, nextIndex)
              ]);
              setLoadedCategoryIndex(nextIndex);
              loadingRef.current = false;
              setLoadingMore(false);
            }, 500);
          }
        },
        { threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [allCategories, loadedCategoryIndex, selectedCategories]
  );

  return (
    <WrapperComponent>
      <div className="home-container">
        <div className="search-filter">
          {isWideScreen && (
            <div className="location-searchbar">
              <UserLocationPointer/>
            </div>
          )}
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
              handleSelect={handleSubCategory}
              selected={selectedSubCategories}
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
              subCategory={selectedSubCategories?.name}
              searchData={searchData}
              scrollMode={scrollMode}
            />
          ) : (
            visibleCategories.map((item, index) => {
              const isLastCategory = index === visibleCategories.length - 1;
              return (
                <div 
                  ref={isLastCategory ? lastCategoryRef : null}
                  key={item._id || index}
                >
                  <ProductSection
                    latitude={latitude}
                    longitude={longitude}
                    category={item?.name}
                    singleCategory={false}
                    searchData={searchData}
                    scrollMode={scrollMode}
                  />
                </div>
              );
            })
          )}
          {loadingMore && (
            <div className="loading-more">
              <p>Loading more categories...</p>
            </div>
          )}
        </div>
      </div>
    </WrapperComponent>
  );
};

export default Home;