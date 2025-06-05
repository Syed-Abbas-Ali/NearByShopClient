// import React, { useEffect, useRef, useState } from "react";
// import "ol/ol.css";
// import Map from "ol/Map";
// import View from "ol/View";
// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
// import Feature from "ol/Feature";
// import Point from "ol/geom/Point";
// import VectorSource from "ol/source/Vector";
// import VectorLayer from "ol/layer/Vector";
// import { Icon, Style } from "ol/style";
// import { fromLonLat, toLonLat } from "ol/proj";
// import Modify from "ol/interaction/Modify"; // Import Modify interaction
// import "./openLayer.scss";
// import { useDispatch } from "react-redux";
// import { setShopLocationMapDetails } from "../../../apis&state/state/shopVerification";

// const OpenLayer = () => {
//   const mapRef = useRef();
//   const dispatch = useDispatch();
//   const [locationLayer] = useState(new VectorSource());
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [centerCoordinates, setCenterCoordinates] = useState([0, 0]);
//   const [currentAddress, setCurrentAddress] = useState("");
//   const [state, setState] = useState(""); // To store the state
//   const [city, setCity] = useState(""); // To store the city
//   const [mapInstance, setMapInstance] = useState(null);
//   const [markerFeature, setMarkerFeature] = useState(null); // To store the marker feature
//   const [markerAddress, setMarkerAddress] = useState(""); // Store the address of the moved marker

//   const fetchMarkerAddress = (lat, lon) => {
//     fetch(
//       `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         const displayName = data.display_name || "Dragged Location";
//         setMarkerAddress(displayName); 
//         dispatch(setShopLocationMapDetails({ shopAddress: displayName }));
//       })
//       .catch((error) => console.error("Error fetching address details", error));
//   };

//   useEffect(() => {
//     const vectorLayer = new VectorLayer({
//       source: locationLayer,
//     });

//     const initialMap = new Map({
//       target: mapRef.current,
//       layers: [
//         new TileLayer({
//           source: new OSM(),
//         }),
//         vectorLayer,
//       ],
//       view: new View({
//         center: fromLonLat([0, 0]),
//         zoom: 2,
//       }),
//     });

//     setMapInstance(initialMap);
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           fetchMarkerAddress(latitude, longitude);
//           dispatch(setShopLocationMapDetails({ latitude, longitude }));
//           const userCoordinates = fromLonLat([longitude, latitude]);
//           initialMap.getView().setCenter(userCoordinates);
//           initialMap.getView().setZoom(15);

//           const userLocationFeature = new Feature({
//             geometry: new Point(userCoordinates),
//           });

//           userLocationFeature.setStyle(
//             new Style({
//               image: new Icon({
//                 src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//                 anchor: [0.5, 1],
//                 scale: 0.1,
//               }),
//             })
//           );

//           locationLayer.addFeature(userLocationFeature);
//           setSelectedLocation({
//             lat: latitude,
//             lon: longitude,
//             displayName: "Your Current Location",
//           });
//           setMarkerFeature(userLocationFeature); // Set the marker feature
//         },
//         (error) => {
//           console.error("Error getting current location", error);
//         }
//       );
//     }

//     initialMap.on("moveend", () => {
//       const center = initialMap.getView().getCenter();
//       const [lon, lat] = toLonLat(center);
//       setCenterCoordinates([lat, lon]);

//       fetchMarkerAddress(lat, lon);
//     });

//     return () => {
//       initialMap.setTarget(null);
//     };
//   }, [locationLayer]);

//   // Handle the search input change
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   // Fetch location suggestions when the user types
//   useEffect(() => {
//     if (searchQuery.trim()) {
//       fetch(
//         `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&addressdetails=1&limit=5`
//       )
//         .then((response) => response.json())
//         .then((data) => {
//           setSuggestions(data); // Update the suggestions state with search results
//         })
//         .catch((error) => {
//           console.error("Error fetching search suggestions", error);
//         });
//     } else {
//       setSuggestions([]); // Clear suggestions when the search query is empty
//     }
//   }, [searchQuery]);

//   const handleSearch = (lat, lon, displayName) => {
//     const coordinates = fromLonLat([parseFloat(lon), parseFloat(lat)]);
//     const map = mapInstance;
//     map.getView().setCenter(coordinates);
//     map.getView().setZoom(15);

//     const searchLocationFeature = new Feature({
//       geometry: new Point(coordinates),
//     });

//     searchLocationFeature.setStyle(
//       new Style({
//         image: new Icon({
//           src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//           anchor: [0.5, 1],
//           scale: 0.1,
//         }),
//       })
//     );

//     locationLayer.clear();
//     locationLayer.addFeature(searchLocationFeature);

//     setSelectedLocation({
//       lat: parseFloat(lat),
//       lon: parseFloat(lon),
//       displayName,
//     });

//     setSuggestions([]); // Clear suggestions after a selection
//   };

//   const handleMapClick = (event) => {
//     const coordinates = toLonLat(event.coordinate);
//     const lat = coordinates[1];
//     const lon = coordinates[0];

