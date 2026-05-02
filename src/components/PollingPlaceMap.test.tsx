import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PollingPlaceMap from './PollingPlaceMap';
import { vi } from 'vitest';

// Mock the third-party component
vi.mock('@next/third-parties/google', () => ({
  GoogleMapsEmbed: ({ center, onLoad }: any) => {
    // Trigger onLoad immediately for tests
    setTimeout(() => onLoad(), 0);
    return <div data-testid="google-maps-embed">Map at {center}</div>;
  }
}));

describe('PollingPlaceMap', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', 'AIzaSy_TEST_KEY_LONG_ENOUGH');
    vi.clearAllMocks();
    // Mock geolocation
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) => {
        // Delay to allow "Locating..." state to be visible
        setTimeout(() => success({
          coords: {
            latitude: 34.0522,
            longitude: -118.2437,
          },
        }), 10);
      }),
    };
    (global as any).navigator.geolocation = mockGeolocation;
  });


  it('renders the initial state', () => {
    render(<PollingPlaceMap />);
    expect(screen.getByText('Find Your Polling Place')).toBeInTheDocument();
  });

  it('shows the map after clicking locate', async () => {
    render(<PollingPlaceMap />);
    
    const locateBtn = screen.getByText(/Use My Location/i);
    fireEvent.click(locateBtn);

    expect(screen.getByText(/Locating…/i)).toBeInTheDocument();

    
    await waitFor(() => {
      expect(screen.getByTestId('google-maps-embed')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/34.0522, -118.2437/i)).toBeInTheDocument();
  });

  it('shows error state when geolocation fails', async () => {
    (global as any).navigator.geolocation.getCurrentPosition = vi.fn().mockImplementation((success, error) => error());
    
    render(<PollingPlaceMap />);
    fireEvent.click(screen.getByText(/Use My Location/i));

    await waitFor(() => {
      expect(screen.getByText('Location Unavailable')).toBeInTheDocument();
    });
  });
});
