import "./notificationCard.scss";
import locationImage from "../../../assets/locationPoint.svg";
import ItemNotification from "./ItemNotification";
import MessageNotification from "./MessageNotification";

const NotificationCard = ({ index, item }) => {
  const handleProduct = () => {
    navigate("/product-details");
  };

  switch (item?.notificationType) {
    case "new-item":
      return <ItemNotification item={item} />;
      break;
    case "message":
      return <MessageNotification item={item} />;
      break;
  }
};

export default NotificationCard;
