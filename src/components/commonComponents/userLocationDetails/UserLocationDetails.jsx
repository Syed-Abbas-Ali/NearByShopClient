import React, { useEffect, useState } from "react";
import "./userLocationDetails.scss";
import locationIcon from "../../../assets/selectLocationIcon.png";
import dropDownArrow from "../../../assets/dropDownArrow.png";
import UserLocationSelectPopup from "../userLocationSelectPopup/UserLocationSelectPopup";
import { useDispatch, useSelector } from "react-redux";
// import { setUserCurrentLocationDetails } from "../../../apis&state/state/globalStateName";
import UserLocationSelect from "../userLocationSelect/UserLocationSelect";
import {
  setUserMapDetails,
  setUserMapOpen,
} from "../../../apis&state/state/mapDetails";

const UserLocationDetails = () => {
  const dispatch = useDispatch();

  // ✅ Select only necessary parts of the state to avoid unnecessary re-renders
  const userAddress = useSelector(
    (state) => state.globalState?.userCurrentLocationDetails?.userAddress
  );

  const userMapDetails = useSelector(
    (state) => state.mapDetailsState?.userMapDetails
  );

  const [locationSelectPopup, setLocationSelectPopup] = useState(false);

  const handleLocationClick = () => {
    dispatch(setUserMapOpen());
  };

  const fetchMarkerAddress = (lat, lon) => {
    dispatch(
      setUserMapDetails({
        locationAddress: "",
        latitude: lat,
        longitude: lon,
      })
    );
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        const displayName = data.display_name || "Select Location";
        dispatch(
          setUserMapDetails({
            locationAddress: displayName,
            latitude: lat,
            longitude: lon,
          })
        );
      })
      .catch((error) => console.error("Error fetching address details", error));
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchMarkerAddress(latitude, longitude);
        },
        (error) => {
          console.error("Error getting current location", error);
        }
      );
    }
  }, []);

  return (
    <div className="user-location-details">
      <div className="select-location-card">
        {/* {locationSelectPopup && (
          <UserLocationSelectPopup handleLocationClick={handleLocationClick} />
        )} */}
        {/* {locationSelectPopup && <UserLocationSelect />} */}
        {/* <img src={locationIcon} alt="" /> */}
        <div className="drop-down-card" onClick={handleLocationClick}>
          <p>{userMapDetails?.locationAddress || "Select Location"}</p>
          {/* <img src={dropDownArrow} alt="" /> */}
        </div>
      </div>
    </div>
  );
};

export default UserLocationDetails;
