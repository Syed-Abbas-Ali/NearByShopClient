import React from "react";
import cancelLineIcon from "../../assets/cancelLineIcon.svg";
import searchImage from "../../assets/search.svg";
import Selector from "../selector/Selector";
import "./filters.scss";
import PriceRange from "../priceRange/PriceRange";
import { useDispatch } from "react-redux";
import { setIsFilterPopupOpen } from "../../apis&state/state/globalStateName";

const offersList = [10, 20, 30, 40, 50, 60];

const ratingsList = [3, 4, 5];

const Filters = () => {
  const dispatch = useDispatch();
  const handleCancel = () => {
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
          <h3>Location</h3>
          <div className="search-div">
            <img src={searchImage} alt="" />
            <Selector />
          </div>
          <div className="check-box-div">
            <div>
              <input type="checkbox" checked />
              <label>Verified Shop</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Unverified Shop</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Deliverable</label>
            </div>
          </div>
          <div className="offers-selection">
            <h3>Shop Rating</h3>
            <div className="offer-selection-card">
              {ratingsList.map((item, index) => (
                <div className="single-offer" key={index}>
                  <input
                    type="checkbox"
                    name={item.toString()}
                    id={item.toString()}
                  />
                  <label htmlFor={item.toString()}>
                    <span>{item + " Star"}</span> above
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="offers-selection">
            <h3>Discount</h3>
            <div className="offer-selection-card">
              {offersList.map((item, index) => {
                return (
                  <div className="single-offer" key={index}>
                    <input type="checkbox" />
                    <label>
                      <span>{item}%</span> or more
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="price-range-card">
            <p>Near by shop radius</p>
            <div className="price-range-slider">
              <PriceRange min={500} max={10} minLabel="m" maxLabel="km"/>
            </div>
          </div>
          <div className="price-range-card">
            <p>Price Range</p>
            <div className="price-range-slider">
              <PriceRange min={50} max={150000} minLabel="min" maxLabel="max"/>
            </div>
            <div className="range-buttons">
              {[
                {
                  name: "Low - High",
                  value: 1,
                },
                {
                  name: "High - Low",
                  value: 2,
                },
              ].map((item, index) => (
                <button
                  className={`${index === 0 ? "active-btn" : "inactive-btn"}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div className="apply-btn">
            <button>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
