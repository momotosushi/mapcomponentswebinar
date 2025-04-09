import "./App.css";
import { MapLibreMap } from "@mapcomponents/react-maplibre";
//import ProjectLayers from "./Layers/ProjectLayers";
//import OSMLayer from "./Layers/OSMLayer";
import SportangebotLayer from "./Layers/SportangebotLayer";

function App() {
  return (
    <>
      <MapLibreMap
        options={{
          style: "https://wms.wheregroup.com/tileserver/style/osm-bright.json",
          zoom: 12,
          center:[  7.100000, 50.733334]
        }}
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
      />
      <SportangebotLayer />
    </>
  );
}
export default App;