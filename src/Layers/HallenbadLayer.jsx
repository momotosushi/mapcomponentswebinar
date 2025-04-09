import hallenbad from "./hallenbad.json";
import { MlGeoJsonLayer } from "@mapcomponents/react-maplibre";

export default function HallenbadLayer() {
    return (
        <>
          <MlGeoJsonLayer
            geojson={hallenbad}
            options={{
              paint: {
                  "circle-radius": 7,
              },
              }}
              labelProp="name"
          />
        </>
    );
}