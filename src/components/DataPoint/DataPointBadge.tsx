import type { DataPoint } from '@/types/DataPoint';

interface DataPointBadgeProps {
  value: DataPoint['value'];
}

export const DataPointBadge = ({ value }: DataPointBadgeProps) => {
  return <span className="rounded bg-gray-600 px-2 py-1 text-xs">{value}</span>;
};
