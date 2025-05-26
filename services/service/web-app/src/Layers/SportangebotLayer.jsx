import {useEffect, useState } from "react";
import { 
    MlGeoJsonLayer , 
    Sidebar, 
    LayerList,
    useMap
  } from "@mapcomponents/react-maplibre";
import { circle } from "@turf/turf";
import spielplatz from "../Data/spielplatz.json";
//import hallenbad from "../Data/hallenbad.json";
import park from "../Data/park.json";
//import fussballplatz from "../Data/fussballplatz.json";
//import restaurant from "../Data/restaurant_modified2.json";
import '../Styles/SportangebotLayer.css';
import {convertGeomToGeoJSON} from "../Layers/convert";
import {CustomLayerListItem, Slider} from "../Layers/Components";

export default function SportangebotLayer() {

    const [filterOpen, setFilterOpen] = useState(false);
    const [filterDuration, setFilterDuration] = useState(0.5); // Auswahl der Stunden

    const [selectedPoint, setSelectedPoint] = useState(null); // Ausgewählter Punkt
    const [radius, setRadius] = useState(1000); // Radius in meter

    // State for backend data
    const [hallenbad, setHallenbad] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [fussballplatz, setFussballplatz] = useState(null);
    
    const mapHook = useMap(); //Speichern der Koordinaten beim Klicken

    // Fetch data from backend

    useEffect(() => {
        fetch('https://localhost:8443/api/getinfo/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            setHallenbad({
                type: "FeatureCollection",
                features: data.Hallenbad.map(item => ({
                    type: "Feature",
                    geometry: convertGeomToGeoJSON(item.geom),
                    properties: { ...item }
                }))
            });
            setRestaurant({
                type: "FeatureCollection",
                features: data.Restaurant.map(item => ({
                    type: "Feature",
                    geometry: convertGeomToGeoJSON(item.geom),
                    properties: { ...item }
                }))
            });
            setFussballplatz({
                type: "FeatureCollection",
                features: data.Fussballplatz.map(item => ({
                    type: "Feature",
                    geometry: convertGeomToGeoJSON(item.geom),
                    properties: { ...item }
                }))
            });
        })
        .catch(error => {
            console.error('Es gab ein Problem mit der Anfrage:', error);
        });
    }, []);

    useEffect(() => {
        const map = mapHook.map;

        if (!map) return; // Map verfügbar?

        // Linksklick-Funktion um den Punkt zu setzen
        const handleMapClick = (e) => {
            const { lng, lat } = e.lngLat;
            setSelectedPoint({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
                properties: {},
            });
        };

        // Rechtsklick-Funktion um die Punkt-Lösch-Funktion zu aktivieren
        const handleContextMenu = () => {
            clearSelectedPoint();
        };

        // Hinzufügen von Rechtsklick- und Linksklick
        map.on("click", handleMapClick);
        map.on("contextmenu", handleContextMenu);

        // Clean Up der Event-Listener, wenn die Komponente unmounted (nicht mehr gerendert) oder sich die dependencies ändern
        return () => {
            map.off("click", handleMapClick);
            map.off("contextmenu", handleContextMenu);
        };
    }, [mapHook.map]); // Dependency array, verhindert unnötige Aufrufe

    if (!hallenbad || !restaurant || !fussballplatz) {
        return <div>Lade Daten...</div>;
    }

     // Funktion um den Punkt zu löschen/auf Null zu setzen
     const clearSelectedPoint = () => {
         setSelectedPoint(null);
    };

    const handleSliderChange = (event) => {
        setFilterDuration(Number(event.target.value));
    };

    const handleRadiusChange = (event) => {
        setRadius(Number(event.target.value));
    };

    ////////////////////////FILTER-FUNKTIONEN/////////////////////////
    const filterByTime = (geojson) => {
        const now = new Date();
        const currentDay = now.toLocaleString("de-DE", { weekday: "long" }); // zB, "Montag"
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Zeit in Minuten bis Mitternacht
        const requiredOpenTime = currentTime + filterDuration * 60; // Slider wert in minuten
    
        return geojson.features.filter((feature) => {
            const oeffnungszeiten = feature.properties.oeffnungszeiten;
    
            // Wenn oeffnungszeiten kein array ist oder nicht existiert, return false
            if (!oeffnungszeiten || !Array.isArray(oeffnungszeiten)) {
                return false;
            }
    
            // Finde den "Schedule" für den current day
            const daySchedule = oeffnungszeiten.find((entry) => entry.tag === currentDay);
            if (!daySchedule || !daySchedule.zeit) return false;
    
            const isOpenForDuration = (timeRange) => {
                if (!timeRange || !timeRange.includes("-")) return false;
                try {
                    const [start, end] = timeRange.split("-").map((time) => {
                        const [hours, minutes] = time.split(":").map(Number);
                        return hours * 60 + minutes;
                    });
                    return currentTime >= start && requiredOpenTime <= end;
                } catch (error) {
                    console.error("Error parsing time range:", timeRange, error);
                    return false;
                }
            };
    
            return isOpenForDuration(daySchedule.zeit) || isOpenForDuration(daySchedule.zeit_2);
        });
    };
    
    const filterFeaturesByRadius = (geojson) => {
        if (!selectedPoint) return geojson.features;

        const [lng, lat] = selectedPoint.geometry.coordinates;
        const toRadians = (degrees) => degrees * (Math.PI / 180);
        const earthRadius = 6371000; // Erde Radius in Metern

        return geojson.features.filter((feature) => {
            const [featureLng, featureLat] = feature.geometry.coordinates;
            const dLat = toRadians(featureLat - lat);
            const dLng = toRadians(featureLng - lng);
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat)) * Math.cos(toRadians(featureLat)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = earthRadius * c; // Distanz in metern
            return distance <= radius;
        });
    };

    //Radius/Kreis Fläche, um den Punkt
    const circleGeoJSON = selectedPoint 
        ? circle(selectedPoint.geometry.coordinates, radius / 1000, {
              steps: 64, // Anzahl Kanten
              units: "kilometers",
          })
        : null;
    

    const getFilteredGeoJSON = (geojson, filterOpen, filterByTime, filterFeaturesByRadius) => {
        const filteredByTime = filterOpen ? filterByTime(geojson) : geojson.features;
        return { ...geojson, features: filterFeaturesByRadius({ ...geojson, features: filteredByTime }) };
    };

    const filteredHallenbad = getFilteredGeoJSON(hallenbad, filterOpen, filterByTime, filterFeaturesByRadius);
    const filteredRestaurant = getFilteredGeoJSON(restaurant, filterOpen, filterByTime, filterFeaturesByRadius);
    const filteredFussballplatz = { ...fussballplatz, features: filterFeaturesByRadius(fussballplatz) };
    const filteredSpielplatz = { ...spielplatz, features: filterFeaturesByRadius(spielplatz) };
    const filteredPark = { ...park, features: filterFeaturesByRadius(park) };

    const layers = [
            { name: "spielplatz", geojson: filteredSpielplatz, color: "#800080", labelProp: "bezeichnung", visible: false },
            { name: "park", geojson: filteredPark, color: "#00FF00", labelProp: "name", visible: false },
            { name: "hallenbad", geojson: filteredHallenbad, color: "#0000FF", labelProp: "name", visible: true },
            { name: "fußballplatz", geojson: filteredFussballplatz, color: "#FF0000", labelProp: "name", visible: true },
            { name: "restaurant", geojson: filteredRestaurant, color: "#FF0000", labelProp: "name", visible: true },
    ];

    return (
        <>
            <Sidebar open={true} name={"Layers"}>
                <button onClick={() => setFilterOpen(!filterOpen)}>
                    {filterOpen ? "Alle anzeigen" : "Nur geöffnete anzeigen"}
                </button>

                {/* Sliders */}
                <Slider
                    id="duration-slider"
                    label={`Jetzt, für die nächsten ${filterDuration} Stunden offen`}
                    min="0.5"
                    max="12"
                    step="0.5"
                    value={filterDuration}
                    onChange={handleSliderChange}
                />
                <Slider
                    id="radius-slider"
                    label={`Radius: ${(radius / 1000).toFixed(2)} km`}
                    min="250"
                    max="7000"
                    step="250"
                    value={radius}
                    onChange={handleRadiusChange}
                />

                {/* Layer List */}
                <LayerList>
                    {layers.map((layer) => (
                        <CustomLayerListItem
                            key={layer.name}
                            name={layer.name}
                            geojson={layer.geojson}
                            color={layer.color}
                            labelProp={layer.labelProp}
                            visible={layer.visible}
                        />
                    ))}
                </LayerList>

                <p>
                    (Links-Klick in die Karte um einen Punkt zu bestimmen <br />
                    Rechts-Klick in die Karte um den Punkt zu entfernen)
                </p>
            </Sidebar>

            {/* Selected Point and Circle */}
            {selectedPoint && (
                <>
                    <MlGeoJsonLayer
                        geojson={{
                            type: "FeatureCollection",
                            features: [selectedPoint],
                        }}
                        options={{
                            paint: {
                                "circle-radius": 7,
                                "circle-color": "#000000",
                            },
                        }}
                    />
                    {circleGeoJSON && (
                        <MlGeoJsonLayer
                            geojson={{
                                type: "FeatureCollection",
                                features: [circleGeoJSON],
                            }}
                            options={{
                                paint: {
                                    "fill-color": "#0056b3",
                                    "fill-opacity": 0.2,
                                },
                            }}
                        />
                    )}
                </>
            )}
        </>
    );
}
