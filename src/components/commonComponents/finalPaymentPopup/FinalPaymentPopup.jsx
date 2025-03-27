import React, { useEffect, useState } from "react";
import "./finalPaymentPopup.scss";
import cancelIcon from "../../../assets/cancelIconRed.svg";

const FinalPaymentPopup = ({ orderDetails, handleClearPopup }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const paymentWindow = (orderResponse) => {
    const options = {
      key: `rzp_test_LUysSnHSj3TuHN`,
      amount: orderResponse?.amount_due ?? orderResponse?.total_amount,
      currency: orderResponse?.currency ?? "INR",
      name: "Come Fly With Me",
      description: "Transaction",
      order_id: orderResponse?.id ?? orderResponse?.order_id,
      callback_url: "https://www.comeflywithme.co.in/payment-success",
      handler: async function (response) {
        try {
          toast.success("Payment successful!");
          setDetails({
            start_date: "",
            end_date: "",
            no_of_adults: "",
            no_of_children: "",
          });
        } catch (err) {
          toast.error("Payment verification failed!");
        } finally {
          setIsLoading(false);
        }
      },
      theme: {
        color: "#151515",
      },
    };
console.log(options)
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.target.id === "Parent") {
        handleClearPopup();
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="final-payment-popup" id="Parent">
      <div className="content-card">
        <div className="cancel-icon-card">
          <img src={cancelIcon} alt="" onClick={handleClearPopup} />
        </div>
        <div className="plan-details-card">Plan details</div>
        <div className="pay-now-btn">
          <button onClick={() => paymentWindow(orderDetails?.data)}>Pay Now</button>
        </div>
      </div>
    </div>
  );
};

export default FinalPaymentPopup;
