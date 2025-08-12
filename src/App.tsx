import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { ChartOverview, GamesOverview } from './components';
import { Button } from '@headlessui/react';
import { RiArrowLeftLine, RiMapPin2Line, RiGameLine } from 'react-icons/ri';
import { getButtonClasses } from './utils/theme';

function App() {
  const [currentMap, setCurrentMap] = useState<'map-charts' | 'games' | null>(
    null,
  );

  return (
    <div className="App min-h-screen bg-gray-900 text-white">
      {currentMap === 'map-charts' ? (
        <>
          <Button
            onClick={() => setCurrentMap(null)}
            className={getButtonClasses('transparent')}
          >
            Home
          </Button>
          <ChartOverview />
        </>
      ) : currentMap === 'games' ? (
        <>
          <Button
            onClick={() => setCurrentMap(null)}
            className={getButtonClasses('transparent')}
          >
            Home
          </Button>
          <GamesOverview />
        </>
      ) : (
        <div className="flex h-screen w-full flex-row items-center justify-center bg-gray-900">
          <div className="z-[1000] h-76 w-1/5 rounded-lg border-2 border-gray-500 bg-gray-800 p-2 text-white">
            <div>
              <h1 className="mb-4 text-3xl text-white">Select mode</h1>
              <div className="space-y-2">
                <Button
                  onClick={() => setCurrentMap('map-charts')}
                  className={getButtonClasses('primary', 'lg', true, 'gap-3')}
                >
                  <RiMapPin2Line className="h-5 w-5" />
                  Map Charts
                </Button>
                <Button
                  onClick={() => setCurrentMap('games')}
                  className={getButtonClasses('primary', 'lg', true, 'gap-3')}
                >
                  <RiGameLine className="h-5 w-5" />
                  Games
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
