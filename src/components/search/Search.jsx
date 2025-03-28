import React from "react";
import "./search.scss";
import searchIcon from "../../assets/searchNew1.svg";
import filterIcon from "../../assets/filterNew1.svg";
import { useDispatch } from "react-redux";
import { setIsFilterPopupOpen } from "../../apis&state/state/globalStateName";
import { useLocation } from "react-router-dom";

const SearchComponent = ({ handleSearchShow, setSearch }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const handleFilterOpen = () => {
    dispatch(setIsFilterPopupOpen());
  };
  const isShowFilterIcon =
    pathname === "/" ||
    pathname === "/sub-categories" ||
    pathname === "/sub-home";
  const handleFocus = () => {
    // handleSearchShow("FOCUS");
  };

  const handleChange = (e) => {
    clearInterval();
    setTimeout(() => {
      setSearch(e.target.value);
    }, 1000);
  };
  return (
    <div className="search-card">
      <div className="search-input">
        <img src={searchIcon} alt="search" className="search" height={24} />
        <input type="search" placeholder="Search" onFocus={handleFocus} onChange={handleChange} />
        {isShowFilterIcon && (
          <img
            src={filterIcon}
            alt="filter"
            className="filter"
            onClick={handleFilterOpen}
          />
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
