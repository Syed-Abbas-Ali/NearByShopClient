import React, { useEffect, useState } from "react";
import "./userLocationSelectPopup.scss";
import cancelIcon from "../../../assets/cancelIconRed.svg";
import locationCompass from "../../../assets/compass.png";
import searchIcon from "../../../assets/searchNew1.svg";
import cancelInputIcon from "../../../assets/cancelLineIcon.svg";
// import OpenLayer from "../openLayer/OpenLayer";

const UserLocationSelectPopup = ({ handleLocationClick }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [locationSearchText, setLocationSearchText] = useState("");
  const handleLocationSearch = (e) => {
    setLocationSearchText(e.target.value);
  };
  const handleOutsideClick = (e) => {
    if (e.target.id === "Parent") {
      handleLocationClick(false);
    }
  };
  // Fetch location suggestions when the user types
  useEffect(() => {
    if (locationSearchText.trim()) {
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${locationSearchText}&format=json&addressdetails=1&limit=5`
      )
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data); // Update the suggestions state with search results
        })
        .catch((error) => {
          console.error("Error fetching search suggestions", error);
        });
    } else {
      setSuggestions([]); // Clear suggestions when the search query is empty
    }
  }, [locationSearchText]);

  const handleSelectedSearchResults = (lat, lon, displayName) => {};

  const handleSubmitBtn=()=>{

  }

  return (
    <div
      className="user-location-select-popup"
      onClick={handleOutsideClick}
      id="Parent"
    >
      <div className="content-card">
        <div className="heading-card">
          <p>Your Location</p>
          <img
            src={cancelIcon}
            alt=""
            className="cancel-icon"
            onClick={() => handleLocationClick(false)}
          />
        </div>
        <div className="search-input-card">
          <img src={searchIcon} alt="" />
          <input
            value={locationSearchText}
            type="text"
            placeholder="Search your location..."
            onChange={handleLocationSearch}
          />
          {locationSearchText.length > 0 && (
            <img
              src={cancelInputIcon}
              alt=""
              onClick={() => setLocationSearchText("")}
            />
          )}
          {suggestions.length > 0 && (
            <ul className="searched-results">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() =>
                    handleSelectedSearchResults(
                      suggestion.lat,
                      suggestion.lon,
                      suggestion.display_name
                    )
                  }
                  style={{ padding: "10px", cursor: "pointer" }}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {locationSearchText.length === 0 && (
          <div className="location-content-card">
            <div className="compass-card">
              <img src={locationCompass} alt="" />
            </div>
            <div className="giving-text">
              <h3>Take my current location</h3>
              <p>Use GPS (Your current location)</p>
            </div>
            <div className="submit-btn-card">
              <button onClick={handleSubmitBtn}>Submit</button>
            </div>
          </div>
        )}
        {/* <OpenLayer /> */}
      </div>
    </div>
  );
};

export default UserLocationSelectPopup;
