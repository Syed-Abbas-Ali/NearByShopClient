import "./userLocationPointer.scss";

// Assets
import locationPoint from "../../assets/locationPoint.svg";
import locationDropdown from "../../assets/locationDropdown.svg";
import UserLocationDetails from "../commonComponents/userLocationDetails/UserLocationDetails";
import { useDispatch, useSelector } from "react-redux";
import { setUserMapLocationOpen } from "../../apis&state/state/mapDetails";

const UserLocationPointer = () => {
  const dispatch = useDispatch();
  const {
    mapDetailsState: {
      userMapDetails: { locationAddress },
    },
  } = useSelector((state) => state);
  const handleLocationClick = () => {
    dispatch(setUserMapLocationOpen());
  };
  return (
    <div className="user-location-pointer">
      <img src={locationPoint} alt="" className="location-point" />
      <div className="location-name" onClick={handleLocationClick}>
        <p>{locationAddress}</p>
        <img src={locationDropdown} alt="" />
      </div>
      {/* <UserLocationDetails /> */}
    </div>
  );
};

export default UserLocationPointer;
