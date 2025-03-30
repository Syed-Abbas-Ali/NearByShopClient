import React, { useState } from "react";
import "./ratingPopup.scss";
import cancelIcon from "../../../assets/cancelNewIcon.svg";
import { GiveRating } from "../../../components/rating/Rating";
import { useAddRatingToShopMutation } from "../../../apis&state/apis/shopApiSlice";

const RatingPopup = ({ setIsShowPopup, shopId }) => {
  const [value, setValue] = useState(0);
  const [postRating, { isLoading }] = useAddRatingToShopMutation();

  const handleRatingSubmit = async () => {
    const finalRatingData = {
      shopId,
      rating: value,
    };
    try {
      const response = await postRating(finalRatingData);
      setTimeout(() => {
        setIsShowPopup(false);
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="rating-popup">
      <div className="content">
        <img
          src={cancelIcon}
          className="cancel-icon"
          onClick={() => setIsShowPopup((prev) => !prev)}
        />
        <div className="stars-card">
          <GiveRating setValue={setValue} value={value} />
        </div>
        <div className="submit-btn">
          <button onClick={handleRatingSubmit}>
            {isLoading ? "..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingPopup;
