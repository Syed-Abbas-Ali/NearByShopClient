import React from "react";
import "./userLocationSelect.scss";
// import MapComponent from "../mapComponent/MapComponent";
import cancelIcon from "../../../assets/cancelIconRed.svg";
import { useDispatch } from "react-redux";
import {
  setUserMapDetails,
  setUserMapLocationOpen,
  setUserMapOpen,
} from "../../../apis&state/state/mapDetails";
import CustomMapComponent from "../../mapComponent/CustomMapComponent";

const UserLocationSelect = () => {
  const dispatch = useDispatch();
  const handleCancel = () => {
    dispatch(setUserMapLocationOpen());
  };

  const handleSetLocationDetails = (pro) => {
    const { latitude, longitude, shop_address } = pro;
    dispatch(
      setUserMapDetails({ latitude, longitude, locationAddress: shop_address })
    );
  };

  return (
    <div className="user-location-select">
      <div className="location-popup-content">
        <div className="header-card">
          <h3>Select Location</h3>
          <button className="cancel-icon" onClick={handleCancel}>
            <img src={cancelIcon} className="cancel-icon" />
          </button>
        </div>
        <CustomMapComponent
          handleSetLocationDetails={handleSetLocationDetails}
        />
        {/* <MapComponent /> */}
      </div>
    </div>
  );
};

export default UserLocationSelect;
