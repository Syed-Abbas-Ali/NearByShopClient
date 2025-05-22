import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddToFollowingMutation,
  useGetAllFollowingApiQuery,
  useGetAllNearByShopsApiQuery,
} from "../../apis&state/apis/shopApiSlice";
import backIcon from "../../assets/arrowLeftLarge.svg";
import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import CategoriesList from "../../components/commonComponents/categoriesList/CategoriesList";
import FilterInputComponent from "../../components/commonComponents/filterInputComponent/FilterInputComponent";
import ShopCard from "../../components/shopCard/ShopCard";
import "./shop.scss";

const Shop = () => {
  const { shopCategory } = useParams();
  const [followSeller] = useAddToFollowingMutation();
  // const { data: followingData } = useGetAllFollowingApiQuery();
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
    navigate(`/shop/${categoryName?.name}`);
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
          <FilterInputComponent />
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
