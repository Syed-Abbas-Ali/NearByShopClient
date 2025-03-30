import React from "react";
import "./wishlist.scss";
import Search from "../../components/search/Search";
import SingleProduct from "../../components/singleProduct/SingleProduct";
import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
import backIcon from "../../assets/arrowLeftLarge.svg";
import { useNavigate } from "react-router-dom";
import { allProducts } from "../../utils/sampleData";
import Navbar from "../../components/navbar/Navbar";
import WishlistProduct from "./wishlistProduct/WishlistProduct";
import { useGetWishlistProductApiQuery } from "../../apis&state/apis/shopApiSlice";
import NoDataFound from "../../components/noDataFound/NoDataFound";

const Wishlist = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetWishlistProductApiQuery();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <WrapperComponent>
      <div className="wish-list-heading-card">
        <img src={backIcon} alt="" onClick={handleBack} />
        <h3>
          My Wishlist ({data?.data?.length > 0 ? data?.data?.length : "---"})
        </h3>
      </div>
      <div className="wishlist">
        <div className="wishlist-card-container">
          <div className="products-list">
            {data?.data?.map((item, index) => {
              return (
                <WishlistProduct
                  product={item}
                  key={item.item_uid}
                  indexValue={index}
                />
              );
            })}
          </div>

          {!data?.data || data?.data?.length==0?"no-data":''}
        </div>
      </div>
    </WrapperComponent>
  );
};

export default Wishlist;
