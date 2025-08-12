import type { ChartSource } from '@/types/ChartConfig';

export const COMMON_SOURCES: Record<
  'GEOJSONLAYER_SOURCE' | 'GEOJSON_SOURCE',
  ChartSource
> = {
  GEOJSONLAYER_SOURCE: {
    name: 'GeoJSON Layer by robhop',
    url: 'https://github.com/robhop/fylker-og-kommuner/',
  },
  GEOJSON_SOURCE: {
    name: 'GeoNorge',
    url: 'https://kartkatalog.geonorge.no/',
  },
} as const;
