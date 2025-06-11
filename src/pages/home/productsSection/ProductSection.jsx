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
   scrollMode
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productList, setProductList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const scrollRef = useRef(null);
  const loadingRef = useRef(false);
  const observer = useRef();

  console.log(5,scrollMode)

  const { globalFilter } = useSelector((state) => state.globalState);
  const shouldSkip = !latitude || !longitude;

  const { data, isLoading } = useGetAllProductsApiQuery(
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

  // Reset products when filters change
  useEffect(() => {
    setCurrentPage(1);
    setProductList([]);
    setHasMore(true);
    setShowEndMessage(false);
    loadingRef.current = false;
  }, [latitude, longitude, globalFilter, searchData, category, subCategory]);

  // Update product list when new data is fetched
 useEffect(() => {
  if (data?.data) {
    const { items, currentPage: apiPage, totalPages } = data.data;
    
    // Reset if it's the first page
    if (apiPage === 1) {
      setProductList(items);
    } 
    // Append if it's subsequent pages
    else if (apiPage === currentPage) {
      setProductList(prev => [...prev, ...items]);
    }
    
    setHasMore(apiPage < totalPages);
    setShowEndMessage(apiPage >= totalPages && apiPage > 1);
    loadingRef.current = false;
  }
}, [data, currentPage]);

  // Handle horizontal scroll with Intersection Observer
const lastProductRef = useCallback(
  (node) => {
    if (isLoading || loadingRef.current || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          loadingRef.current = true;
          setCurrentPage((prev) => prev + 1);
        }
      },
      {
        root: scrollRef.current,
        threshold: 0.1,
        rootMargin: "50px"
      }
    );

    if (node && hasMore) {
      observer.current.observe(node);
    } else if (observer.current) {
      observer.current.disconnect();
    }
  },
  [isLoading, hasMore]
);

  return (
    <div style={{ display: productList.length > 0 ? "block" : "none" }}>
      <div className="product-section">
        {isLoading && currentPage === 1 && <p className="loader">Loading...</p>}
        {!productList.length && singleCategory && (
          <p className="loader">No products found</p>
        )}

        {productList.length > 0 && (
          <>
            <div className="category-heading">
              <h3>{scrollMode == "horizontal" ? category : subCategory}</h3>
              {!singleCategory && <img src={forwardIcon} alt="Forward" />}
            </div>

            <div className={scrollMode == "horizontal" ? "horizontal-scroll" : "vertical-scroll"} ref={scrollRef}>
              {productList.map((product, index) => {
                if (productList.length === index + 1) {
                  return (
                    <div ref={lastProductRef} key={product._uid}>
                      <SingleProduct product={product}  scrollingMode={scrollMode}/>
                    </div>
                  );
                }
                return <SingleProduct product={product} key={product._uid} />;
              })}
              
              {isLoading && currentPage > 1 && (
                <p className="loader">Loading more products...</p>
              )}
              
              {showEndMessage && (
                <div className="end-message">
                  <p>You've reached the end of products</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductSection;