import React, { useEffect, useRef, useState } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const CustomMap = () => {
  const mapRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 }); // Initialize with default lat/lng
  const [locationName, setLocationName] = useState("My Location");
  useEffect(() => {
    // Get user's current location
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMarkerPosition({ lat: latitude, lng: longitude }); // Set marker position to user's location
          },
          (error) => {
            console.error("Error getting user location: ", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getCurrentLocation(); // Fetch user's location when the component mounts

    const initMap = async () => {
      if (!window.google) {
        console.error("Google Maps JavaScript API is not loaded");
        return;
      }

      const { Map, InfoWindow } = await window.google.maps.importLibrary(
        "maps"
      );
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
        "marker"
      );

      const map = new Map(mapRef.current, {
        center: markerPosition,
        zoom: 14,
        mapId: "4504f8b37365c3d0", // Your Map ID
      });

      const infoWindow = new InfoWindow();

      const draggableMarker = new AdvancedMarkerElement({
        map,
        position: markerPosition,
        gmpDraggable: true,
        title: locationName,
      });

      draggableMarker.addListener("dragend", () => {
        const position = draggableMarker.position;
        setMarkerPosition(position); // Update the marker position in state
        infoWindow.close();
        infoWindow.setContent(
          `Pin dropped at: ${position.lat}, ${position.lng}`
        );
        infoWindow.open(draggableMarker.map, draggableMarker);
      });
    };

    const loadGoogleMapsScript = () => {
      if (document.getElementById("google-maps-script")) return; // Prevent loading script multiple times
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBKOZLqBCVFmtNSd9Q6SOuC1AD3zx736yY&callback=initMap`;
      script.id = "google-maps-script";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    // Add event listener to check if Google Maps is loaded
    window.initMap = initMap;
  }, [markerPosition, locationName]);

  const handleNameChange = (event) => {
    setLocationName(event.target.value);
  };

  return <div ref={mapRef} style={mapContainerStyle}></div>;
};

export default CustomMap;
