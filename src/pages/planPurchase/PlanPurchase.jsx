import React, { useState } from "react";
import "./planPurchase.scss";
import recept from "../../assets/planPurchaseReport.svg";
import backIcon from "../../assets/arrowLeftLarge.svg";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSkelton from "../../components/loadingSkelton/LoadingSkelton";
import FinalPaymentPopup from "../../components/commonComponents/finalPaymentPopup/FinalPaymentPopup";
import { useCreatePlanOrderMutation } from "../../apis&state/apis/shopApiSlice";
import { useGetAllPackagesQuery } from "../../apis&state/apis/masterDataApis";

const plans = [
  {
    price: 250,
    cards: 19,
  },
  {
    price: 390,
    cards: 35,
  },
  {
    price: 550,
    cards: 50,
  },
  {
    price: 1050,
    cards: 100,
  },
  {
    price: 2250,
    cards: 250,
  },
  {
    price: 2500,
    cards: 200,
  },
];

const PlanPurchase = () => {
  const navigate = useNavigate();
  const shopDetails = useParams();
  const [createOrder] = useCreatePlanOrderMutation();
  const [isBuy, setIsBuy] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const { data: planPackages, isLoading, isError } = useGetAllPackagesQuery();
  const handleCreateOrder = async (packageUid) => {
    try {
      const response = await createOrder({
        data: {
          amount: 5000,
          currency: "INR",
          receipt: "receipt#1",
          paymentFor: "package",
          package_uid: packageUid,
        },
        shopUid: shopDetails?.shopUid,
      });
      if (response?.data) {
        setIsBuy(true);
        setOrderDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClearPopup = () => {
    setIsBuy((prev) => !prev);
  };
  return (
    <div className="plan-purchase">
      {isBuy && (
        <FinalPaymentPopup
          orderDetails={orderDetails}
          handleClearPopup={handleClearPopup}
        />
      )}
      <div className="header-card">
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} alt="" />
        </button>
        <h3>Select your plan</h3>
      </div>
      <div className="all-plans-container">
        {/* <LoadingSkelton /> */}
        <div className="all-plans">
          {planPackages?.data?.map((item, index) => (
            <div key={index} className="each-plan">
              <button className="popular-tag">Popular</button>
              <div className="left-card">
                <div className="recept-card">
                  <img src={recept} />
                  <div>
                    <h3>{item?.no_of_cards}</h3>
                    <p>Cards</p>
                  </div>
                </div>
                <h2>₹{item?.mainPrice}</h2>
              </div>
              <div className="right-card" onClick={()=>handleCreateOrder(item?.package_uid)}>
                Buy Now
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanPurchase;
