import { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Search, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Mapbox configuration - replace with your token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicmFqdXJhamsiLCJhIjoiY21iZG4zZ2V6MGl5ajJsc2J0ZnF0bzVxOCJ9.iujEsIQoz-8aPunwnFlntg';
const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

// Custom marker icons
const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Cache for storing geocoding results
const geocodingCache = new Map();

function LocationMarker({ handleSetLocationDetails, setClickedLocation }) {
  const map = useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      map.flyTo(e.latlng, map.getZoom());
      setClickedLocation([lat, lng]);
      
      // Check cache first
      const cacheKey = `reverse-${lat}-${lng}`;
      if (geocodingCache.has(cacheKey)) {
        const address = geocodingCache.get(cacheKey);
        updateLocationDetails(lat, lng, address);
        return;
      }

      try {
        // Only make API call if not in cache
        const response = await fetch(
          `${MAPBOX_GEOCODING_URL}${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
        );
        const data = await response.json();
        const address = data.features[0]?.place_name || "Address not found";
        
        // Cache the result
        geocodingCache.set(cacheKey, address);
        updateLocationDetails(lat, lng, address);
      } catch (error) {
        console.error("Error fetching address:", error);
        updateLocationDetails(lat, lng, "Address not found");
      }
    },
  });

  const updateLocationDetails = (lat, lng, address) => {
    handleSetLocationDetails({
      latitude: lat,
      longitude: lng,
      shop_address: address,
      storeAddress: {
        storeLocation: { latitude: lat, longitude: lng },
        storeAddress: address,
      },
      address: address,
    });
  };

  return null;
}

function SearchControl() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const map = useMap();

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    
    // Check cache first
    const cacheKey = `search-${query}`;
    if (geocodingCache.has(cacheKey)) {
      setResults(geocodingCache.get(cacheKey));
      setShowResults(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${MAPBOX_GEOCODING_URL}${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5`
      );
      const data = await response.json();
      const features = data.features || [];
      
      // Cache the results
      geocodingCache.set(cacheKey, features);
      setResults(features);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleResultClick = useCallback((result) => {
    const [lng, lat] = result.center;
    map.flyTo([lat, lng], 16);
    setShowResults(false);
    setSearch("");
  }, [map]);

  return (
    <div style={{
      position: "absolute",
      top: "10px",
      left: "10px",
      zIndex: 1000,
      width: "240px",
      background: "white",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(search)}
          placeholder="Search location..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginRight: "5px"
          }}
        />
        <button
          onClick={() => handleSearch(search)}
          disabled={isLoading}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px"
          }}
        >
          <Search size={20} />
        </button>
      </div>
      {showResults && results.length > 0 && (
        <div style={{
          marginTop: "5px",
          maxHeight: "150px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "4px"
        }}>
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "8px",
                borderBottom: "1px solid #eee",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              {result.place_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReturnToLocationButton({ currentLocation }) {
  const map = useMap();

  return (
    <div 
      onClick={() => currentLocation && map.flyTo(currentLocation, 16)}
      style={{
        position: "absolute",
        top: "70px",
        left: "10px",
        zIndex: 1000,
        background: "white",
        padding: "8px",
        borderRadius: "5px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        cursor: "pointer"
      }}
    >
      <Navigation size={20} />
    </div>
  );
}

const CustomMapComponent = ({ handleSetLocationDetails }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const defaultPosition = { lat: 51.505, lng: -0.09 };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          setIsLoading(false);

          const cacheKey = `reverse-${location.lat}-${location.lng}`;
          if (geocodingCache.has(cacheKey)) {
            const address = geocodingCache.get(cacheKey);
            updateLocationDetails(location.lat, location.lng, address);
            return;
          }

          try {
            const response = await fetch(
              `${MAPBOX_GEOCODING_URL}${location.lng},${location.lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
            );
            const data = await response.json();
            const address = data.features[0]?.place_name || "Address not found";
            
            geocodingCache.set(cacheKey, address);
            updateLocationDetails(location.lat, location.lng, address);
          } catch (error) {
            console.error("Error fetching location name:", error);
            updateLocationDetails(location.lat, location.lng, "Address not found");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, [handleSetLocationDetails]);

  const updateLocationDetails = (lat, lng, address) => {
    handleSetLocationDetails({
      latitude: lat,
      longitude: lng,
      shop_address: address,
      storeAddress: {
        storeLocation: { latitude: lat, longitude: lng },
        storeAddress: address,
      },
      address: address,
    });
  };

  if (isLoading) {
    return <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%"
    }}>Loading map...</div>;
  }

  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative"
    }}>
      <MapContainer
        center={currentLocation || defaultPosition}
        zoom={currentLocation ? 16 : 13}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          handleSetLocationDetails={handleSetLocationDetails} 
          setClickedLocation={setClickedLocation} 
        />
        <SearchControl />
        {currentLocation && (
          <Marker position={currentLocation} icon={blueIcon} />
        )}
        {clickedLocation && (
          <Marker position={clickedLocation} icon={redIcon} />
        )}
        {currentLocation && (
          <ReturnToLocationButton currentLocation={currentLocation} />
        )}
      </MapContainer>
    </div>
  );
};

export default CustomMapComponent;


