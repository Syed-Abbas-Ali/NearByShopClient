import React, { useState } from "react";
import "./notifications.scss";
import notificationsIcon from "../../assets/notificationColor1.svg";
import backIcon from "../../assets/arrowLeftLarge.svg";
import { useNavigate } from "react-router-dom";
import TabsComponent from "../../components/commonComponents/tabsComponent/TabsComponent";
import { useGetNotificationListQuery } from "../../apis&state/apis/chat";
import NotificationCard from "./components/NotificationCard";

const Notifications = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("wishlist");

  const { data: notificationList } = useGetNotificationListQuery({
    notificationType:value,
  });

  
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="notifications-card">
      <div className="notification-header">
        <div className="back-icon-card">
          <img src={backIcon} alt="" onClick={handleBack} />
          <h3>Notifications</h3>
        </div>
        <img src={notificationsIcon} alt="notifications" />
      </div>
      <div className="tabs-in-notifications">
        <TabsComponent setValue={setValue} value={value} />
      </div>
      <div className="all-notifications">
        {notificationList?.data?.map((item, index) => {
          return <NotificationCard item={item} index={index}/>;
        })}
      </div>
    </div>
  );
};

export default Notifications;
