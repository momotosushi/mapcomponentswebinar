export const convertGeomToGeoJSON = (geom) => {
        if (!geom) return null;
        const match = geom.match(/POINT\s*\(([^)]+)\)/);
        if (!match) return null;
        const [lng, lat] = match[1].split(" ").map(Number);
        return { type: "Point", coordinates: [lng, lat] };
    };