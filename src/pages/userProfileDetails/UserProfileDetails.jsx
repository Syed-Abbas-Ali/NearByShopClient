import { useEffect } from "react";
import "./userProfileDetails.scss";
import { userTypeValue } from "../../utils/authenticationToken";
import Profile from "../profile/Profile";
import UserProfile from "../userProfile/UserProfile";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfileDetails = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state) => state.authState.isAuthenticated
  );
  console.log("first");
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return <>{userTypeValue() === "SELLER" ? <Profile /> : <UserProfile />}</>;
};

export default UserProfileDetails;
