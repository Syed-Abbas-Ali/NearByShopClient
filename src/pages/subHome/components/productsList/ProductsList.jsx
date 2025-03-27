import React from "react";
import "./productsList.scss";
import StoresList from "../storesList/StoresList";
import SingleProduct from "../../../../components/singleProduct/SingleProduct";
import { useGetAllProductsApiQuery } from "../../../../apis&state/apis/shopApiSlice";

const ProductsList = () => {
  const { data, isLoading, isError } = useGetAllProductsApiQuery();
  return (
    <div className="products-list">
      <div className="products-list-card grid-card">
        {data &&
          [...data?.data?.items, ...data?.data?.items, ...data?.data?.items]?.map((product) => {
            return <SingleProduct product={product} key={product._id} />;
          })}
      </div>
    </div>
  );
};

export default ProductsList;
