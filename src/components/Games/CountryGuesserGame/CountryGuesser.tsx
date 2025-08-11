import { useEffect, useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import worldCountryDataset from '@/datasets/WorldCountryDataset.json';
import type {
  WorldCountryEntry,
  WorldCountryDataset,
} from '@/types/WorldCountryDataset';
import CountryGuesserControls from './CountryGuesserControls';

export default function CountryGuesserGame() {
  const [dataset, setDataSet] = useState<WorldCountryDataset>({
    type: 'FeatureCollection',
    features: [],
  });
  const [countryNames, setCountryNames] = useState<string[]>([]);
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [hoveredPolygon, setHoveredPolygon] = useState<object | null>();
  const [clickedPolygon, setClickedPolygon] =
    useState<WorldCountryEntry | null>(null);

  const handlePolygonClick = (polygon: object | null) => {
    if (!polygon) {
      return;
    }

    let obj = polygon as WorldCountryEntry;

    setClickedPolygon(obj);
  };

  const onPolygonHover = useCallback((polygon: object | null) => {
    setHoveredPolygon(polygon);
  }, []);

  useEffect(() => {
    setCountryNames(
      worldCountryDataset.features
        .map(d => d.properties.NAME)
        .filter((name: string) => name && name !== 'Antarctica'),
    );
    setDataSet(worldCountryDataset as WorldCountryDataset);
  }, []);

  return (
    <div className="App">
      <div className="flex flex-row">
        <div className="absolute top-15 z-[1000] h-76 w-1/5 rounded-lg border-2 border-gray-500 bg-gray-800 p-2 text-white">
          {
            <CountryGuesserControls
              countries={countryNames}
              clickedPolygon={clickedPolygon}
              resetClickedPolygon={() => setClickedPolygon(null)}
            />
          }
        </div>
      </div>
      <Globe
        ref={globeEl}
        backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe@2.42.3/example/img/earth-day.jpg"
        animateIn={true}
        polygonsData={dataset.features.filter(
          d => d.properties.ISO_A2 !== 'AQ',
        )}
        polygonAltitude={0.00415}
        polygonStrokeColor={() => 'black'}
        polygonSideColor={() => 'black'}
        polygonCapColor={d =>
          d === hoveredPolygon ? '#78716c' : 'transparent'
        }
        onPolygonHover={onPolygonHover}
        onPolygonClick={polygon => handlePolygonClick(polygon)}
        polygonsTransitionDuration={300}
      />

      <p className="copyright ml-2">
        Globe component, countries dataset and assets provided by&nbsp;
        <a
          href="https://githupb.com/vasturiano/react-globe.gl"
          className="underline"
        >
          React globe-gl
        </a>
      </p>
    </div>
  );
}
