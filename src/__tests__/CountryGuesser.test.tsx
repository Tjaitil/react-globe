import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryGuesser from '@/components/Games/CountryGuesserGame/CountryGuesserControls';
import { describe, test, expect, beforeEach } from 'vitest';
import type { WorldCountryEntry } from '@/types/WorldCountryDataset';
import worldcountryDataset from '@/datasets/WorldCountryDataset.json';

const mockCountries = ['Norway', 'Sweden', 'Denmark'];
const mockedCountryPolygons = worldcountryDataset.features
  .filter((country: WorldCountryEntry) =>
    mockCountries.includes(country.properties.NAME),
  )
  .sort(
    (a: WorldCountryEntry, b: WorldCountryEntry) =>
      mockCountries.indexOf(a.properties.NAME) -
      mockCountries.indexOf(b.properties.NAME),
  );
const mockResetClickedPolygon = vi.fn();

const setup = () => {
  return render(
    <CountryGuesser
      countries={mockCountries}
      clickedPolygon={null}
      resetClickedPolygon={mockResetClickedPolygon}
    />,
  );
};

describe('CountryGuesser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render without crashing', () => {
    setup();
    expect(screen.getByText('Country Guesser')).toBeInTheDocument();
  });

  test('should start the quiz when the start button is clicked', () => {
    setup();
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    expect(screen.getByText(/Click on/)).toBeInTheDocument();
  });

  test('should reset the clicked polygon when reset is called', () => {
    setup();
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);

    // Simulate resetting the game
    const resetButton = screen.getByText('Quit');
    fireEvent.click(resetButton);

    expect(mockResetClickedPolygon).toHaveBeenCalledWith(null);
    expect(screen.getByText('Start')).toBeInTheDocument();
  });
});
