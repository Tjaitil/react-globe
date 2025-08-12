import { useState, useEffect } from 'react';
import { ChartOverview } from '../ChartOverview';
import { MapExplorer } from '@/components/MapExplorer/MapExplorer';
import type { ChartConfig } from '@/types/ChartConfig';
import norwayGeoJsonData from '@/datasets/NorwayCountiesDataset.json';
import csvData from '@/datasets/NorwayPopulation.csv?raw';
import { mapCSV } from '@/utils/mapCsv';
import { DataPointBadge } from '@/components/DataPoint/DataPointBadge';
import { COMMON_SOURCES } from '@/constants/sources';

interface PopulationData {
  countyId: string;
  countyName: string;
  populationHistory: Array<{
    year: number;
    population: number;
  }>;
}

type Schema = {
  region: string;
  'Hovedalternativet (MMMM) 2024': number;
  'Hovedalternativet (MMMM) 2050': number;
};

const chartConfig: ChartConfig = {
  id: 'county-population-development',
  title: 'County Population Development in Norway',
  description:
    'Explore population development trends across Norwegian counties over time',
  type: 'geojson',
  geoJsonData: norwayGeoJsonData,
  geoJsonOptions: {
    style: feature => {
      return {
        color: feature?.properties.color || '#3388ff',
        weight: 2,
        fillOpacity: 0.5,
      };
    },
  },
  dataPoints: [],
  ideas: [],
  sources: [
    {
      name: 'Statistics Norway (SSB) - Population Statistics',
      url: 'https://www.ssb.no/befolkning',
    },
    COMMON_SOURCES.GEOJSONLAYER_SOURCE,
    COMMON_SOURCES.GEOJSON_SOURCE,
  ],
  mapOptions: {
    center: [65.0, 15.0],
    zoom: 5,
    maxZoom: 10,
  },
};

export const CountyPopulationDevelopment = () => {
  const [showMap, setShowMap] = useState(true);
  const [populationData, setPopulationData] = useState<PopulationData[] | null>(
    null,
  );
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBackToOverview = () => {
    setShowMap(false);
  };

  const fetchPopulationData = async (): Promise<PopulationData[]> => {
    setLoading(true);
    setError(null);

    try {
      const CSVData = mapCSV(csvData);

      const isValidDataset = (data: object[]): data is Schema[] => {
        return data.every(
          row =>
            'region' in row &&
            'Hovedalternativet (MMMM) 2024' in row &&
            'Hovedalternativet (MMMM) 2050' in row,
        );
      };

      if (!isValidDataset(CSVData)) {
        throw new Error('Invalid dataset format');
      }

      const populationData: PopulationData[] = CSVData.map(row => ({
        countyId: row.region.split(' ')[0],
        countyName: row.region.split(' ').slice(1).join(' '),
        populationHistory: [
          {
            year: 2024,
            population: row['Hovedalternativet (MMMM) 2024'],
          },
          {
            year: 2050,
            population: row['Hovedalternativet (MMMM) 2050'],
          },
        ],
      }));
      setPopulationData(populationData);

      chartConfig.dataPoints = CSVData.map(item => {
        let countyId = parseInt(item.region.slice(1, 3));
        let regionName = item.region.slice(3, item.region.length - 1).trim();
        let percentageChange =
          ((item['Hovedalternativet (MMMM) 2050'] -
            item['Hovedalternativet (MMMM) 2024']) /
            item['Hovedalternativet (MMMM) 2024']) *
          100;
        let value = parseFloat(percentageChange.toFixed(2)) + '%';

        return {
          id: countyId,
          name: regionName,
          value,
          children: (
            <>
              <h3 className="text-lg">{regionName}</h3>
              <div className="flex w-full flex-1 flex-row items-center justify-between">
                <p className="line-clamp-2 text-xs opacity-80">
                  Increase from 2024 to 2050
                </p>
                <DataPointBadge value={value} />
              </div>
            </>
          ),
        };
      });

      return populationData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch population data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load the population data when component mounts
    fetchPopulationData().catch(err => {
      console.warn('Failed to load initial population data:', err);
    });
  }, []);

  if (!showMap) {
    return <ChartOverview />;
  }

  return (
    <div>
      {isLoading && (
        <div
          style={{ padding: '10px', background: '#f0f0f0', margin: '10px 0' }}
        >
          Loading population data...
        </div>
      )}
      {error && !isLoading ? (
        <div
          style={{
            padding: '10px',
            background: '#ffe6e6',
            color: '#d00',
            margin: '10px 0',
          }}
        >
          Error
        </div>
      ) : (
        <MapExplorer
          type={chartConfig.type}
          id={chartConfig.id}
          title={chartConfig.title}
          description={chartConfig.description}
          geoJsonOptions={chartConfig.geoJsonOptions}
          geoJsonData={chartConfig.geoJsonData}
          dataPoints={chartConfig.dataPoints}
          ideas={chartConfig.ideas}
          sources={chartConfig.sources}
          onBack={handleBackToOverview}
          mapOptions={chartConfig.mapOptions}
        />
      )}
    </div>
  );
};
