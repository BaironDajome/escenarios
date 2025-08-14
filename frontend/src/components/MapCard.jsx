import { useEffect } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as esri from "esri-leaflet";

export default function MapCard({ lat, lng, id, label }) {
    useEffect(() => {
        const mapId = `map-${id}`;
        const existingMap = L.DomUtil.get(mapId);
        if (existingMap && existingMap._leaflet_id) {
            existingMap._leaflet_id = null;
        }

        const map = L.map(mapId, {
            center: [lat, lng],
            zoom: 15,
            zoomControl: false,
            attributionControl: false 
        });

        esri.basemapLayer("DarkGray").addTo(map);

        // Definir un icono rojo personalizado con DivIcon
        const redMarker = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="
                background-color: red;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 5px #000;
            "></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6], // centro del círculo
        });

        L.marker([lat, lng], { icon: redMarker }).addTo(map).bindPopup(label).openPopup();
    }, [lat, lng, id]);

    return (
        <div
            id={`map-${id}`}
            style={{
                width: "100%",
                height: "200px",
                borderRadius: "8px",
                marginTop: "10px",
                opacity: 0.5,
                overflow: "hidden",
                marginBottom: "5px"
            }}
        ></div>
    );
}