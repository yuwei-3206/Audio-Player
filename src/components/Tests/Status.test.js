import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { request } from 'graphql-request';
import Status from '../Status';

jest.mock('graphql-request', () => ({
  request: jest.fn(),
}));

describe('Status component', () => {
  test('renders status correctly', async () => {
    const songData = {
        title: 'Song Title',
        artist: 'Artist Name',
        year: 2022,
      };
    request.mockResolvedValue(songData);

    const statusText = `Now Playing: ${songData.title}`;
    const isPlaying = true;
    
    // Mock event handlers
    const handlePlayPauseMock = jest.fn();
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
      expect(screen.getByText(statusText)).toBeDefined();
      expect(screen.getByRole('button', { name: /play or pause/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /previous/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /next/i })).toBeDefined();
    });
  });

  test('calls handlePlayPause when Play/Pause button is clicked', async () => {
    const handlePlayPauseMock = jest.fn();
    render(<Status status="Now Playing" isPlaying={false} handlePlayPause={handlePlayPauseMock} />);

    fireEvent.click(screen.getByRole('button', { name: /play or pause/i }));

    await waitFor(() => {
      expect(handlePlayPauseMock).toHaveBeenCalledTimes(1);
    });
  });

  test('calls handlePrev when Previous button is clicked', async () => {
    const handlePrevMock = jest.fn();
    render(<Status status="Now Playing" isPlaying={true} handlePrev={handlePrevMock} />);

    fireEvent.click(screen.getByRole('button', { name: /previous/i }));

    await waitFor(() => {
      expect(handlePrevMock).toHaveBeenCalledTimes(1);
    });
  });

  test('calls handleNext when Next button is clicked', async () => {
    const handleNextMock = jest.fn();
    render(<Status status="Now Playing" isPlaying={true} handleNext={handleNextMock} />);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(handleNextMock).toHaveBeenCalledTimes(1);
    });
  });
});
