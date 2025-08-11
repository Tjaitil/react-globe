import { useRef, useCallback } from 'react';
import L from 'leaflet';
import type { DataPoint } from '@/types/DataPoint';

export const useGeoJsonHighlight = (map: L.Map | null) => {
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const currentPopupRef = useRef<L.Popup | null>(null);

  const setHighlight = useCallback(
    (layer: any, dataPoint: DataPoint) => {
      if (!map || !geoJsonLayerRef.current) return;

      // Clear existing popup
      if (currentPopupRef.current) {
        map.removeLayer(currentPopupRef.current);
        currentPopupRef.current = null;
      }

      // Reset styles for all layers
      geoJsonLayerRef.current.resetStyle();

      // Apply highlight style to the selected layer
      layer.setStyle({
        color: '#ff7800',
        weight: 4,
        fillOpacity: 0.8,
        fillColor: '#ffb347',
      });

      if (layer.getBounds) {
        const bounds = layer.getBounds();
        const center = bounds.getCenter();

        // Set view and close existing popups
        map.setView(center, 5);
        map.closePopup();

        // Create and show popup with data point value
        const popup = L.popup({
          closeButton: false,
          autoClose: false,
          closeOnClick: false,
          className: 'info-popup',
        })
          .setLatLng([center.lat + 0.2, center.lng + 0.3])
          .setContent(
            `
              <div style="
                color: black;
                padding: 8px 12px;
                font-size: 14px;
                font-weight: 600;
                text-align: center;
              ">
                ${dataPoint.name}<br>
                ${dataPoint.value}
              </div>
            `,
          )
          .openOn(map);

        currentPopupRef.current = popup;
      }
    },
    [map],
  );

  const setGeoJsonLayer = useCallback((layer: L.GeoJSON | null) => {
    geoJsonLayerRef.current = layer;
  }, []);

  const resetHighlight = useCallback(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.resetStyle();
    }
    if (currentPopupRef.current && map) {
      map.removeLayer(currentPopupRef.current);
      currentPopupRef.current = null;
    }
  }, [map]);

  return {
    setHighlight,
    setGeoJsonLayer,
    resetHighlight,
    geoJsonLayerRef,
  };
};
