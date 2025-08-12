import { useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import type { ChartConfig } from '@/types/ChartConfig';
import { FastFoodChainsAlongRoads } from './Norway/FastFoodChainsAlongRoads';
import { CountyPopulationDevelopment } from './Norway/CountyPopulationDevelopment';
import { Card } from '../BaseCard';

const charts: {
  component: React.FC;
  id: number;
  title: ChartConfig['title'];
  description: ChartConfig['description'];
}[] = [
  {
    component: FastFoodChainsAlongRoads,
    id: 1,
    title: 'Fast Food Chains in Norway',
    description: 'Explore the distribution of fast food chains across Norway',
  },
  {
    component: CountyPopulationDevelopment,
    id: 2,
    title: 'County Population Development in Norway',
    description: 'Explore the population development across Norwegian counties',
  },
];

export const ChartOverview = () => {
  const [selectedChart, setSelectedChart] = useState<number | null>(null);

  const handleChartSelect = (chartId: number) => {
    setSelectedChart(chartId);
  };

  if (selectedChart) {
    const chart = charts.find(c => c.id === selectedChart);
    if (!chart) {
      return <div>Chart not found</div>;
    }

    return <chart.component />;
  }

  return (
    <div>
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center">
            <ChartBarIcon className="mr-3 h-12 w-12 text-blue-500" />
            <h1 className="text-4xl font-bold">Chart Overview</h1>
          </div>
          <p className="text-lg text-gray-300">
            Explore various data visualizations and interactive maps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {charts.map(chart => (
            <Card
              key={chart.id}
              onClick={() => handleChartSelect(chart.id)}
              content={
                <div>
                  <div className="mb-4 flex items-start">
                    <ChartBarIcon className="mt-1 mr-3 h-8 w-8 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        {chart.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {chart.description}
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
  );
};
