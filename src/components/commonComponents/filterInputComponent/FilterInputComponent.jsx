import React from "react";
import "./filterInputComponent.scss";

import searchIcon from "../../../assets/searchNew1.svg";
import filterIcon from "../../../assets/filterNew1.svg";
import { useDispatch } from "react-redux";
import { setIsFilterPopupOpen } from "../../../apis&state/state/globalStateName";

const FilterInputComponent = ({handleChange}) => {
  const dispatch = useDispatch();
  const openPopup = () => {
    dispatch(setIsFilterPopupOpen());
  };
  return (
    <div className="filter-input-component">
      <div className="search-icon">
        <img src={searchIcon} alt="" />
      </div>
      <input type="text" placeholder="Search" onChange={(e)=>handleChange(e.target.value)}/>
      <div className="filter-icon">
        <img src={filterIcon} alt="" onClick={openPopup}/>
      </div>
    </div>
  );
};

export default FilterInputComponent;
