import React from "react";
import "./userLocationSelect.scss";
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
  const [locationData, setLocationData] = React.useState(null);

  const handleCancel = () => {
    dispatch(setUserMapLocationOpen());
  };

  const handleSetLocationDetails = (pro) => {
    const { latitude, longitude, shop_address } = pro;
    setLocationData({ latitude, longitude, shop_address });
    dispatch(
      setUserMapDetails({ latitude, longitude, locationAddress: shop_address })
    );
  };


  
  const handleSaveLocation = () => {
    if (locationData) {
      // Save to sessionStorage
      sessionStorage.setItem('userLocation', JSON.stringify({
        coordinates: {
          latitude: locationData.latitude,
          longitude: locationData.longitude
        },
        address: locationData.shop_address
      }));
      
      // Close the modal
      dispatch(setUserMapLocationOpen());

        window.location.reload();
    }
  };

  return (
    <div className="user-location-select">
      <div className="location-popup-content">
        <div className="header-card">
          <h3>Select Location</h3>
          <button className="cancel-icon" onClick={handleCancel}>
            <img src={cancelIcon} className="cancel-icon" alt="Cancel" />
          </button>
        </div>
        <CustomMapComponent
          handleSetLocationDetails={handleSetLocationDetails}
        />
        <div className="footer-actions">
          <button 
            className="save-button" 
            onClick={handleSaveLocation}
            disabled={!locationData}
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLocationSelect;