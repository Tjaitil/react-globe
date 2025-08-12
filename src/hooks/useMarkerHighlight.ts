import type { MarkerDataPoint } from '@/types/DataPoint';
import L from 'leaflet';
import { useRef } from 'react';

export const useMarkerHighlight = (
  markers: MarkerDataPoint[],
  map: L.Map | null,
  setView: CallableFunction,
) => {
  const currentMarkerRef = useRef<L.Marker | null>(null);

  const setMarkerHighlight = (id: number) => {
    if (!map) return;
    map.closePopup();

    const marker = markers.find(marker => marker.id === id);
    if (!marker) return;
    setView(marker.coordinates, 8);

    const markerEl = L.marker(marker.coordinates).addTo(map);

    markerEl.bindPopup(marker.description || marker.name).openPopup();

    currentMarkerRef.current = markerEl;
  };

  return {
    setMarkerHighlight,
  };
};
