import "./productSection.scss";
import { useGetAllProductsApiQuery } from "../../../apis&state/apis/shopApiSlice";
import forwardIcon from "../../../assets/forwardIcon.svg";
import SingleProduct from "../../../components/singleProduct/SingleProduct";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Pagination } from "antd";

const ProductSection = ({
  latitude,
  longitude,
  category,
  singleCategory,
  subCategory,
  searchData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { globalFilter } = useSelector((state) => state.globalState);

  const handlePageChange = (page, totalPages) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
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
      radius:parseInt(globalFilter?.radius)
    },
    { skip: shouldSkip }
  );

  useEffect(()=>{
console.log(latitude)
console.log(longitude)
  },[latitude])
  return (
    <div className="product-section">
      {isLoading && <p className="loader">Loading...</p>}
      {!data?.data?.items?.length && singleCategory && (
        <p className="loader">no data</p>
      )}
      {!data?.data?.items?.length && <p></p>}

      {data?.data?.items?.length > 0 && (
        <>
          <div className="category-heading">
            <h3>{category}</h3>
            {!singleCategory && (
              <img
                src={forwardIcon}
                alt="Forward"
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            )}
          </div>

          <div className="products-scroll">
            {data?.data?.items?.map((product) => (
              <SingleProduct product={product} key={product._id} />
            ))}
          </div>
        </>
      )}

      {singleCategory && data?.data?.totalPages > 1 && (
        <Pagination
          totalPages={data?.data?.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductSection;
