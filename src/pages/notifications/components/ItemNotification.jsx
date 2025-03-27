import "./notificationCard.scss";
import locationImage from "../../../assets/locationPoint.svg";

const ItemNotification= ({ index, item }) => {
  const handleProduct = () => {
    navigate("/product-details");
  };

  return (
    <div className="single-notification" key={index} onClick={handleProduct}>
      <div className="product-image">
        <img src={item?.notification?.image} alt="" />
      </div>
      <div className="single-notification-data">
        <p className="product-name">{item?.notification?.title}</p>
        <div className="bottom-card">
          <div className="product-details">
            <p className="final-price">
              ₹{item?.notification?.price ?? "--"}/-
            </p>
            <div>
              <img src={locationImage} alt="" />
              <p>{item?.notification?.shop_address?.slice(0, 15) ?? "----"}</p>
            </div>
          </div>
          <div className="product-status">
            <p>Available</p>
            <div className="status-symbol-green"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemNotification;
