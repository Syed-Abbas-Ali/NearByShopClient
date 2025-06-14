import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddToFollowingMutation,
  useGetAllNearByShopsApiQuery,
} from "../../apis&state/apis/shopApiSlice";
import backIcon from "../../assets/arrowLeftLarge.svg";
import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import CategoriesList from "../../components/commonComponents/categoriesList/CategoriesList";
import FilterInputComponent from "../../components/commonComponents/filterInputComponent/FilterInputComponent";
import ShopCard from "../../components/shopCard/ShopCard";
import SubCategoriesList from "../../components/commonComponents/subCategoriesList/SubCategoriesList";
import "./shop.scss";
import Navbar from "../../components/navbar1/Navbar";

const Shop = () => {
  const { shopCategory } = useParams();
  const [followSeller] = useAddToFollowingMutation();
  const [allCategories, setAllCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchData, setSearchData] = useState("");

  const navigate = useNavigate();

  // const {
  //   mapDetailsState: {
  //     userMapDetails: { latitude, longitude },
  //   },
  // } = useSelector((state) => state);

  const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
  
    useEffect(() => {
      try {
        const storedLocation = sessionStorage.getItem('userLocation');
        if (storedLocation) {
          const userLocation = JSON.parse(storedLocation);
          setLatitude(userLocation?.coordinates?.latitude);
          setLongitude(userLocation?.coordinates?.longitude);
          console.log("Loaded from session:", userLocation);
        }
      } catch (error) {
        console.error("Failed to parse userLocation from sessionStorage", error);
      }
    }, []);

  // Set initial category from URL params
  useEffect(() => {
    if (shopCategory && allCategories) {
      const initialCategory = allCategories.find(cat => cat.name === shopCategory);
      if (initialCategory) {
        setSelectedCategories(initialCategory);
      }
    }
  }, [shopCategory, allCategories]);

  // API call
  const { data, isError, isLoading } = useGetAllNearByShopsApiQuery(
    {
      latitude,
      longitude,
      radius: 5000,
      category: selectedCategories?.name || shopCategory || "",
      subCategory: selectedSubCategory?.name || "",
      search: searchData,
    },
    {
      skip: !latitude || !longitude,
    }
  );

  const handleCategory = (category) => {
    setSelectedCategories(category);
    setSelectedSubCategory(null); // Reset subcategory when category changes
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
    <>
    <Navbar/>
      <div className="shop-container">
        <div className="search-back-icon">
          <img
            src={backIcon}
            alt="back"
            className="back-icon"
            onClick={handleBack}
          />
         <h3>Shops</h3>
        </div>

        <CategoriesList
          handleCategory={handleCategory}
          setAllCategories={setAllCategories}
          activeCategory={selectedCategories?.name || shopCategory}
        />

        {/* {selectedCategories && (
          <SubCategoriesList
            selectedCategories={selectedCategories.subcategories}
            handleSelect={setSelectedSubCategory}
            selected={selectedSubCategory}
          />
        )} */}

        <div className="near-shops">
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error loading shops</p>
          ) : data?.data?.list?.length ? (
            data.data.list.map((item, index) => (
              <ShopCard
                key={index}
                id={item}
                singleShop={item}
                handleFollow={handleFollow}
              />
            ))
          ) : (
            <p className="noShopsFound">No shops found</p>
          )}
        </div>
      </div>
      <BottomNavbar />
    </>
  );
};

export default Shop;