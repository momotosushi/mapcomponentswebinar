import { useState } from "react";
import { 
    MlGeoJsonLayer , 
    Sidebar, 
    LayerListItem,
    LayerList,
  } from "@mapcomponents/react-maplibre";
import spielplatz from "./spielplatz.json";
import hallenbad from "./hallenbad.json";
import park from "./park.json";
import fussballplatz from "./fußballplatz.json";

export default function SportangebotLayer() {

    const [filterOpen, setFilterOpen] = useState(false);

    const filterHallenbadByTime = () => {
        const now = new Date();
        //const now = new Date(2025, 3, 15, 23, 0, 0); // April 15, 2025, 14:00 Test Data
        const currentDay = now.toLocaleString("de-DE", { weekday: "long" }); // e.g., "Montag"
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Time in minutes since midnight
    
        return hallenbad.features.filter((feature) => {
            const oeffnungszeiten = feature.properties.oeffnungszeiten;
    
            // Wenn oeffnungszeiten kein Array ist oder nicht existiert, dann return false
            if (!oeffnungszeiten || typeof oeffnungszeiten !== "object" || !Array.isArray(oeffnungszeiten)) {
                return false;
            }
    
            // Current Day im Array oeffnungszeiten vorhanden?
            const daySchedule = oeffnungszeiten.find((entry) => entry.tag === currentDay);
            if (!daySchedule) return false;
    
            // Helper function to check if the current time is within a time range
            const isOpen = (timeRange) => {
                if (!timeRange || !timeRange.includes("–")) return false;
                try {
                    const [start, end] = timeRange.split("–").map((time) => {
                        const [hours, minutes] = time.split(":").map(Number);
                        return hours * 60 + minutes;
                    });
                    return currentTime >= start && currentTime <= end;
                } catch (error) {
                    console.error("Error parsing time range:", timeRange, error);
                    return false;
                }
            };
    
            return isOpen(daySchedule.zeit) || isOpen(daySchedule.zeit_2);
        });
    };
    //const [Layer, setLayer] = useState(true);
    const filteredHallenbad = filterOpen ? { ...hallenbad, features: filterHallenbadByTime() } : hallenbad;

    return(
        <>

        <Sidebar open={true} name={"Layers"} >    
            <button onClick={() => setFilterOpen(!filterOpen)}>
                {filterOpen ? "Alle anzeigen" : "Nur jetzt geöffnete anzeigen"}
            </button>      
            <LayerList>
                <LayerListItem
                    visible={false} 
                    type="layer"
                    name="spielplatz"
                    configurable={true}
                    layerComponent={
                        <MlGeoJsonLayer
                        geojson={spielplatz}
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
                        geojson={park}
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
                        geojson={fussballplatz}
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
        </Sidebar>
        </>
    );
}
