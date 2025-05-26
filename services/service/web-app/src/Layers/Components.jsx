import { 
    MlGeoJsonLayer , 
    LayerListItem,
  } from "@mapcomponents/react-maplibre";

// Reusable component for LayerListItem
export const CustomLayerListItem = ({ name, geojson, color, labelProp, visible }) => (
    <LayerListItem
        visible={visible}
        type="layer"
        name={name}
        configurable={true}
        layerComponent={
            <MlGeoJsonLayer
                geojson={geojson}
                options={{
                    paint: {
                        "circle-radius": 7,
                        "circle-color": color,
                    },
                }}
                labelProp={labelProp}
            />
        }
    />
);

// Reusable component for sliders
export const Slider = ({ id, label, min, max, step, value, onChange }) => (
    <div>
        <label htmlFor={id}>{label}</label>
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
        />
    </div>
);