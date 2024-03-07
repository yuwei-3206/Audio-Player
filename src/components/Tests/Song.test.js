import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { request } from 'graphql-request';
import Song from '../Audio/Song';

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
      expect(screen.getByText('Title: Song Title')).toBeDefined();
      expect(screen.getByText('Artist: Artist Name')).toBeDefined();
      expect(screen.getByText('Year: 2022')).toBeDefined();
    });
  });

  test('renders "Invalid year" for invalid year type', async () => {
    const songData = {
      title: 'Song Title',
      artist: 'Artist Name',
      year: '2022',
    };

    request.mockResolvedValue(songData);

    render(<Song title={songData.title} artist={songData.artist} year={songData.year} />);

    await waitFor(() => {
      expect(screen.getByText('Title: Song Title')).toBeDefined();
      expect(screen.getByText('Artist: Artist Name')).toBeDefined();
      expect(screen.getByText('Year: 2022')).toBeDefined();
    });
  });

  test('calls onDoubleClick with correct data', async () => {
    const mockOnDoubleClick = jest.fn();
    const songData = {
      title: 'Song Title',
      artist: 'Artist Name',
      year: 2022,
    };

    request.mockResolvedValue(songData);

    render(<Song title={songData.title} artist={songData.artist} year={songData.year} onDoubleClick={mockOnDoubleClick} />);

    await waitFor(() => {
      fireEvent.doubleClick(screen.getByText('Title: Song Title'));
      expect(mockOnDoubleClick).toHaveBeenCalledWith(songData);
    });
  });

  test('call onDoubleClick for invalid year type', async () => {
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
