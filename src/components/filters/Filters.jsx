import React, { useState } from "react";
import { useDispatch } from "react-redux";
import cancelLineIcon from "../../assets/cancelLineIcon.svg";
import searchImage from "../../assets/search.svg";
import Selector from "../selector/Selector";
import "./filters.scss";
import PriceRange from "../priceRange/PriceRange";
import { setGlobalFilter, setIsFilterPopupOpen } from "../../apis&state/state/globalStateName";

const offersList = [10, 20, 30, 40, 50, 60];
const ratingsList = [3, 4, 5];

const verifiedArray = [
  { name: "Verified", value: true },
  { name: "Not Verified", value: false },
];

const Filters = () => {
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState({
    isVarified: false,
    discount: "",
    radius: 5000, // Default value for the radius range slider
  });

  const [rating, setRating] = useState([]);

  const handleCancel = () => {
    dispatch(setIsFilterPopupOpen());
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkboxes separately
    setFilterData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRatingChange = (value) => {
    setRating((prevRatings) => {
      if (prevRatings.includes(value)) {
        return prevRatings.filter((r) => r !== value);
      }
      return [...prevRatings, value];
    });
  };

  const handleApplyFilter = () => {
    dispatch(setGlobalFilter({ ...filterData, rating }));
    dispatch(setIsFilterPopupOpen());
  };

  return (
    <div className="filters">
      <div className="filters-container">
        <img
          src={cancelLineIcon}
          className="cancel-icon"
          alt="cancel"
          onClick={handleCancel}
        />
        <div className="filters-content">
          {/* <h3>Location</h3> */}
          {/* <div className="search-div">
            <img src={searchImage} alt="" />
            <Selector />
          </div> */}
          
          {/* <div className="check-box-div">
            {verifiedArray.map((item, index) => (
              <div key={index}>
                <input
                  type="radio"
                  // checked={filterData.isVarified === item.value}
                  value={item.value}
                  onChange={handleChange}
                  name="isVarified"
                />
                <label>{item.name}</label>
              </div>
            ))}
          </div> */}


             {/* dont delete this */}
          {/* <div className="offers-selection">
            <h3>Shop Rating</h3>
            <div className="offer-selection-card">
              {ratingsList.map((item, index) => (
                <div className="single-offer" key={index}>
                  <input
                    type="checkbox"
                    name="rating"
                    id={`rating-${item}`}
                    onChange={() => handleRatingChange(item)}
                    checked={rating.includes(item)}
                  />
                  <label htmlFor={`rating-${item}`}>
                    <span>{item} Star</span> above
                  </label>
                </div>
              ))}
            </div>
          </div> */}

          <div className="offers-selection">
            <h3>Discount</h3>
            <div className="offer-selection-card">
              {offersList.map((item, index) => (
                <div className="single-offer" key={index}>
                  <input
                    type="radio"
                    name="discount"
                    value={item}
                    onChange={handleChange}
                    checked={filterData.discount === item.toString()}
                  />
                  <label>
                    <span>{item}%</span> or more
                  </label>
                </div>
              ))}
            </div>
          </div>

       <div className="price-range-card">
  <p>Nearby Shop Radius</p>
  <div className="price-range-slider">
    <PriceRange
      min={500}
      max={10000}
      defaultValue={5000}
      minLabel="500m"
      maxLabel="10km"
      step={500}
      handleRange={(d) => setFilterData(prev => ({ ...prev, radius: d.maxPrice }))}
      singleThumb={true}
      valueType="distance"
    />
    {/* <span>{filterData.radius} m</span> */}
  </div>
</div>

          <div className="price-range-card">
            <p>Price Range</p>
            <div className="price-range-slider">
              <PriceRange
                min={50}
                max={150000}
                minLabel="min"
                maxLabel="max"
                handleRange={(d) =>
                  setFilterData((prev) => ({ ...prev, ...d }))
                }
                valueType="currency"
              />
            </div>
          </div>

          <div className="apply-btn">
            <button onClick={handleApplyFilter}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
