import park from "./park.json";
import { MlGeoJsonLayer } from "@mapcomponents/react-maplibre";

export default function ParkLayer() {
    return (
        <>
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
        </>
    );
}