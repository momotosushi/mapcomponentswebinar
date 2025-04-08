import bolzplatz from "./bolzplatz.json";
import { MlGeoJsonLayer } from "@mapcomponents/react-maplibre";

export default function BolzplatzLayer() {
    return (
        <>
          <MlGeoJsonLayer
            geojson={bolzplatz} 
            
          />
        </>
    );
}
