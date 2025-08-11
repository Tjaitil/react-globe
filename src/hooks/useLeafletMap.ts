import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface UseLeafletMapOptions {
  center?: [number, number];
  zoom?: number;
  maxZoom?: number;
  tileLayerUrl?: string;
  attribution?: string;
  zoomControlPosition?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
}

export const useLeafletMap = (
  mapElementId: string,
  options: UseLeafletMapOptions = {},
) => {
  const mapRef = useRef<L.Map | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  const {
    center = [59.95, 10.75],
    zoom = 6,
    maxZoom = 5,
    tileLayerUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    zoomControlPosition = 'topright',
  } = options;

  useEffect(() => {
    const mapElement = document.getElementById(mapElementId);

    if (mapElement && !mapRef.current) {
      const leafletMap = L.map(mapElementId).setView(center, zoom);

      L.tileLayer(tileLayerUrl, {
        maxZoom,
        attribution,
      }).addTo(leafletMap);

      leafletMap.zoomControl.setPosition(zoomControlPosition);

      mapRef.current = leafletMap;
      setMap(leafletMap);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMap(null);
      }
    };
  }, [
    mapElementId,
    center,
    zoom,
    maxZoom,
    tileLayerUrl,
    attribution,
    zoomControlPosition,
  ]);

  return {
    map,
    L,

    addGeoJsonLayer: (geoJsonData: any, options?: L.GeoJSONOptions) => {
      if (mapRef.current) {
        return L.geoJson(geoJsonData, options).addTo(mapRef.current);
      }
      return null;
    },

    addMarker: (coordinates: [number, number], options?: L.MarkerOptions) => {
      if (mapRef.current) {
        return L.marker(coordinates, options).addTo(mapRef.current);
      }
      return null;
    },

    setView: (center: [number, number], zoom?: number) => {
      if (mapRef.current) {
        mapRef.current.setView(center, zoom);
      }
    },
  };
};
