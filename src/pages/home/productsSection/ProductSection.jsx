import "./productSection.scss";
import { useGetAllProductsApiQuery } from "../../../apis&state/apis/shopApiSlice";
import forwardIcon from "../../../assets/forwardIcon.svg";
import SingleProduct from "../../../components/singleProduct/SingleProduct";
import { useSelector } from "react-redux";
import { useState } from "react";
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

  if (!latitude || !longitude) return null;

  const { globalFilter } = useSelector((state) => state?.globalState);

  const handlePageChange = (page, totalPages) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const { data, isLoading, isError } = useGetAllProductsApiQuery(
    {
      ...globalFilter,
      latitude,
      longitude,
      maxPrice: 1000000,
      radius: 100000000,
      page: currentPage,
      category,
      subCategory,
      keyword: searchData,
    },
    { skip: !latitude || !longitude }
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load products. Please try again.</p>;
  if (!data?.data?.items?.length && singleCategory) return <p>no data</p>;
  if (!data?.data?.items?.length) return <p></p>;

  return (
    <div className="product-section">
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
        {data.data.items.map((product) => (
          <SingleProduct product={product} key={product._id} />
        ))}
      </div>

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
