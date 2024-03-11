import React from 'react';
import { fireEvent, render, waitFor, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { request } from 'graphql-request';
import Song from '../Audio/Song';

afterEach(cleanup);

jest.mock('graphql-request', () => ({
  request: jest.fn(),
}));

describe('Song component', () => {
  test('renders correctly with valid data', async () => {
    const songData = {
      title: 'Song Title',
      artist: 'Artist Name',
      year: 2022,
    };

    request.mockResolvedValue(songData);

    render(<Song title={songData.title} artist={songData.artist} year={songData.year} />);

    await waitFor(() => {
      expect(screen.getByText('Title: Song Title')).toBeTruthy();
      expect(screen.getByText('Artist: Artist Name')).toBeTruthy();
      expect(screen.getByText('Year: 2022')).toBeTruthy();
    });
  });

  test('renders year for string data type', async () => {
    const songData = {
      title: 'Song Title',
      artist: 'Artist Name',
      year: '2025',
    };

    request.mockResolvedValue(songData);

    render(<Song title={songData.title} artist={songData.artist} year={songData.year} />);

    await waitFor(() => {
      expect(screen.getByText('Title: Song Title')).toBeTruthy();
      expect(screen.getByText('Artist: Artist Name')).toBeTruthy();
      expect(screen.getByText('Year: 2025')).toBeTruthy();
    });
  });

  test('renders correctly with negative data', async () => {
    const songData = {
      title: 'Song Title',
      artist: 'Artist Name',
      year: -2021,
    };

    request.mockResolvedValue(songData);

    render(<Song title={songData.title} artist={songData.artist} year={songData.year} />);

    await waitFor(() => {
      expect(screen.getByText('Title: Song Title')).toBeTruthy();
      expect(screen.getByText('Artist: Artist Name')).toBeTruthy();
      expect(screen.getByText('Year: 2021')).toBeTruthy();
    });
  });

  test('renders correctly with negative and unusual data', async () => {
    const songData = {
      title: 'Song Title',
      artist: 'Artist Name',
      year: -520,
    };

    request.mockResolvedValue(songData);

    render(<Song title={songData.title} artist={songData.artist} year={songData.year} />);

    await waitFor(() => {
      expect(screen.getByText('Title: Song Title')).toBeTruthy();
      expect(screen.getByText('Artist: Artist Name')).toBeTruthy();
      expect(screen.getByText('Year: Unknown')).toBeTruthy();
    });
  });

  test('calls onDoubleClick with correct data', async () => {
    const mockOnDoubleClick = jest.fn();
    const songData = {
      title: 'Song Title',
      artist: 'Artist Name',
      year: 2023,
    };

    request.mockResolvedValue(songData);

    render(<Song title={songData.title} artist={songData.artist} year={songData.year} onDoubleClick={mockOnDoubleClick} />);

    await waitFor(() => {
      fireEvent.doubleClick(screen.getByText('Title: Song Title'));
      expect(mockOnDoubleClick).toHaveBeenCalledWith(songData);
    });
  });

  test('call onDoubleClick for all string data type', async () => {
    const mockOnDoubleClick = jest.fn();
    const songData = {
      title: 'Song Title',
      artist: 'Artist Name',
      year: '2022',
    };

    request.mockResolvedValue(songData);

    render(<Song title={songData.title} artist={songData.artist} year={songData.year} onDoubleClick={mockOnDoubleClick} />);

    await waitFor(() => {
        fireEvent.doubleClick(screen.getByText('Title: Song Title'));
        expect(mockOnDoubleClick).toHaveBeenCalledWith(songData);
    });
  });
});
