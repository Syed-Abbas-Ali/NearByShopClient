import React from "react";
import "./globalFilters.scss";
import cancelIcon from "../../../assets/deleteCircleV1.svg";
import searchIcon from "../../../assets/searchNew1.svg";
import dropdownIcon from "../../../assets/dropdownIconV1.svg";
import CheckBox from "../checkBox/CheckBox";
import PriceRange from "../../priceRange/PriceRange";
import { useDispatch, useSelector } from "react-redux";
import {
  setGlobalFilter,
  setIsFilterPopupOpen,
} from "../../../apis&state/state/globalStateName";
import { setUserMapLocationOpen } from "../../../apis&state/state/mapDetails";

const shopsFilters = [
  {
    labelText: "Verified Shops",
    value: "verified",
  },
  {
    labelText: "Un Verified Shops",
    value: "unVerified",
  },
];

const lowToHighFilters = [
  {
    labelText: "Low - High",
    value: "lowToHigh",
  },
  {
    labelText: "High - Low",
    value: "highToLow",
  },
];

const discountsFilters = [
  {
    labelText: "10%",
    value: "10",
  },
  {
    labelText: "20%",
    value: "20",
  },
  {
    labelText: "30%",
    value: "30",
  },
  {
    labelText: "40%",
    value: "40",
  },
  {
    labelText: "50%",
    value: "50",
  },
  {
    labelText: "60%",
    value: "60",
  },
];

const shopRatingsFilters = [
  {
    labelText: "2 Star",
    value: "2",
  },
  {
    labelText: "3 Star",
    value: "3",
  },
  {
    labelText: "4 Star",
    value: "4",
  },
];

const GlobalFilters = () => {
  const { globalFilter } = useSelector((state) => state.globalState);
  const dispatch = useDispatch();
  const {
    location,
    verified,
    shopRatings,
    discounts,
    shopsRadius,
    priceRange,
    isLowToHigh,
  } = globalFilter;


  const handleCheckBox = (key, value) => {
    if (key === "verified") {
      const selectedList = verified.includes(value)
        ? verified.filter((item) => item !== value)
        : [...verified, value];
      dispatch(
        setGlobalFilter({
          verified: selectedList,
        })
      );
    } else if (key === "rating") {
      const selectedList = shopRatings.includes(value)
        ? shopRatings.filter((item) => item !== value)
        : [...shopRatings, value];
      dispatch(
        setGlobalFilter({
          shopRatings: selectedList,
        })
      );
    } else if (key === "discount") {
      const selectedList = discounts.includes(value)
        ? discounts.filter((item) => item !== value)
        : [...discounts, value];
      dispatch(
        setGlobalFilter({
          discounts: selectedList,
        })
      );
    }
  };

  const lowToHighBtns = (value) => {
    dispatch(
      setGlobalFilter({
        isLowToHigh: value,
      })
    );
  };

  const cancelPopup = () => {
    dispatch(setIsFilterPopupOpen());
  };

  const handlePriceRange = (priceValue) => {
    dispatch(
      setGlobalFilter({
        priceRange: priceValue,
      })
    );
  };

  const handleDistanceRange = (distanceValue) => {
    dispatch(
      setGlobalFilter({
        shopsRadius: distanceValue,
      })
    );
  };

  const handleLocationClick = () => {
    dispatch(setUserMapLocationOpen());
  };

  return (
    <div className="global-filters">
      <div className="cancel-icon">
        <img src={cancelIcon} alt="" onClick={cancelPopup} />
      </div>
      <div className="content-card">
        <div className="cancel-icon2">
          <img src={cancelIcon} alt="" onClick={cancelPopup} />
        </div>
        <div className="location-card">
          <span>Location</span>
          <div onClick={handleLocationClick}>
            <img src={searchIcon} alt="" />
            <p>Madhapur Hyderabad</p>
            <img src={dropdownIcon} alt="" />
          </div>
        </div>
        <div className="verification-card">
          {shopsFilters.map((item, index) => (
            <CheckBox
              key={index}
              data={item}
              checkBoxValues={verified}
              handleCheckBox={(checkboxValue) =>
                handleCheckBox("verified", checkboxValue)
              }
            />
          ))}
        </div>
        <div className="verification-filter">
          <span>Shop Rating</span>
          <div className="filter-card">
            {shopRatingsFilters.map((item, index) => (
              <CheckBox
                key={index}
                data={item}
                checkBoxValues={shopRatings}
                handleCheckBox={(checkboxValue) =>
                  handleCheckBox("rating", checkboxValue)
                }
              />
            ))}
          </div>
        </div>
        <div className="discounts-filter">
          <span>Discount</span>
          <div>
            <div className="filter-card">
              {discountsFilters.map((item, index) => (
                <CheckBox
                  key={index}
                  data={item}
                  checkBoxValues={discounts}
                  handleCheckBox={(checkboxValue) =>
                    handleCheckBox("discount", checkboxValue)
                  }
                />
              ))}
            </div>
          </div>
        </div>
        <div className="distance-card">
          <span>Near by shop radios</span>
          <PriceRange
            min={1}
            max={10}
            minLabel="m"
            maxLabel="km"
            step={1}
            handleRange={handleDistanceRange}
          />
        </div>
        <div className="distance-card">
          <span>Price Range</span>
          <PriceRange
            min={10}
            max={150000}
            minLabel="Rs"
            maxLabel="Rs"
            step={10000}
            handleRange={handlePriceRange}
          />
        </div>
        <div className="ranges-filter">
          {lowToHighFilters.map((item, index) => (
            <button
              onClick={() => lowToHighBtns(item.value)}
              key={index}
              className={
                isLowToHigh === item.value ? "active-btn" : "inactive-btn"
              }
            >
              {item.labelText}
            </button>
          ))}
        </div>
        <div className="apply-btn-card">
          <button>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default GlobalFilters;
