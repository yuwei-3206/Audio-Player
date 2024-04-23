# Audio Player
This project is an audio player built with React. It allows users to play songs and podcasts from a playlist.
The application includes features like play/pause, previous track, next track, shuffle, and track length functionalities.
It's designed for larger screens and may not be optimized for mobile devices.
Link: https://yuwei-3206.github.io/Audio-Player/

Author: Yu-Wei Wu
Date: March 2024

# State Management
- Utilizes React's useState hook for managing state variables such as playlist, status, playing status, and current track index.
- Manages the playing status (isPlaying) to control the play/pause functionality.

# Functionality
- Fetches the playlist data from an external JSON file using the Fetch API.
- Implements play/pause functionality with playTrack(), handlePlayPause() functions.
- Enables users to navigate between tracks with previous (handlePrev()) and next (handleNext()) buttons.
- Implements shuffle functionality to randomize the playlist order (handleShuffle()).

# User Interaction
- Allows users to double-click on a track to play it (handleDoubleClick()).
- Provides a user-friendly interface with play/pause, previous, and next track buttons.
- Displays the current status of the player.
- Enables users to click on the progress bar to seek to a specific time in the track.

# UI/UX
- A clean and minimalist design.
- Provides feedback to users through status messages.
- Offers a shuffle button for users to randomize the playlist order.

# Testing
- Includes unit tests to ensure proper functionality of components and features.
- Tests cover scenarios such as play/pause, track navigation, and shuffle functionality.
