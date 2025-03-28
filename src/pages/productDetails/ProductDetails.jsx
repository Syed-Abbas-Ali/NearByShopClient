import React, { useState } from "react";
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
import SearchComponent from "../../components/search/Search";
import Pagination from "../../components/pagination/Pagination";

const ProductDetails = () => {
  const { productUid } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page, totalPages) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const { data, isLoading, isError } = useGetSingleProductApiQuery(productUid);
  const { data: shopDetails } = useGetShopProfileApiQuery(data?.data?.shopId, {
    skip: !data?.data?.shopId,
  });
  const { data: relatedProducts } = useGetAllProductsApiQuery(
    {
      page: 1,
      category: data?.data?.category,
      keyword: search,
      pageNum: currentPage,
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
              {/* <FilterInputComponent /> */}
              <SearchComponent setSearch={setSearch} />
            </div>
            <div className="all-products grid-card">
              {relatedProducts?.data?.items.map((item, index) => {
                return <SingleProduct product={item} key={index} />;
              })}
            </div>
            {relatedProducts?.data?.items?.length == 0 && (
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                no-data
              </div>
            )}

            {relatedProducts?.data?.totalPages > 1 && (
              <Pagination
                totalPages={relatedProducts?.data?.totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </WrapperComponent>
  );
};

export default ProductDetails;
