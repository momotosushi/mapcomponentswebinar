import {useEffect, useState } from "react";
import { 
    MlGeoJsonLayer , 
    Sidebar, 
    LayerListItem,
    LayerList,
    useMap
  } from "@mapcomponents/react-maplibre";
import { circle } from "@turf/turf";
import spielplatz from "../Data/spielplatz.json";
import hallenbad from "../Data/hallenbad.json";
import park from "../Data/park.json";
import fussballplatz from "../Data/fussballplatz.json";
import restaurant from "../Data/restaurant_modified2.json";
import '../Styles/SportangebotLayer.css';

export default function SportangebotLayer() {

    const [filterOpen, setFilterOpen] = useState(false);
    const [filterDuration, setFilterDuration] = useState(0.5); // Auswahl der Stunden

    const [selectedPoint, setSelectedPoint] = useState(null); // Ausgewählter Punkt
    const [radius, setRadius] = useState(1000); // Radius in meter

    const mapHook = useMap(); //Speichern der Koordinaten beim Klicken
    
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

        // Clean Up der Event-Listener, wenn die Komponente unmounted (nicht mehr gerendert)
        //  oder sich die dependencies ändern
        return () => {
            map.off("click", handleMapClick);
            map.off("contextmenu", handleContextMenu);
        };
    }, [mapHook.map]); // Dependency array, verhindert unnötige Aufrufe

     // Funktion um den Punkt zu löschen
     const clearSelectedPoint = () => {
         setSelectedPoint(null); // Zurücksetzen auf Null/löschen des ausgewählten Punktes
    };

    const handleSliderChange = (event) => {
        setFilterDuration(Number(event.target.value));
    };

    const handleRadiusChange = (event) => {
        setRadius(Number(event.target.value));
    };

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
    
            // Checken ob
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

    //Radius/Kreis um den Punkt
    const circleGeoJSON = selectedPoint 
        ? circle(selectedPoint.geometry.coordinates, radius / 1000, {
              steps: 64, // Anzahl Kanten
              units: "kilometers",
          })
        : null;
    
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

    const filteredHallenbad = filterOpen 
    ? { 
        ...hallenbad, 
        features: filterFeaturesByRadius({
            ...hallenbad,
            features: filterByTime(hallenbad),
        }),
    } 
    : { 
        ...hallenbad, 
        features: filterFeaturesByRadius(hallenbad),
    };

const filteredRestaurant = filterOpen 
    ? { 
        ...restaurant, 
        features: filterFeaturesByRadius({
            ...restaurant,
            features: filterByTime(restaurant),
        }),
    } 
    : { 
        ...restaurant, 
        features: filterFeaturesByRadius(restaurant),
    };

    const filteredSpielplatz =    { ...spielplatz, features: filterFeaturesByRadius(spielplatz) };
    const filteredPark =          { ...park, features: filterFeaturesByRadius(park) };
    const filteredFussballplatz = { ...fussballplatz, features: filterFeaturesByRadius(fussballplatz) };

    return(
        <>
        <Sidebar open={true} name={"Layers"} >    
            <button onClick={() => setFilterOpen(!filterOpen)}>
                {filterOpen ? "Alle anzeigen" : "Nur geöffnete anzeigen"}
            </button>
            <div>
                <label htmlFor="duration-slider">Jetzt, für die nächsten {filterDuration} Stunden offen</label>
                <input
                    id="duration-slider"
                    type="range"
                    min="0.5"
                    max="12"
                    step="0.5"
                    value={filterDuration}
                    onChange={handleSliderChange}
                />
            </div>
            <div>
                <label htmlFor="radius-slider">Radius: {radius/1000.00} km</label><br />
                <input
                    id="radius-slider"
                    type="range"
                    min="250"
                    max="7000"
                    step="250"
                    value={radius}
                    onChange={handleRadiusChange}
                />    
            </div>
 
            <LayerList>
                <LayerListItem
                    visible={false} // SET true
                    type="layer"
                    name="spielplatz"
                    configurable={true}
                    layerComponent={
                        <MlGeoJsonLayer
                        geojson={filteredSpielplatz}
                        options={{
                        paint: {
                            "circle-radius": 7,
                            "circle-color": "#800080",
                        },
                        }}
                        labelProp="bezeichnung"
                        />  
                    }
                />
                <LayerListItem
                    visible={false} // SET true
                    type="layer"
                    name="park"
                    configurable={true}         
                    layerComponent={
                        <MlGeoJsonLayer
                        geojson={filteredPark}
                        options={{
                        paint: {
                            "circle-radius": 7,
                            "circle-color": "#00FF00",
                        },
                        }}
                        labelProp="name"
                        />  
                    }
                />
                <LayerListItem
                    visible={true}
                    type="layer"
                    name="hallenbad"
                    configurable={true}         
                    layerComponent={
                        <MlGeoJsonLayer
                        geojson={filteredHallenbad}
                        options={{
                        paint: {
                            "circle-radius": 7,
                            "circle-color": "#0000FF",
                        },
                        }}
                        labelProp="name"
                        />
                    }
                />
                <LayerListItem
                    visible={true}
                    type="layer"
                    name="fußballplatz"
                    configurable={true}         
                    layerComponent={
                        <MlGeoJsonLayer
                        geojson={filteredFussballplatz}
                        options={{
                        paint: {
                            "circle-radius": 7,
                            "circle-color": "#FF0000",
                        },
                        }}
                        labelProp="name"
                        />
                    }
                />
                <LayerListItem
                    visible={true}
                    type="layer"
                    name="restaurant"
                    configurable={true}         
                    layerComponent={
                        <MlGeoJsonLayer
                        geojson={filteredRestaurant}
                        options={{
                        paint: {
                            "circle-radius": 7,
                            "circle-color": "#FF0000",
                        },
                        }}
                        labelProp="name"
                        />
                    }
                />
            </LayerList>
            <p>(Links-Klick in die Karte um einen Punkt zu bestimmen <br/>Rechts-Klick in die Karte um den Punkt zu entfernen)</p> 
        </Sidebar>
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
