import type { GeoJSONOptions } from 'leaflet';
import type { DataPoint, MarkerDataPoint } from './DataPoint';

export interface ChartIdea {
  name: string;
  url?: string;
}

export interface ChartSource {
  name: string;
  url: string;
}

export interface GeoJsonDataset {
  type: 'geojson';
  features: { type: 'Feature'; properties: FeatureProperties }[];
}

export type GeoJsonFeature = {
  type: string;
  properties: FeatureProperties;
};
export type FeatureProperties = {
  [key: string]: any;
  id: string;
};

export type ChartConfig = {
  id: string;
  title: string;
  description: string;
  ideas: ChartIdea[];
  sources: ChartSource[];
  mapOptions?: {
    center: [number, number];
    zoom: number;
    maxZoom?: number;
  };
  dataPoints: DataPoint[];
} & (
  | {
      type: 'geojson';
      geoJsonData: {
        type: string;
        features: GeoJsonFeature[];
      };
      geoJsonOptions: GeoJSONOptions;
    }
  | { type: 'markers'; markers: MarkerDataPoint[] }
);
