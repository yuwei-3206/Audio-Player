import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { request } from 'graphql-request';
import Podcast from '../Audio/Podcast';

jest.mock('graphql-request', () => ({
  request: jest.fn(),
}));

describe('Podcast component', () => {
  test('renders correctly with valid data', async () => {
    const podcastData = {
      season: 1,
      episode: 1,
      episodeTitle: 'Episode Title',
    };

    request.mockResolvedValue(podcastData);

    render(<Podcast season={podcastData.season} episode={podcastData.episode} episodeTitle={podcastData.episodeTitle} />);

    await waitFor(() => {
        expect(screen.getByText('Season: 1')).toBeDefined();
        expect(screen.getByText('Episode: 1')).toBeDefined();
        expect(screen.getByText('Episode Title: Episode Title')).toBeDefined();
    });
  });

  test('renders correctly when season attribute is missing', async () => {
    const podcastData = {
      episode: 1,
      episodeTitle: 'Episode Title',
    };

    request.mockResolvedValue(podcastData);

    render(<Podcast episode={podcastData.episode} episodeTitle={podcastData.episodeTitle} />);

    await waitFor(() => {
        expect(screen.queryByText('Season:')).toBeNull();
        expect(screen.getByText('Episode: 1')).toBeDefined();
        expect(screen.getByText('Episode Title: Episode Title')).toBeDefined();
    });
  });

  test('renders correctly when season and episode attribute are missing', async () => {
    const podcastData = {
      episodeTitle: 'Episode Title',
    };

    request.mockResolvedValue(podcastData);

    render(<Podcast episode={podcastData.episode} episodeTitle={podcastData.episodeTitle} />);

    await waitFor(() => {
        expect(screen.queryByText('Season:')).toBeNull();
        expect(screen.queryByText('Episode:')).toBeNull();
        expect(screen.getByText('Episode Title: Episode Title')).toBeDefined();
    });
  });

  test('calls onDoubleClick with correct data', async () => {
    const mockOnDoubleClick = jest.fn();
    const podcastData = {
      season: 1,
      episode: 1,
      episodeTitle: 'Episode Title',
    };

    request.mockResolvedValue(podcastData);

    render(<Podcast season={podcastData.season} episode={podcastData.episode} episodeTitle={podcastData.episodeTitle} onDoubleClick={mockOnDoubleClick} />);

    await waitFor(() => {
      fireEvent.doubleClick(screen.getByText('Season: 1'));
        expect(mockOnDoubleClick).toHaveBeenCalledWith(podcastData);
    });
  });
});
