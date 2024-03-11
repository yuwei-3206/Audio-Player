import React, { useState, useEffect, useCallback } from 'react';
import Song from './Audio/Song';
import Podcast from './Audio/Podcast';
import ShuffleBtn from './Buttons/ShuffleBtn';
import Status from './Status';
import './playlist.css';

const Playlist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [status, setStatus] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const renderTitle = useCallback((item) => {
    if (item && 'title' in item) {
      return item.title;
    } else if (item && 'episodeTitle' in item) {
      return item.episodeTitle;
    }
    return "No Title";
  }, []);
  
  const playTrack = useCallback((track) => {
    setStatus(`Playing: ${renderTitle(track)}`);
    setIsPlaying(true);
  }, [renderTitle]);

  useEffect(() => {
    fetch('http://localhost:3000/audio_tracks.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch playlist');
        }
        return response.json();
      })
      .then(data => {
        const shuffledPlaylist = [...data.tracks].sort(() => Math.random() - 0.5);
        setPlaylist(shuffledPlaylist);
        setCurrentTrackIndex(0);
        playTrack(shuffledPlaylist[0]);
      })
      .catch(error => console.error('Error fetching playlist:', error));
  }, [playTrack]);

  const handleDoubleClick = (track) => {
    const newIndex = playlist.findIndex(item => item === track);
    setCurrentTrackIndex(newIndex);
    playTrack(playlist[newIndex]);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    const currentTrack = playlist[currentTrackIndex];
    setStatus(isPlaying ? 'Paused' : `Playing: ${renderTitle(currentTrack)}`);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1);
    playTrack(playlist[currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1]);
  };
  
  const handleNext = () => {
    setCurrentTrackIndex(currentTrackIndex === playlist.length - 1 ? 0 : currentTrackIndex + 1);
    playTrack(playlist[currentTrackIndex === playlist.length - 1 ? 0 : currentTrackIndex + 1]);
  };

  const handleShuffle = () => {
    const shuffledPlaylist = [...playlist].sort(() => Math.random() - 0.5);
    setPlaylist(shuffledPlaylist);
    setCurrentTrackIndex(0);
    playTrack(shuffledPlaylist[0]);
  };

  const handleClick = (item) => {
    handleDoubleClick(item);
  };

  const renderAudio = (item, index) => {
    const handleDoubleClick = () => {
      handleClick(item);
    };

    if (item.title) {
      return <Song key={index} {...item} onDoubleClick={handleDoubleClick} />;
    } else if (item.episodeTitle) {
      return <Podcast key={index} {...item} onDoubleClick={handleDoubleClick} />;
    }
    return null;
  };

  return (
    <div className="playlist-container">
      <h2 className="title">My Playlist</h2>
      <Status status={status} isPlaying={isPlaying} handlePlayPause={handlePlayPause} handlePrev={handlePrev} handleNext={handleNext} />
      <div className="next-play">
        <h2 className="playtitle">Play List
          <ShuffleBtn onClick={handleShuffle} />
        </h2>
        <div className='playlist'>
          <div className="songs-and-podcasts">
            {playlist.map((item, index) => (
              <React.Fragment key={index}>
                {renderAudio(item, index)}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <p className="copyRight">© 2024 Yu-Wei Wu.</p>
    </div>
  );
};

export default Playlist;
