import { useDispatch } from "react-redux";
import "./notificationCard.scss";
import { setRoomChatAndActive } from "../../../../apis&state/state/chatState";

const MessageNotification = ({ item, index, handleLogin }) => {
  const dispatch = useDispatch();
  const handleProduct = async (id) => {
    console.log(id);
    dispatch(setRoomChatAndActive(id?.roomId));
    await handleLogin(id?._id);
  };

  function getFormattedDate(param) {
    const now = new Date(param);
    return now.toISOString().split("T")[0];
  }

  function getFormattedTime(param) {
    const now = new Date(param);
    return now.toTimeString().split(" ")[0];
  }

  return (
    <div
      className="single-notification"
      key={index}
      onClick={() => handleProduct(item)}
    >
      <div className="single-notification-data">
        {item?.notification?.shopName ? (
          <p className="product-name">{item?.notification?.shopName}</p>
        ) : (
          <p className="product-name">{item?.notification?.customerName}</p>
        )}
        <div className="bottom-card">
          <div className="product-details">
            <p className="final-price">
              {item?.notification?.message?.slice(0, 15) ?? "--"}
            </p>
            <div>
              <p>
                {getFormattedDate(item?.createdAt)}-
                {getFormattedTime(item?.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageNotification;
