import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import { Translate } from "ol/interaction";
import MapUI from "../mapUI/MapUI";
import locationPin from "../../../assets/pin.png";
import { useDispatch } from "react-redux";
import { setUserMapDetails, setUserMapLocationOpen, setUserMapOpen } from "../../../apis&state/state/mapDetails";
import "./mapComponent.scss";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const vectorSource = useRef(new VectorSource());
  const dispatch = useDispatch();
  const [newChangedLocation, setNewChangedLocation] = useState();

  // Function to fetch location name using Nominatim API
  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.display_name || "Unknown location";
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Unknown location";
    }
  };

  // Function to search for locations using Nominatim API
  const searchLocation = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching for location:", error);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    searchLocation(searchQuery);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchLocation(searchQuery);
    }
  };

  // Handle click on a search result
  const handleSearchResultClick = (result) => {
    const [longitude, latitude] = [
      parseFloat(result.lon),
      parseFloat(result.lat),
    ];
    setUserLocation([longitude, latitude]);
    setSearchResults([]); // Clear search results after selection

    // Update the map view to the new location
    const map = mapRef.current?.map;
    if (map) {
      map.getView().setCenter(fromLonLat([longitude, latitude]));
      map.getView().setZoom(15); // Adjust the zoom level as needed
    }
  };

  useEffect(() => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);

          // Fetch and log the initial location name
          const locationName = await fetchLocationName(latitude, longitude);
          console.log("Initial Location:", {
            latitude,
            longitude,
            locationName,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (!userLocation || !mapRef.current) return;

    // Create a feature for the user's location
    const userLocationFeature = new Feature({
      geometry: new Point(fromLonLat(userLocation)),
    });

    // Style for the location pointer
    const iconStyle = new Style({
      image: new Icon({
        src: locationPin,
        scale: 0.5,
      }),
    });

    userLocationFeature.setStyle(iconStyle);

    // Clear previous features and add the new one
    vectorSource.current.clear();
    vectorSource.current.addFeature(userLocationFeature);

    // Create the map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(), // OpenStreetMap as the base layer
        }),
        new VectorLayer({
          source: vectorSource.current,
        }),
      ],
      view: new View({
        center: fromLonLat(userLocation),
        zoom: 15, // Adjust the zoom level as needed
      }),
    });

    // Store the map instance in the ref
    mapRef.current.map = map;

    // Add Translate interaction to allow dragging the pointer
    const translateInteraction = new Translate({
      features: vectorSource.current.getFeaturesCollection(),
    });

    translateInteraction.on("translateend", async (event) => {
      const coordinates = event.features
        .getArray()[0]
        .getGeometry()
        .getCoordinates();
      const [longitude, latitude] = toLonLat(coordinates);
      setUserLocation([longitude, latitude]);

      // Fetch and log the new location name
      const locationName = await fetchLocationName(latitude, longitude);
      console.log("New Location:", { latitude, longitude, locationName });
      setNewChangedLocation({
        latitude,
        longitude,
        locationAddress: locationName,
      });

      // Maintain the current zoom level
      map.getView().setZoom(map.getView().getZoom());
    });

    map.addInteraction(translateInteraction);

    // Cleanup on unmount
    return () => map.setTarget(undefined);
  }, [userLocation]);

  const handleConfirm = () => {
    dispatch(setUserMapDetails(newChangedLocation));
    dispatch(setUserMapLocationOpen());
  };

  return (
    <div
      style={{
        width: "100%",
        height: "70%",
        position: "relative",
      }}
      className="map-component"
    >
      {/* Search input field */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          left: "0px",
          zIndex: 1000,
          width: "100%",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
        className="search-input-field-card"
      >
        <form onSubmit={handleSearchSubmit} className="form-card">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search for a location..."
            style={{ width: "50%", padding: "5px" }}
          />
          <div className="action-buttons">
            <button type="submit" className="search-btn">
              Search
            </button>
            <button
              style={{ background: "#ff6600" }}
              className="confirm-btn"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </form>
        {/* Display search results */}
        {searchResults.length > 0 && (
          <ul
            style={{ listStyle: "none", padding: "0", margin: "10px 0 0 0" }}
            className="search-results"
          >
            {searchResults.map((result, index) => (
              <li
                key={index}
                style={{
                  padding: "5px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                }}
                onClick={() => handleSearchResultClick(result)}
              >
                {result.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Map container */}
      <MapUI mapRef={mapRef} />
    </div>
  );
};

export default MapComponent;