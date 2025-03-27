import React from "react";
import "./productDetails.scss";
import Search from "../../components/search/Search";
import SingleProductDetails from "../../components/singleProductDetails/SingleProductDetails";
import SingleProduct from "../../components/singleProduct/SingleProduct";
import backIcon from "../../assets/arrowLeftLarge.svg";
import { useNavigate, useParams } from "react-router-dom";
import { allProducts } from "../../utils/sampleData";
import Categories from "../home/categories/Categories";
import {
  useGetAllProductsApiQuery,
  useGetShopProfileApiQuery,
  useGetSingleProductApiQuery,
} from "../../apis&state/apis/shopApiSlice";
import Navbar from "../../components/navbar1/Navbar";
import FilterInputComponent from "../../components/commonComponents/filterInputComponent/FilterInputComponent";
import TopSearchComponent from "../../components/commonComponents/topSearchComponent/TopSearchComponent";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";

const ProductDetails = () => {
  const { productUid } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetSingleProductApiQuery(productUid);
  const { data: shopDetails } = useGetShopProfileApiQuery(data?.data?.shopId, {
    skip: !data?.data?.shopId,
  });
  const { data: relatedProducts } = useGetAllProductsApiQuery(
    {
      page: 1,
      category: data?.data?.category,
    },
    {
      skip: !data?.data?.category,
    }
  );


  const handleBack = () => {
    navigate(-1);
  };

  return (
    
    <WrapperComponent>
    {/* <TopSearchComponent/> */}
      <div className="product-details-container">
        <div className="content-card">
          <div className="product-details-content">
            <SingleProductDetails
              singleProductDetails={data?.data}
              shopData={shopDetails}
              shopIdValue={data?.data?.shopId || null}
            />
            <div className="filter-card">
              <FilterInputComponent />
            </div>
            <div className="all-products grid-card">
              {relatedProducts?.data?.items.map((item, index) => {
                return <SingleProduct product={item} key={index} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </WrapperComponent>
  );
};

export default ProductDetails;
