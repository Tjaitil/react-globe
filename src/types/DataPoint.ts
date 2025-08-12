export type DataPoint = {
  id: number;
  name: string;
  coordinates?: [number, number];
  [key: string]: any;
  value?: number | string;
  description?: string;
  children?: React.ReactNode;
};

export interface MarkerDataPoint {
  id: number;
  name: string;
  coordinates: [number, number];
  description?: string;
  imageUrl: 'https://corporate.mcdonalds.com/content/dam/sites/corp/nfl/newsroom/Golden%20Arches.png';
}
