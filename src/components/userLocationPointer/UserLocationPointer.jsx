import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./userLocationPointer.scss";

// Assets
import locationPoint from "../../assets/locationPoint.svg";
import locationDropdown from "../../assets/locationDropdown.svg";

// State
import { setUserMapLocationOpen } from "../../apis&state/state/mapDetails";

const UserLocationPointer = () => {
  const dispatch = useDispatch();
  const [storedAddress, setStoredAddress] = useState(null);

  // const {
  //   mapDetailsState: {
  //     userMapDetails: { locationAddress },
  //   },
  // } = useSelector((state) => state);

  const handleLocationClick = () => { 
    dispatch(setUserMapLocationOpen());
  };
    const isUserMapLocationOpen = useSelector(
    (state) => state.mapDetailsState.isUserMapLocationOpen
  );

    useEffect(() => {
    const storedLocation = sessionStorage.getItem("userLocation");
    if (storedLocation) {
      const userLocation = JSON.parse(storedLocation);
      setStoredAddress(userLocation?.address);
    } else {
      // Only dispatch if not already open
      if (!isUserMapLocationOpen) {
        dispatch(setUserMapLocationOpen());
      }
    }
  }, [dispatch, isUserMapLocationOpen]);

  return (
    <div className="user-location-pointer">
      <img src={locationPoint} alt="" className="location-point" />
      <div className="location-name" onClick={handleLocationClick}>
        <p>{storedAddress ?  storedAddress : "Select Location"}</p>
        <img src={locationDropdown} alt="" />
      </div>
      {/* <UserLocationDetails /> */}
    </div>
  );
};

export default UserLocationPointer;
