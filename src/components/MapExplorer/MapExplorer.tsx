import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  RiArrowLeftLine,
  RiDatabase2Line,
  RiLightbulbLine,
} from 'react-icons/ri';
import { useLeafletMap } from '@/hooks/useLeafletMap';
import { useGeoJsonHighlight } from '@/hooks/useGeoJsonHighlight';
import { DataPointComponent } from '../DataPoint/DataPointComponent';
import type { DataPoint, MarkerDataPoint } from '@/types/DataPoint';
import type { ChartConfig, GeoJsonFeature } from '@/types/ChartConfig';
import { useMarkerHighlight } from '@/hooks/useMarkerHighlight';

type MapExplorerProps = {
  onBack: () => void;
  onDataPointSelect?: (dataPoint: DataPoint) => void;
} & ChartConfig;

export const MapExplorer = (props: MapExplorerProps) => {
  const [selectedDataPoint, setSelectedDataPoint] = useState<DataPoint | null>(
    null,
  );
  const [showOverview, setShowOverview] = useState(false);

  const currentMarkerRef = useRef<L.Marker | null>(null);
  const selectedGeoLayerRef = useRef<any>(null);

  const { map, L, addGeoJsonLayer, setView } = useLeafletMap(
    'map-explorer',
    props.mapOptions,
  );

  const { setHighlight, setGeoJsonLayer, resetHighlight, geoJsonLayerRef } =
    useGeoJsonHighlight(map);

  const { setMarkerHighlight } = useMarkerHighlight(
    'markers' in props ? props.markers : [],
    map,
    setView,
  );

  const handleDataPointClick = useCallback(
    (dataPoint: DataPoint) => {
      setSelectedDataPoint(dataPoint);
      if (props.onDataPointSelect) {
        props.onDataPointSelect(dataPoint);
      }
    },
    [props.onDataPointSelect],
  );

  useEffect(() => {
    if (!map || !selectedDataPoint) return;

    if (currentMarkerRef.current) {
      currentMarkerRef.current.remove();
      currentMarkerRef.current = null;
    }

    if (props.type === 'geojson') {
      if (geoJsonLayerRef.current) {
        geoJsonLayerRef.current.eachLayer((layer: any) => {
          const feature = layer.feature;
          if (
            feature &&
            feature.properties &&
            feature.properties.id === String(selectedDataPoint.id)
          ) {
            setHighlight(layer, selectedDataPoint);
          }
        });
      }
    } else if (props.type === 'markers') {
      setMarkerHighlight(selectedDataPoint.id);
    }
  }, [selectedDataPoint, map, props.type, setHighlight]);

  const onEachFeature = useCallback(
    (feature: GeoJsonFeature, layer: any) => {
      layer.on('click', () => {
        const datapoint = findDataPointById(parseInt(feature.properties.id));
        if (!datapoint) return;

        setSelectedDataPoint(datapoint);
        if (props.onDataPointSelect) {
          props.onDataPointSelect(datapoint);
        }
      });
    },
    [props.dataPoints, props.onDataPointSelect],
  );

  const findDataPointById = useCallback(
    (id: number) => {
      return props.dataPoints.find(dataPoint => dataPoint.id === id);
    },
    [props.dataPoints],
  );

  const geoJsonLayerOptions = useMemo(() => {
    if (!('geoJsonData' in props) || !props.geoJsonData) return null;

    const geoJsonOptions =
      'geoJsonOptions' in props ? props.geoJsonOptions : {};
    return {
      ...geoJsonOptions,
      onEachFeature: onEachFeature,
    };
  }, [onEachFeature]);

  useEffect(() => {
    if (!geoJsonLayerRef.current && map && geoJsonLayerOptions) {
      const geoJsonData = 'geoJsonData' in props ? props.geoJsonData : null;

      if (geoJsonData) {
        const layer = addGeoJsonLayer(geoJsonData, geoJsonLayerOptions);
        setGeoJsonLayer(layer);
      }
    }
  }, [map, addGeoJsonLayer, geoJsonLayerOptions, props, setGeoJsonLayer]);

  useEffect(() => {
    if (!map) return;

    const markers = 'markers' in props ? props.markers : [];

    markers.forEach((marker: MarkerDataPoint) => {
      L.marker(marker.coordinates)
        .addTo(map)
        .on('click', () => {
          const datapoint = findDataPointById(marker.id);
          if (!datapoint) return;

          setSelectedDataPoint(datapoint);
          if (props.onDataPointSelect) {
            props.onDataPointSelect(marker);
          }
        });
    });
  }, [map, findDataPointById, props.onDataPointSelect]);

  const handleBackClick = () => {
    // Clean up all highlighting and markers
    resetHighlight();

    if (currentMarkerRef.current && map) {
      currentMarkerRef.current.remove();
      currentMarkerRef.current = null;
    }

    if (selectedGeoLayerRef.current) {
      selectedGeoLayerRef.current.setStyle({
        color: '#3388ff',
        weight: 3,
        fillOpacity: 0.2,
        fillColor: '#3388ff',
      });
      selectedGeoLayerRef.current = null;
    }

    setSelectedDataPoint(null);

    if (showOverview) {
      setShowOverview(false);
    } else {
      props.onBack();
    }
  };

  return (
    <div className="flex h-screen flex-row">
      <div className="w-1/3 overflow-y-auto bg-gray-800 p-4 text-white">
        {showOverview ? (
          <div>
            <div className="mb-4 flex items-center">
              <button
                onClick={handleBackClick}
                className="mr-3 flex cursor-pointer items-center text-gray-300 transition-colors hover:text-white"
              >
                <RiArrowLeftLine className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold">Chart Overview</h2>
            </div>

            <div className="space-y-2">
              <div className="rounded-lg bg-gray-700 p-4">
                <h3 className="mb-2 font-semibold">Available Charts</h3>
                <p className="text-sm text-gray-300">
                  This is where you can add different chart views and
                  visualizations.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-10">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="mr-3 flex cursor-pointer items-center text-gray-300 transition-colors hover:text-white"
              >
                <RiArrowLeftLine className="h-5 w-5" />
              </button>
              <h1 className="text-3xl font-bold">{props.title}</h1>
            </div>
            {props.ideas.length > 0 && (
              <div className="rounded-lg bg-gray-700 p-3">
                <div className="mb-3 flex items-center gap-2">
                  <RiLightbulbLine className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Ideas</h2>
                </div>
                <ul className="ml-4 list-disc">
                  {props.ideas.map((idea, index) => (
                    <li key={index} className="text-left">
                      <a
                        href={idea.url}
                        target="_blank"
                        className="text-blue-400 underline hover:text-blue-300"
                        rel="noopener noreferrer"
                      >
                        {idea.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {props.sources.length > 0 && (
              <div className="rounded-lg bg-gray-700 p-3">
                <div className="mb-3 flex items-center gap-2">
                  <RiDatabase2Line className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Sources</h2>
                </div>
                <ul className="ml-4 list-disc">
                  {props.sources.map((source, index) => (
                    <li key={index} className="text-left">
                      <a
                        href={source.url}
                        target="_blank"
                        className="text-blue-400 underline hover:text-blue-300"
                        rel="noopener noreferrer"
                      >
                        {source.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Data Points</h2>
              </div>

              <div className="space-y-2">
                {props.dataPoints.map(dataPoint => (
                  <DataPointComponent
                    key={dataPoint.id}
                    dataPoint={dataPoint}
                    onClick={handleDataPointClick}
                    isActive={selectedDataPoint?.id === dataPoint.id}
                  />
                ))}
              </div>

              {props.dataPoints.length === 0 && (
                <div className="py-8 text-center text-gray-400">
                  <p>No data points available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="relative flex-1">
        <div id="map-explorer" className="h-full w-full"></div>
      </div>
    </div>
  );
};