//     // Remove the existing marker if there's any
//     if (markerFeature) {
//       locationLayer.removeFeature(markerFeature);
//     }

//     const newMarkerFeature = new Feature({
//       geometry: new Point(event.coordinate),
//     });

//     newMarkerFeature.setStyle(
//       new Style({
//         image: new Icon({
//           src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//           anchor: [0.5, 1],
//           scale: 0.1,
//         }),
//       })
//     );

//     // Add new marker to the map
//     locationLayer.addFeature(newMarkerFeature);
//     setMarkerFeature(newMarkerFeature); // Update the marker feature state

//     fetchMarkerAddress(lat, lon);
//     // fetch(
//     //   `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
//     // )
//     //   .then((response) => response.json())
//     //   .then((data) => {
//     //     const displayName = data.display_name || "Selected location";
//     //     const addressDetails = data.address || {};
//     //     console.log(addressDetails)
//     //     // const city =
//     //     //   addressDetails.city ||
//     //     //   addressDetails.town ||
//     //     //   addressDetails.village ||
//     //     //   "Unknown City";
//     //     // const state = addressDetails.state || "Unknown State";

//     //     // setState(state);
//     //     // setCity(city);
//     //     setSelectedLocation({
//     //       lat,
//     //       lon,
//     //       displayName,
//     //     });

//     //     // Set address for the marker
//     //     setMarkerAddress(displayName);
//     //   })
//     //   .catch((error) => console.error("Error fetching address details", error));
//   };

//   const addDraggableMarker = () => {
//     if (markerFeature) {
//       locationLayer.removeFeature(markerFeature); // Remove previous marker
//     }

//     const newMarker = new Feature({
//       geometry: new Point(fromLonLat([0, 0])),
//     });

//     newMarker.setStyle(
//       new Style({
//         image: new Icon({
//           src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//           anchor: [0.5, 1],
//           scale: 0.1,
//         }),
//       })
//     );

//     setMarkerFeature(newMarker); // Add draggable marker
//     locationLayer.addFeature(newMarker);

//     // Enable drag interaction
//     const modify = new Modify({ source: locationLayer });
//     mapInstance.addInteraction(modify);
//     modify.on("modifyend", (event) => {
//       const coords = event.features.item(0).getGeometry().getCoordinates();
//       const [lon, lat] = toLonLat(coords);
//       setSelectedLocation({
//         lat,
//         lon,
//         displayName: "Dragged Location",
//       });

//       // Fetch address after dragging the marker
//       fetchMarkerAddress(lat, lon);
//     });
//   };

//   useEffect(() => {
//     if (mapInstance) {
//       addDraggableMarker(); // Add the draggable marker when the map is loaded
//     }
//   }, [mapInstance]);

//   // useEffect(()=>{
//   //   dispatch(setShopLocationMapDetails({}))
//   // },[])

//   return (
//     <div className="open-layer-div">
//       {/* <div style={{ marginBottom: "10px", position: "relative" }}>
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={handleSearchChange}
//           placeholder="Enter location"
//           style={{ width: "300px" }}
//         />
//         {suggestions.length > 0 && (
//           <ul
//             style={{
//               position: "absolute",
//               top: "100%",
//               left: 0,
//               right: 0,
//               border: "1px solid #ccc",
//               backgroundColor: "#fff",
//               zIndex: 1000,
//               listStyleType: "none",
//               padding: 0,
//               margin: 0,
//               maxHeight: "150px",
//               overflowY: "auto",
//             }}
//           >
//             {suggestions.map((suggestion) => (
//               <li
//                 key={suggestion.place_id}
//                 onClick={() =>
//                   handleSearch(
//                     suggestion.lat,
//                     suggestion.lon,
//                     suggestion.display_name
//                   )
//                 }
//                 style={{ padding: "10px", cursor: "pointer" }}
//               >
//                 {suggestion.display_name}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div> */}

//       {/* {selectedLocation && (
//         <div style={{ marginTop: "10px" }}>
//           <p>
//             <strong>Selected Location:</strong>
//           </p>
//           <p>{selectedLocation.displayName}</p>
//           <p>
//             Coordinates: {selectedLocation.lat.toFixed(6)},{" "}
//             {selectedLocation.lon.toFixed(6)}
//           </p>
//         </div>
//       )} */}

//       {markerAddress && (
//         <h3 className="user-current-location">{markerAddress}</h3>
//       )}

//       {/* <div>
//         <h3>Moved Marker Coordinates:</h3>
//         {selectedLocation && (
//           <>
//             <p>
//               Latitude: {selectedLocation.lat.toFixed(6)}, Longitude:{" "}
//               {selectedLocation.lon.toFixed(6)}
//             </p>
//           </>
//         )}
//       </div> */}

//       <div
//         ref={mapRef}
//         style={{
//           width: "100%",
//           height: "250px",
//           marginTop: "16px",
//           borderRadius: "8px",
//         }}
//         onClick={handleMapClick}
//       />
//     </div>
//   );
// };

// export default OpenLayer;
