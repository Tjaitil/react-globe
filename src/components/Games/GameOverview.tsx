import { useState } from 'react';
import { Card } from '../BaseCard';
import CountryGuesserGame from './CountryGuesserGame/CountryGuesser';
import { RiGameLine } from 'react-icons/ri';

const games: {
  component: React.FC;
  id: number;
  title: string;
  description: string;
}[] = [
  {
    component: CountryGuesserGame,
    id: 1,
    title: 'Country Guesser',
    description: 'Guess the country based on the provided clues',
  },
];

export const GamesOverview = () => {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  const handleGameSelect = (gameId: number) => {
    setSelectedGame(gameId);
  };

  if (selectedGame) {
    const game = games.find(c => c.id === selectedGame);
    if (!game) {
      return <div>Game not found</div>;
    }

    return <game.component />;
  }
  return (
    <div>
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center">
            <RiGameLine className="mr-3 h-12 w-12 text-blue-500" />
            <h1 className="text-4xl font-bold">Game Overview</h1>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map(game => (
              <Card
                key={game.id}
                onClick={() => handleGameSelect(game.id)}
                content={
                  <div>
                    <div className="mb-4 flex items-start">
                      <RiGameLine className="mt-1 mr-3 h-8 w-8 flex-shrink-0 text-blue-500" />
                      <div>
                        <h3 className="mb-2 text-xl font-semibold">
                          {game.title}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {game.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-gray-700 pt-3">
                      <button className="w-full cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                        Explore Chart
                      </button>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
