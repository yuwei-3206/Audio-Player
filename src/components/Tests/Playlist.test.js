import React from 'react';
import { render, fireEvent, screen, waitFor, cleanup } from '@testing-library/react';
import { request } from 'graphql-request';
import Playlist from '../Playlist';

afterEach(cleanup);

jest.mock('graphql-request', () => ({
    request: jest.fn(),
}));

describe('Playlist component', () => {
    const audioData = [{
        artist: 'Artist A',
        year: 2024,
        title: 'Song Title A',
        genre: 'Genre'
    },{
        artist: 'Artist B',
        year: 2023,
        title: 'Song Title B'
    },{
        season: 1,
        episode: 1,
        episodeTitle: 'Episode Title A'
    },{
        episode: 2,
        episodeTitle: 'Episode Title B'
    },{
        podcast: 3,
        episodeTitle: 'Episode Title C'
    },{
        season: 4,
        episode: 4,
        episodeTitle: 'Episode Title D',
        year: 2022
    }];

    request.mockImplementation(() => Promise.resolve({ data: audioData }));

    test('renders audio correctly', async () => {
        // Increase the timeout to 10000 milliseconds (10 seconds)
        jest.setTimeout(10000);
    
        render(<Playlist />);
    
        await waitFor(() => {
            // Check song rendering
            expect(screen.findByText('Title: Song Title A')).toBeTruthy();
            expect(screen.findByText('Artist: Artist A')).toBeTruthy();
            expect(screen.findByText('Year: 2024')).toBeTruthy();
            expect(screen.queryByText('Genre: Genre')).toBeNull();

            // Check podcast rendering
            expect(screen.findByText('Season: 1')).toBeTruthy();
            expect(screen.findByText('Episode: 1')).toBeTruthy();
            expect(screen.findByText('Episode Title: Episode Title A')).toBeTruthy();
            expect(screen.findByText('Season: 4')).toBeTruthy();
            expect(screen.findByText('Episode: 2')).toBeTruthy();
            expect(screen.findByText('Episode Title: Episode Title C')).toBeTruthy();
            expect(screen.queryByText('Podcast: 3')).toBeNull();
            expect(screen.queryByText('Year: 2022')).toBeNull();
        });
    });

    const currentPlaying = audioData[1];
    const expectedStatusText = `Now Playing: ${currentPlaying.title || currentPlaying.episodeTitle}`;

    test('click playPauseBtn with correct data', async () => {
        render(<Playlist />);

        // Check if status shows as expected
        await waitFor(() => {
            expect(screen.findByText(expectedStatusText)).toBeTruthy();
        });

        // Click on play/pause button
        fireEvent.click(screen.getByTestId('playPauseBtn'));

        //Check if the text changed
        await waitFor(() => {
            expect(screen.findByText('Paused')).toBeTruthy();
        });

        // Click on play/pause button
        fireEvent.click(screen.getByTestId('playPauseBtn'));

        //Check if the text changed
        await waitFor(() => {
            expect(screen.findByText(expectedStatusText)).toBeTruthy();
        });
    });

    test('click nextBtn to play the next item', async () => {
        render(<Playlist />);

        // Click on next button
        fireEvent.click(screen.getByTestId('nextBtn'));
    
        // Set the next data as the current playing item after clicking on next button
        const nextPlaying = audioData[1 + 1];
    
        // Expected status text after clicking on next button
        const expectedNextStatusText = `Now Playing: ${nextPlaying.title || nextPlaying.episodeTitle}`;
    
        // Check if status shows as expected after clicking on next button
        await waitFor(() => {
            expect(screen.findByText(expectedNextStatusText)).toBeTruthy();
        });
    });

    test('click prevBtn to play the previous item', async () => {
        render(<Playlist />);

        // Click on prev button
        fireEvent.click(screen.getByTestId('prevBtn'));
    
        // Set the previous data as the current playing item after clicking on prev button
        const prevPlaying = audioData[1 - 1];
    
        // Expected status text after clicking on prev button
        const expectedPrevStatusText = `Now Playing: ${prevPlaying.title || prevPlaying.episodeTitle}`;
    
        // Check if status shows as expected after clicking on prev button
        await waitFor(() => {
            expect(screen.findByText(expectedPrevStatusText)).toBeTruthy();
        });
    });

});
