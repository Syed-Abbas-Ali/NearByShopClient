import React from "react";
import "./offersSubCategory.scss";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import OfferHeader from "../offer/offerHeader/OfferHeader";
import OfferItemCard from "../../components/offerItemCard/OfferItemCard";
import Categories from "../home/categories/Categories";
import { useNavigate, useParams } from "react-router-dom";
import CategoriesList from "../../components/commonComponents/categoriesList/CategoriesList";
import { useGetDiscountsQuery } from "../../apis&state/apis/discounts";
import { useSelector } from "react-redux";
import OfferCategoryItem from "../../components/offerCategoryItem/OfferCategoryItem";
import SubCategoriesList from "../../components/commonComponents/subCategoriesList/SubCategoriesList";

const OfferSubCategory = () => {
  const { categoryName } = useParams();
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
  const { data } = useGetDiscountsQuery(
    {
      latitude,
      longitude,
      minPrice: 1,
      maxPrice: 1000000,
      radius: 100000000,
      page: 1,
      categoryName,
      subCategory,
    },
    {
      skip: !latitude || !longitude,
    }
  );

  // const handleCategory = (categoryName) => {
  //   navigate(`/offer-sub-category/${categoryName}`);
  // };
  return (
    <div className="offers-sub-category">
      <OfferHeader buttonText={"Add 1 more Discount"} />
      <div className="categories-card-container-div">
        <div className="categories-card-div">
          <CategoriesList
            handleCategory={handleCategory}
            activeCategory={categoryName}
          />
          <SubCategoriesList
            handleCategory={handleCategory}
            labelText="Sub Categories"
            categoryName={categoryName}
          />
        </div>
        <div className="category-discount-cards">
          {data?.data?.map((item, index) => (
            <OfferCategoryItem key={index} discountItem={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferSubCategory;
