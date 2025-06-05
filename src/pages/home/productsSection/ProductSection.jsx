import "./productSection.scss";
import { useGetAllProductsApiQuery } from "../../../apis&state/apis/shopApiSlice";
import forwardIcon from "../../../assets/forwardIcon.svg";
import SingleProduct from "../../../components/singleProduct/SingleProduct";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";

const ProductSection = ({
  latitude,
  longitude,
  category,
  singleCategory,
  subCategory,
  searchData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productList, setProductList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef(null);
  const observer = useRef();
  const loadingRef = useRef(false);

  const { globalFilter } = useSelector((state) => state.globalState);
  const shouldSkip = !latitude || !longitude;

  const { data, isLoading, isError } = useGetAllProductsApiQuery(
    {
      ...globalFilter,
      latitude,
      longitude,
      pageNum: currentPage,
      keyword: searchData,
      category,
      subCategory,
      radius: parseInt(globalFilter?.radius),
    },
    { skip: shouldSkip }
  );

  // Reset state when filters change
  useEffect(() => {
    setCurrentPage(1);
    setProductList([]);
    setHasMore(true);
  }, [latitude, longitude, globalFilter, searchData, category, subCategory]);

  // Update product list when new data is fetched
  useEffect(() => {
    if (data?.data?.items) {
      if (currentPage === 1) {
        setProductList(data.data.items);
      } else {
        setProductList((prev) => [...prev, ...data.data.items]);
      }
      setHasMore(currentPage < data.data.totalPages);
    }
    loadingRef.current = false;
  }, [data, currentPage]);

  // Handle infinite scroll using Intersection Observer
  const lastProductRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
            loadingRef.current = true;
            setCurrentPage((prev) => prev + 1);
          }
        },
        { threshold: 0.1, root: scrollRef.current }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <div style={{ display: productList.length > 0 ? "block" : "none" }}>
      <div className="product-section">
        {isLoading && currentPage === 1 && <p className="loader">Loading...</p>}
        {!productList.length && singleCategory && (
          <p className="loader">No data</p>
        )}

        {productList.length > 0 && (
          <>
            <div className="category-heading">
              <h3>{category}</h3>
              {!singleCategory && <img src={forwardIcon} alt="Forward" />}
            </div>

            <div className="products-scroll" ref={scrollRef}>
              {productList.map((product, index) => {
                if (productList.length === index + 1) {
                  return (
                    <div ref={lastProductRef} key={product._id}>
                      <SingleProduct product={product} />
                    </div>
                  );
                }
                return <SingleProduct product={product} key={product._id} />;
              })}
              {isLoading && currentPage > 1 && (
                <p className="loader">Loading more...</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductSection;