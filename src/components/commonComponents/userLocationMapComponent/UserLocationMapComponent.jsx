import React, { useEffect, useState, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Icon, Style } from "ol/style";
import { Overlay } from "ol";
import Geocoder from "ol-geocoder";
import cancelIcon from "../../../assets/cancelNewIcon.svg";
import "./userLocationMapComponent.scss";

const UserLocationMapComponent = () => {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const mapRef = useRef();
  const markerRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    const initialLocation = fromLonLat([77.209, 28.613]); // Default: New Delhi

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({ center: initialLocation, zoom: 12 }),
    });

    const marker = new Feature({ geometry: new Point(initialLocation) });
    marker.setStyle(
      new Style({
        image: new Icon({ anchor: [0.5, 1], src: "https://cdn-icons-png.flaticon.com/128/684/684908.png" })
      })
    );

    const overlay = new Overlay({
      position: initialLocation,
      element: markerRef.current,
      positioning: "center-center",
      stopEvent: false,
    });
    mapInstance.addOverlay(overlay);

    const geocoder = new Geocoder("nominatim", { provider: "osm", targetType: "text", autoComplete: true });
    mapInstance.addControl(geocoder);
    searchRef.current.appendChild(geocoder.getContainer());

    geocoder.on("addresschosen", (evt) => {
      const coord = evt.coordinate;
      setLocation({ lat: coord[1], lon: coord[0] });
      mapInstance.getView().setCenter(coord);
      overlay.setPosition(coord);
    });

    mapInstance.on("singleclick", (evt) => {
      setLocation({ lat: evt.coordinate[1], lon: evt.coordinate[0] });
      overlay.setPosition(evt.coordinate);
    });

    setMap(mapInstance);
    return () => mapInstance.setTarget(null);
  }, []);

  const handleSubmit = () => {
    console.log("Selected Location:", location);
  };

  return (
    <div className="user-location-map-component">
      <div className="map-content-card">
        <div ref={searchRef} className="location-search-box"></div>
        <div ref={mapRef} className="map-container"></div>
        <div ref={markerRef} className="location-marker"></div>
        <div className="map-actions">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default UserLocationMapComponent;
