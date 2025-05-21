// import { useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMapEvents,
//   useMap,
// } from "react-leaflet";
// import { Search } from "lucide-react";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix for Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// function LocationMarker() {
//   const [position, setPosition] = useState(null);
//   const map = useMapEvents({
//     click(e) {
//       setPosition(e.latlng);
//       map.flyTo(e.latlng, map.getZoom());
//       console.log(e.latlng)
//     },
//   });
//   return position === null ? null : <Marker position={position}></Marker>;
// }

// function SearchControl() {
//   const [search, setSearch] = useState("");
//   const [results, setResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const map = useMap();

//   const handleSearch = async () => {
//     if (!search.trim()) return;

//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//           search
//         )}&limit=5`
//       );
//       const data = await response.json();
//       setResults(data);
//       setShowResults(true);
//     } catch (error) {
//       console.error("Search error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResultClick = (result) => {
//     const lat = parseFloat(result.lat);
//     const lng = parseFloat(result.lon);

//     console.log("Selected Location:", {
//       name: result.display_name,
//       latitude: lat,
//       longitude: lng,
//     });

//     map.flyTo([lat, lng], 16);
//     setShowResults(false);
//     setSearch("");
//   };

//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: "10px",
//         left: "10px",
//         zIndex: 1000,
//         width: "300px",
//         background: "white",
//         padding: "10px",
//         borderRadius: "5px",
//         boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
//       }}
//     >
//       <div>
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           placeholder="Search location..."
//           style={{
//             width: "100%",
//             padding: "8px",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//         />
//         <button
//           onClick={handleSearch}
//           disabled={isLoading}
//           style={{ marginLeft: "5px" }}
//         >
//           <Search />
//         </button>
//         {showResults && results.length > 0 && (
//           <div
//             style={{
//               marginTop: "5px",
//               maxHeight: "150px",
//               overflowY: "auto",
//               border: "1px solid #ddd",
//               borderRadius: "4px",
//             }}
//           >
//             {results.map((result, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleResultClick(result)}
//                 style={{
//                   display: "block",
//                   width: "100%",
//                   textAlign: "left",
//                   padding: "8px",
//                   borderBottom: "1px solid #eee",
//                 }}
//               >
//                 {result.display_name}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const CustomMapComponent = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const defaultPosition = { lat: 51.505, lng: -0.09 };

//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setCurrentLocation(location);
//           console.log(location);
//           try {
//             const response = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
//             );
//             const data = await response.json();
//             console.log("User's Current Location (Auto Detected):", {
//               name: data.display_name,
//               latitude: location.lat,
//               longitude: location.lng,
//             });
//           } catch (error) {
//             console.error("Error fetching location name:", error);
//           }
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   return (
//     <div style={{ width: "100%", height: "100%", position: "relative" }}>
//       <MapContainer
//         center={currentLocation || defaultPosition}
//         zoom={currentLocation ? 16 : 13}
//         style={{ width: "100%", height: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <LocationMarker />
//         <SearchControl />
//         {currentLocation && <Marker position={currentLocation}></Marker>}
//       </MapContainer>
//     </div>
//   );
// };

// export default CustomMapComponent;

// import { useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMapEvents,
//   useMap,
// } from "react-leaflet";
// import { Search } from "lucide-react";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { useDebounce } from "use-debounce"; // Install using `npm install use-debounce`

// // Fix for Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // Custom marker icon (optional)
// const customIcon = new L.Icon({
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// function LocationMarker() {
//   const [position, setPosition] = useState(null);
//   const map = useMapEvents({
//     click(e) {
//       setPosition(e.latlng);
//       map.flyTo(e.latlng, map.getZoom());
//       console.log("Clicked Location:", e.latlng);
//     },
//   });
//   return position === null ? null : <Marker position={position} icon={customIcon}></Marker>;
// }

// function SearchControl() {
//   const [search, setSearch] = useState("");
//   const [debouncedSearch] = useDebounce(search, 500); // 500ms debounce
//   const [results, setResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const map = useMap();

//   useEffect(() => {
//     if (debouncedSearch.trim()) {
//       handleSearch(debouncedSearch);
//     }
//   }, [debouncedSearch]);

//   const handleSearch = async (query) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//           query
//         )}&limit=5`
//       );
//       const data = await response.json();
//       setResults(data);
//       setShowResults(true);
//     } catch (error) {
//       console.error("Search error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResultClick = (result) => {
//     const lat = parseFloat(result.lat);
//     const lng = parseFloat(result.lon);

//     console.log("Selected Location:", {
//       name: result.display_name,
//       latitude: lat,
//       longitude: lng,
//     });

//     map.flyTo([lat, lng], 16);
//     setShowResults(false);
//     setSearch("");
//   };

//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: "10px",
//         left: "10px",
//         zIndex: 1000,
//         width: "300px",
//         background: "white",
//         padding: "10px",
//         borderRadius: "5px",
//         boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
//       }}
//     >
//       <div>
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch(search)}
//           placeholder="Search location..."
//           style={{
//             width: "100%",
//             padding: "8px",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//         />
//         <button
//           onClick={() => handleSearch(search)}
//           disabled={isLoading}
//           style={{ marginLeft: "5px" }}
//         >
//           <Search />
//         </button>
//         {showResults && results.length > 0 && (
//           <div
//             style={{
//               marginTop: "5px",
//               maxHeight: "150px",
//               overflowY: "auto",
//               border: "1px solid #ddd",
//               borderRadius: "4px",
//             }}
//           >
//             {results.map((result, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleResultClick(result)}
//                 style={{
//                   display: "block",
//                   width: "100%",
//                   textAlign: "left",
//                   padding: "8px",
//                   borderBottom: "1px solid #eee",
//                 }}
//               >
//                 {result.display_name}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const CustomMapComponent = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [isLoading, setIsLoading] = useState(true); // Add loading state
//   const defaultPosition = { lat: 51.505, lng: -0.09 };

