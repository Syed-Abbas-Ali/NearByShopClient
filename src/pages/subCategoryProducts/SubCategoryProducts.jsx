import React from "react";
import "./subCategoryProducts.scss";
import backIcon from "../../assets/arrowLeftLarge.svg";
import { useNavigate, useParams } from "react-router-dom";
import Search from "../../components/search/Search";
import Navbar from "../../components/navbar/Navbar";
import CategoriesList from "../../components/commonComponents/categoriesList/CategoriesList";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../apis&state/apis/masterDataApis";
import SubCategoriesList from "../../components/commonComponents/subCategoriesList/SubCategoriesList";
import SingleProduct from "../../components/singleProduct/SingleProduct";
import { useGetAllProductsApiQuery } from "../../apis&state/apis/shopApiSlice";
import { useSelector } from "react-redux";

const SubCategoryProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { data: allCategoriesData } =
    useGetAllCategoriesAndSubCategoriesQuery();

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

  const { data, isLoading, isError } = useGetAllProductsApiQuery(
    {
      latitude,
      longitude,
      maxPrice: 1000000,
      radius: 100000000,
      category: categoryName,
      page: 1,
    },
    {
      skip: !latitude || !longitude,
    }
  );

  const handleBack = () => {
    navigate(-1);
  };
  const handleCategory = (categoryName) => {
    // navigate(`/sub-category-page/${categoryName}`);
  };
  
  return (
    <div className="sub-category-products">
      <div className="category-products-content">
        <div className="search-back-icon">
          <img
            src={backIcon}
            alt=""
            className="back-icon"
            onClick={handleBack}
          />
          <Search />
        </div>
        <div className="content-card">
          <CategoriesList
            activeCategory={categoryName}
            handleCategory={handleCategory}
          />
          <SubCategoriesList categoryName={categoryName}/>
          <div className="products-card-container">
            <div className="grid-card">
              {data &&
                data?.data?.items?.map((product) => {
                  return <SingleProduct product={product} key={product._id} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryProducts;
