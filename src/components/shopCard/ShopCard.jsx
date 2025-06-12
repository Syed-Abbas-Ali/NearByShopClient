import React, { useState } from "react";
import "./shopCard.scss";
import validTick from "../../assets/validTick.svg";
import location from "../../assets/locationThick.svg";
import followersIcon from "../../assets/newUsers.svg";
import share from "../../assets/newShare.svg";
import chat from "../../assets/newChat.svg";
import shopImag from "../../assets/shopDefaultImage.jpg";
import call from "../../assets/newCall.svg";
import { useNavigate } from "react-router-dom";
import SharePopup from "../commonComponents/sharePopup/SharePopup";
import {
  useCreateRoomMutation,
  useGetChatListQuery,
} from "../../apis&state/apis/chat";
import { haversine } from "../../utils/global";
import { useSelector } from "react-redux";

const ShopCard = ({ id, singleShop, handleFollow }) => {
  const {
    mapDetailsState: {
      userMapDetails: { latitude, longitude },
    },
  } = useSelector((state) => state);
  const phoneNumber = "+918639215761";
  const navigate = useNavigate();
  const [isShare, setIsShare] = useState(false);
  const [shopUidValue, setShopUidValue] = useState(null);
  const [createChatRoom] = useCreateRoomMutation();
  const { data: chatList } = useGetChatListQuery({
    currentUserType: "",
  });
  const handleShop = () => {
    navigate(`/shop-profile-view/${singleShop?.shop_id}`);
  };
  const handleShare = (e, shopUid) => {
    e.stopPropagation();
    setIsShare((prev) => !prev);
  };
  const handleChat = async (e) => {
    e.stopPropagation();
    if (!singleShop) {
      toast.error("Something went wrong!");
      return;
    }
    const isCreateRoom = chatList?.data
      ? chatList?.data?.filter((item) => item.shopName === singleShop?.shop_name)
      : [];
    if (isCreateRoom.length) {
      return;
    }
    try {
      const roomDetails = {
        sellerId: shopData?.data?.shopDetails?.shop_owner_id,
        userName:
          userProfileData?.data?.firstName +
          " " +
          userProfileData?.data?.lastName,
        shopName: shopData?.data?.shopDetails?.shop_name,
        shopId: shopData?.data?.shopDetails?.shop_id,
      };
      const response = await createChatRoom(roomDetails);
      navigate("/chat");
    } catch (e) {
      console.log(e);
    }
  };
  const handleCall = (e) => {
    e.stopPropagation();
  };
  const handleFollowShop = (e) => {
    e.stopPropagation();
    handleFollow(singleShop.shop_uid);
  };
const width=window.innerWidth
console.log(width)
  return (
    <>
      {isShare && <SharePopup setIsShare={setIsShare} shopId={singleShop?.shop_id} />}
      <div className="shop-card" onClick={handleShop} >
        <div className="shop-image">
          <img src={singleShop?.profile_url} alt="" />
          {id === 1 && <img src={validTick} className="tick-icon" />}
        </div>
        <div className="details-card">
          <div className="details">
            <h3>{singleShop?.shop_name || "---------"}</h3>
            {/* <div className="stars-card">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <div key={index} dataId={item}>
                  &#9733;
                </div>
              ))}
              <p>4.3/5</p>
            </div> */}
            <p className="shop-category">Category: {singleShop?.category}</p>
            <p className="shop-dis">
  About Shop: {
    singleShop?.description?.length > 60
      ? width > 350
        ? singleShop?.description?.slice(0, 60) + ".."
        : singleShop?.description?.slice(0, 30) + ".."
      : singleShop?.description
  }
</p>

               <p className="distance">
              Radius{" "}
              <span>
                {haversine(
                  latitude,
                  longitude,
                  singleShop?.store_location.latitude,
                  singleShop?.store_location.longitude
                )}{" "}
                KM
              </span>
            </p>
       <div className="location-text">
  {singleShop?.shop_address && (
    <a
      href={`https://www.google.com/maps?q=${singleShop?.store_location?.latitude},${singleShop?.store_location?.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      className="location-link"
      onClick={(e) => e.stopPropagation()}
    >
      <img src={location} alt="location" />
      <p>{singleShop?.shop_address}.</p>
    </a>
  )}
</div>
            {/* <div className="follow">
              <button onClick={handleFollowShop}>Follow</button>
              <div>
                <img src={followersIcon} />
                <p>20K</p>
                <span>(followers)</span>
              </div>
            </div> */}
          </div>
          <div className="actions">
            <button onClick={(e) => handleShare(e, singleShop?.shop_uid)}>
              <img src={share} alt="" />
            </button>
            {/* <button onClick={handleChat}>
              <img src={chat} alt="" />
            </button> */}
            {/* <button onClick={handleCall}>
              <a
                href={`tel:${phoneNumber}`}
                style={{ textDecoration: "none", color: "blue" }}
              >
                <img src={call} alt="" />
              </a>
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopCard;
