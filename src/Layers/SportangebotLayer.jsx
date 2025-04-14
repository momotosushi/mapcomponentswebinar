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

export default function SportangebotLayer() {

    const [Layer, setLayer] = useState(true);

    return(
        <>

        <Sidebar open={true} name={"Layers"} >          
            <LayerList>
                <LayerListItem
                    visible={true}
                    configurable={true}
                    type="layer"
                    name="spielplatz"
                    layerComponent={
                        <MlGeoJsonLayer
                        geojson={spielplatz}
                        options={{
                        paint: {
                            "circle-radius": 7,
                            "circle-color": "#FF0000",
                        },
                        }}
                        labelProp="bezeichnung"
                        />  
                    }
                />
                <LayerListItem
                    visible={true}
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
                        geojson={hallenbad}
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
                
            </LayerList>  
        </Sidebar>
        </>
    );
}
