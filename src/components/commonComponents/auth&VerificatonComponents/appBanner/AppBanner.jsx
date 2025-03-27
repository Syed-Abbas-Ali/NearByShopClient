import "./appBanner.scss";

// Assets
import authenticationImage from "../../../../assets/authenticationImage.svg";

const AppBanner = () => {
  return (
    <div className="app-banner">
      <img src={authenticationImage} alt="" />
    </div>
  );
};

export default AppBanner;
