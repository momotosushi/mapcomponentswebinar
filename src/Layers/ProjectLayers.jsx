import monitoringAreas from "./monitoringAreas.json";
import { 
  MlGeoJsonLayer , 
  useAddProtocol,  
  CSVProtocolHandler,
  Sidebar, 
  LayerListItem,
  LayerList
} from "@mapcomponents/react-maplibre";

export default function ProjectLayers() {

  useAddProtocol({
    protocol: "csv",
    handler: CSVProtocolHandler,
  });

  return (
    <>
      <Sidebar open={true} name={"Layers"} >          
        <LayerList>
          <LayerListItem
            visible={true}
            configurable={true}
            type="layer"
            name="Monitoring areas"
            layerComponent={
              <MlGeoJsonLayer
                geojson={monitoringAreas}  
                options={{
                  paint: {
                    "fill-color": "#5353ec",
                    "fill-opacity": 0.5,
                    "fill-outline-color": "#000",
                  },
                }}
              />
            }
          />
          <LayerListItem
            visible={true}
            type="layer"
            name="Samples"
            configurable={true}         
            layerComponent={
              <MlGeoJsonLayer
              layerId="samples"
              type="circle"
              options={{
                source: {
                  type: "geojson",
                  data: "csv://sources/samples.csv",
                },
                paint: {
                  "circle-color": "#22BB5D",
                  "circle-stroke-width": 1,
                },
              }}
              labelProp="id"
              labelOptions={{
                layout: {
                  "text-size": {
                    stops: [
                      [13, 15],
                      [22, 60],
                    ],
                  },
                },
                minzoom: 13,
              }}
              />
            }
          />
        </LayerList>  
      </Sidebar>
    </>
  );
}