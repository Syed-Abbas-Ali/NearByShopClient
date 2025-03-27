import "./notificationCard.scss";
import ItemNotification from "./ItemNotification";
import MessageNotification from "./MessageNotification";

const NotificationCard = ({ index, item,handleLogin }) => {
  switch (item?.notificationType) {
    case "new-item":
      return <ItemNotification item={item} handleLogin={handleLogin} />;
      break;
    case "message":
      return <MessageNotification item={item} handleLogin={handleLogin}/>;
      break;
  }
};

export default NotificationCard;
