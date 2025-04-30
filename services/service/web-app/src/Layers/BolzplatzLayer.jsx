import bolzplatz from "./bolzplatz.json";
import { MlGeoJsonLayer } from "@mapcomponents/react-maplibre";

export default function BolzplatzLayer() {
    return (
        <>
          <MlGeoJsonLayer
            geojson={bolzplatz}
            options={{
              paint: {
                  "circle-radius": 7,
                  "circle-color": "#FF0000",
                  //"circle-opacity": 0.5,
              },
            }}
            labelProp="bezeichnung"
          />
        </>
    );
}
