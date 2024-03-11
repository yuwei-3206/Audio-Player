import React from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import Status from '../Status';

afterEach(cleanup);

describe('Status component', () => {
  test('renders status correctly', async () => {
    const audioData = {
      title: 'Title A',
      artist: 'Artist A',
      year: 2022,
    };
  
    let isPlaying = false;

    const statusText = isPlaying ? "Paused" : `Now Playing: ${audioData.title}`;
    
    // Mock event handlers
    const handlePlayPauseMock = jest.fn(() => {
      isPlaying = !isPlaying;
    });
    const handlePrevMock = jest.fn();
    const handleNextMock = jest.fn();
    
    render(
      <Status
        status={statusText}
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPauseMock}
        handlePrev={handlePrevMock}
        handleNext={handleNextMock}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(statusText)).toBeTruthy();
    });

    // Click Play/Pause button
    fireEvent.click(screen.getByTestId('playPauseBtn'));

    // Check if statusText changes according to the new state
    await waitFor(() => {
      const expectedStatusText = !isPlaying ? "Paused" : `Now Playing: ${audioData.title}`;
      expect(screen.getByText(expectedStatusText)).toBeTruthy();
    });
  });

  test('calls handlePlayPause when Play/Pause button is clicked', async () => {
    const handlePlayPauseMock = jest.fn();
    render(<Status status="Now Playing" isPlaying={false} handlePlayPause={handlePlayPauseMock} />);

    fireEvent.click(screen.getByTestId('playPauseBtn'));

    await waitFor(() => {
      expect(handlePlayPauseMock).toHaveBeenCalledTimes(1);
    });
  });

  test('calls handlePrev when Previous button is clicked', async () => {
    const handlePrevMock = jest.fn();
    render(<Status status="Now Playing" isPlaying={true} handlePrev={handlePrevMock} />);

    fireEvent.click(screen.getByTestId('prevBtn'));

    await waitFor(() => {
      expect(handlePrevMock).toHaveBeenCalledTimes(1);
    });
  });

  test('calls handleNext when Next button is clicked', async () => {
    const handleNextMock = jest.fn();
    render(<Status status="Now Playing" isPlaying={true} handleNext={handleNextMock} />);

    fireEvent.click(screen.getByTestId('nextBtn'));

    await waitFor(() => {
      expect(handleNextMock).toHaveBeenCalledTimes(1);
    });
  });
});