//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setCurrentLocation(location);
//           setIsLoading(false); // Stop loading once location is fetched
//           console.log("User's Current Location:", location);
//           try {
//             const response = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
//             );
//             const data = await response.json();
//             console.log("Location Name:", data.display_name);
//           } catch (error) {
//             console.error("Error fetching location name:", error);
//           }
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           setIsLoading(false); // Stop loading even if there's an error
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//       setIsLoading(false); // Stop loading if geolocation is not supported
//     }
//   }, []);

//   if (isLoading) {
//     return <div>Loading map...</div>; // Show loading message while fetching location
//   }

//   return (
//     <div style={{ width: "100%", height: "100%", position: "relative" }}>
//       <MapContainer
//         center={currentLocation || defaultPosition}
//         zoom={currentLocation ? 16 : 13}
//         style={{ width: "100%", height: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <LocationMarker />
//         <SearchControl />
//         {currentLocation && <Marker position={currentLocation} icon={customIcon}></Marker>}
//       </MapContainer>
//     </div>
//   );
// };

// export default CustomMapComponent;

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Search, Navigation } from "lucide-react"; // Import Navigation icon
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useDebounce } from "use-debounce"; // Install using `npm install use-debounce`

// Custom marker icons (replace with your own URLs or local paths)
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function LocationMarker({ handleSetLocationDetails }) {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    async click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());

      console.log("Selected Location:", {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
        // address: data.display_name,
      });
      handleSetLocationDetails({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
        storeAddress: {
          storeLocation: {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
          },
        },
      });
      // Fetch address for the clicked location
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        );
        const data = await response.json();
        console.log("Selected Location:", {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          address: data.display_name,
        });

        handleSetLocationDetails({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          shop_address: data.display_name,
          storeAddress: {
            storeLocation: {
              latitude: e.latlng.lat,
              longitude: e.latlng.lng,
            },
            storeAddress: data.display_name,
          },
          address: data.display_name,
        });
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    },
  });
  return position === null ? null : (
    <Marker position={position} icon={redIcon}></Marker>
  );
}

function SearchControl() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500); // 500ms debounce
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const map = useMap();

  useEffect(() => {
    if (debouncedSearch.trim()) {
      handleSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = async (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    // Fetch address for the selected search result
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      console.log("Selected Location:", {
        latitude: lat,
        longitude: lng,
        address: data.display_name,
      });
    } catch (error) {
      console.error("Error fetching address:", error);
    }

    map.flyTo([lat, lng], 16);
    setShowResults(false);
    setSearch("");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 1000,
        width: "240px",
        background: "white",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(search)}
          placeholder="Search location..."
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={() => handleSearch(search)}
          disabled={isLoading}
          style={{ marginLeft: "5px" }}
        >
          <Search />
        </button>
        {showResults && results.length > 0 && (
          <div
            style={{
              marginTop: "5px",
              maxHeight: "150px",
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
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
                }}
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Component for "Return to Current Location" button
function ReturnToLocationButton({ currentLocation }) {
  const map = useMap();

  const handleClick = () => {
    if (currentLocation) {
      map.flyTo(currentLocation, 16); // Fly to the current location with zoom level 16
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "70px", // Position below the search bar
        left: "10px",
        zIndex: 1000,
        background: "white",
        padding: "8px",
        borderRadius: "5px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <Navigation size={20} /> {/* Use the Navigation icon */}
    </div>
  );
}

const CustomMapComponent = ({ handleSetLocationDetails }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState(null); // Store address
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const defaultPosition = { lat: 51.505, lng: -0.09 };
  // Fetch user's live location and address
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          setIsLoading(false); // Stop loading once location is fetched

          // Fetch address using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
            );
            const data = await response.json();
            setAddress(data.display_name); // Set address
            console.log("Location Data:", {
              latitude: location.lat,
              longitude: location.lng,
              address: data.display_name,
            });
          } catch (error) {
            console.error("Error fetching location name:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false); // Stop loading even if there's an error
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false); // Stop loading if geolocation is not supported
    }
  }, []);

  // Log location and address whenever they change
  useEffect(() => {
    if (currentLocation && address) {
      console.log("Location Updated:", {
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        address: address,
      });

      handleSetLocationDetails({
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        shop_address: address,
        storeAddress: {
          storeLocation: {
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
          },
          storeAddress: address,
        },
        address: address,
      });
    }
  }, [currentLocation, address]);

  if (isLoading) {
    return <div>Loading map...</div>; // Show loading message while fetching location
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer
        center={currentLocation || defaultPosition}
        zoom={currentLocation ? 16 : 13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker handleSetLocationDetails={handleSetLocationDetails} />
        <SearchControl />
        {currentLocation && (
          <Marker position={currentLocation} icon={blueIcon}></Marker>
        )}
        {currentLocation && (
          <ReturnToLocationButton currentLocation={currentLocation} />
        )}
      </MapContainer>
    </div>
  );
};

export default CustomMapComponent;
