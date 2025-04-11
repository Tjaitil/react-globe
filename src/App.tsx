import { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';
import Globe, { GlobeMethods } from 'react-globe.gl';
import worldCountryDataset from './datasets/WorldCountryDataset.json';
import type {
  WorldCountryEntry,
  WorldCountryDataset,
} from './types/WorldCountryDataset';
import CountryGuesser from './CountryGuesser';

function App() {
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
    setDataSet(worldCountryDataset);

    setCountryNames(
      worldCountryDataset.features
        .map(d => d.properties.NAME)
        .filter((name: string) => name !== 'Antarctica'),
    );
  }, []);

  return (
    <div className="App">
      <div className="absolute top-5 left-5 z-10 h-76 w-64 rounded-lg border-2 border-gray-500 bg-gray-800 p-2 text-white">
        {
          <CountryGuesser
            countries={countryNames}
            clickedPolygon={clickedPolygon}
            resetClickedPolygon={clickedPolygon => setClickedPolygon(null)}
          />
        }
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

export default App;
