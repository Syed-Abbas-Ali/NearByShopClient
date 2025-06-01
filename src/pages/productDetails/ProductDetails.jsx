import React, { useState, useRef, useEffect, useCallback } from "react";
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
import CircularLoader from "../../components/circularLoader/CircularLoader";
import Filters from "../../components/filters/Filters";
import { useSelector } from "react-redux";
import Loader from "../../components/loadingSkelton/LoadingSkelton";

const ProductDetails = () => {
  const { productUid } = useParams();
  const navigate = useNavigate();
  const { isFilterPopupOpen } = useSelector((state) => state.globalState);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const loaderRef = useRef(null);

  const {
    data,
    isLoading: productLoading,
    isError,
  } = useGetSingleProductApiQuery(productUid);
  const { data: shopDetails } = useGetShopProfileApiQuery(data?.data?.shopId, {
    skip: !data?.data?.shopId,
  });
  
  const {
    mapDetailsState: {
      userMapDetails: { latitude, longitude, locationAddress },
    },
  } = useSelector((state) => state);

  const { data: relatedProducts, isLoading: isProductListLoading, isFetching } =
    useGetAllProductsApiQuery(
      {
        page: 1,
        category: data?.data?.category,
        keyword: search,
        pageNum: page,
        latitude,
        longitude,
      },
      {
        skip: !data?.data?.category,
      }
    );

  // Reset everything when search or category changes
  useEffect(() => {
    setPage(1);
    setLoadedProducts([]);
    setHasMore(true);
    setInitialLoadComplete(false);
  }, [search, data?.data?.category, latitude, longitude]);

  // Combine products when new data arrives
  useEffect(() => {
      if (relatedProducts?.data?.items) {
        const newProducts = relatedProducts.data.items;
  
        setLoadedProducts(prev => {
          const existingUids = new Set(prev.map(p => p.item_uid));
          const filteredNew = newProducts.filter(p => !existingUids.has(p.item_uid));
  
          if (page === 1) {
            return filteredNew;
          } else {
            return [...prev, ...filteredNew];
          }
        });
  
        setInitialLoadComplete(true);
  
        if (
          page >= relatedProducts.data.totalPages ||
          relatedProducts.data.items.length === 0
        ) {
          setHasMore(false);
        }
      }
    }, [relatedProducts, page]);


  // Infinite scroll observer
  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isFetching && initialLoadComplete) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching, initialLoadComplete]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleObserver]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <WrapperComponent>
      <div className="product-details-container">
        <div className="content-card">
          <div className="product-details-content">
            {productLoading ? (
              <CircularLoader />
            ) : (
              <SingleProductDetails
                singleProductDetails={data?.data}
                shopData={shopDetails}
                shopIdValue={data?.data?.shopId || null}
              />
            )}
            <div className="filter-card">
              <SearchComponent setSearch={setSearch} isFilter={true} />
            </div>
            
            {isProductListLoading && page === 1 && <CircularLoader />}
            
            <div className="all-products">
              {loadedProducts.map((item, index) => (
                <SingleProduct product={item} key={`${item.item_uid}-${index}`} />
              ))}
            </div>
            
            {loadedProducts.length === 0 && initialLoadComplete && (
              <div className="no-data-message">
                No products found
              </div>
            )}

            <div ref={loaderRef} className="loading-container">
              {isFetching && page > 1 && <Loader />}
              {!hasMore && loadedProducts.length > 0 && (
                <p className="end-message">You've reached the end of products</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </WrapperComponent>
  );
};

export default ProductDetails;