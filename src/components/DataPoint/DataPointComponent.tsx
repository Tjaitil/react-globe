import { forwardRef, useEffect, useRef } from 'react';
import type { DataPoint } from '@/types/DataPoint';

interface DataPointComponentProps {
  dataPoint: DataPoint;
  onClick: (dataPoint: DataPoint) => void;
  isActive?: boolean;
}

export const DataPointComponent = forwardRef<
  HTMLButtonElement,
  DataPointComponentProps
>(({ dataPoint, onClick, isActive = false }, ref) => {
  const internalRef = useRef<HTMLButtonElement>(null);
  const buttonRef = ref || internalRef;

  useEffect(() => {
    if (isActive && buttonRef && 'current' in buttonRef && buttonRef.current) {
      const element = buttonRef.current;
      const container = element.closest('.overflow-y-auto');

      if (container) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const isOutOfView =
          elementRect.top < containerRect.top ||
          elementRect.bottom > containerRect.bottom;

        if (isOutOfView) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start',
          });
        }
      }
    }
  }, [isActive, buttonRef]);

  return (
    <button
      ref={buttonRef}
      onClick={() => onClick(dataPoint)}
      className={`mb-2 w-full rounded-lg border p-3 text-left transition-all duration-200 hover:scale-105 ${
        isActive
          ? 'border-blue-400 bg-blue-600 text-white shadow-lg'
          : 'border-gray-600 bg-gray-700 text-gray-200 hover:border-gray-500 hover:bg-gray-600'
      } `}
    >
      <div className="flex cursor-pointer flex-col items-start justify-between">
        {dataPoint.children ? (
          dataPoint.children
        ) : (
          <>
            <h3 className="mb-1 text-sm font-semibold">{dataPoint.name}</h3>
            <div className="flex w-full flex-1 flex-row items-center justify-between">
              {dataPoint.description && (
                <p className="text-md line-clamp-2 opacity-80">
                  {dataPoint.description}
                </p>
              )}
              {dataPoint.value && (
                <span className="rounded bg-gray-600 px-2 py-1 text-xs">
                  {dataPoint.value}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </button>
  );
});
