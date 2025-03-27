import { useState, useEffect } from "react";

let data = {
  amount: 5000,
  amount_due: 5000,
  amount_paid: 0,
  attempts: 0,
  created_at: 1737526877,
  currency: "INR",
  entity: "order",
  id: "order_PmO8HHHFU4qv1v",
  notes: [],
  offer_id: null,
  receipt: "receipt#1",
  status: "created",
};

function Payment() {
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

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return (
    <>
      <button onClick={() => paymentWindow(data)}>pay</button>
    </>
  );
}

export default Payment;
