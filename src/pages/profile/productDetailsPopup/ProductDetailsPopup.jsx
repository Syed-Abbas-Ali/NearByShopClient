import React, { useState } from "react";
import "./productDetailsPopup.scss";
import cancelIcon from "../../../assets/cancelNewIcon.svg";
import YesNoPopup from "../../../components/commonComponents/yesNoPopup/YesNoPopup";
import { useNavigate } from "react-router-dom";
import {
  useDeleteSellerProductMutation,
  useGetSingleProductApiQuery,
} from "../../../apis&state/apis/shopApiSlice";

const ProductDetailsPopup = ({
  setProductDetailsPopup,
  shopUid,
  productUid,
}) => {
  const [yesNoPopup, setYesNoPopup] = useState(false);
  const { data } = useGetSingleProductApiQuery(productUid);
  const [deleteProduct] = useDeleteSellerProductMutation();
  const navigate = useNavigate();
  const handleYesNoPopup = async (value) => {
    if (value === "YES") {
      try {
        const response = await deleteProduct({ shopUid, productUid });
      } catch (error) {
        console.log(error);
      }
    }
    setYesNoPopup((prev) => !prev);
  };
  const handleProductEdit = () => {
    navigate(`/product-edit/${shopUid}&${productUid}`);
  };
  return (
    <div className="product-details-popup">
      {yesNoPopup && (
        <YesNoPopup
          message="Do you want to delete the product?"
          handleYesNoPopup={handleYesNoPopup}
        />
      )}
      <div className="product-content">
        <img
          src={cancelIcon}
          className="cancel-icon"
          onClick={() => setProductDetailsPopup((prev) => !prev)}
        />
        <div className="product-details-card">
          <div className="left-div">
            <div className="main-image">
              <img src={data?.data?.image} />
            </div>
            <div className="sub-images-card">
              {data?.data?.previweImages?.map((item, index) => (
                <div className="sub-image">
                  <img src={item.fileUrl} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="right-div">
            <div className="show-product-details-card">
              <div className="div-one">
                <h3 className="offer-price">₹{data?.data?.price}/-</h3>
                <p className="real-price">₹{data?.data?.mainPrice}/-</p>
                <p className="offer-percentage">
                  {data?.data?.discountPercentage}% off
                </p>
              </div>
              <div className="div-two">
                <h4>{data?.data?.title}</h4>
                <p>{data?.data?.description}</p>
                {/* <div className="colors-div">
                  <p>Available Colors</p>
                  <ul>
                    {[
                      "#FF5050",
                      "#7B76FF",
                      "#00C8FF",
                      "#000000",
                      "#F2F2F2",
                    ].map((item, index) => (
                      <li key={index} style={{ background: item }}></li>
                    ))}
                  </ul>
                </div> */}
                <div className="product-actions">
                  <button onClick={handleProductEdit}>Update Product</button>
                  <button onClick={handleYesNoPopup}>Remove Product</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPopup;
