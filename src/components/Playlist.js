import React, { useState, useEffect, useCallback, useRef } from 'react';
import Song from './Audio/Song';
import Podcast from './Audio/Podcast';
import ShuffleBtn from './Buttons/ShuffleBtn';
import PlayPauseBtn from './Buttons/PlayPauseBtn';
import PrevBtn from './Buttons/PrevBtn';
import NextBtn from './Buttons/NextBtn';
import './playlist.css';

/*const calculateDurationInSeconds = (duration) => {
    if (!duration) {
      return 0;
    }
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return minutes * 60 + seconds;
    } else {
      return 0;
    }
  };*/

const Playlist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [status, setStatus] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hoveredProgress, setHoveredProgress] = useState(null);

  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);
  const isDraggingRef = useRef(false);

  const renderTitle = useCallback((item) => {
    if (item && 'title' in item) {
      return item.title;
    } else if (item && 'episodeTitle' in item) {
      return item.episodeTitle;
    }
    return "No Title";
  }, []);

  // Format the displayed time
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    // Default format "00:00". If the time is over 1 hour, display format "00:00:00"
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  };

  // Use <audio> to play music and get the length of the src
  const playTrack = useCallback((track, shouldPlay = true) => {
    setStatus(`${renderTitle(track)}`);
    audioRef.current.pause();
    audioRef.current.src = require(`../assets/musics/${track.src}`);
    audioRef.current.volume = 1;
    audioRef.current.load();

    if (shouldPlay) {
      setIsPlaying(true);
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
        audioRef.current.play().catch(error => console.error('Error playing audio:', error)); // Play the audio once it's loaded
      });
    } else {
      setIsPlaying(false); // Update isPlaying state if shouldPlay is false
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
        audioRef.current.pause();
      });
    }

    // Clean up function to pause audio when unmounting or when shouldPlay changes
    return () => audioRef.current.pause();
  }, [renderTitle]);

  // Fetch json data
  useEffect(() => {
    fetch('/Audio-Player/audio_tracks.json')
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
        playTrack(shuffledPlaylist[0], false);
      })
      .catch(error => console.error('Error fetching playlist:', error));
  }, [playTrack]);

  const handleNext = () => {
    setCurrentTrackIndex(currentTrackIndex === playlist.length - 1 ? 0 : currentTrackIndex + 1);
    playTrack(playlist[currentTrackIndex === playlist.length - 1 ? 0 : currentTrackIndex + 1]);
  };

  // When the audio is ended, goes to next audio
  useEffect(() => {
    audioRef.current.addEventListener('ended', handleAudioEnded);
    return () => {
      audioRef.current.removeEventListener('ended', handleAudioEnded);
    };
  }, [currentTrackIndex, playlist]);

  const handleAudioEnded = () => {
    handleNext();
  };

  // Handle audio time
  const handleTimeUpdate = () => {
    setElapsedTime(audioRef.current.currentTime);
    if (!isDraggingRef.current) {
      const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(newProgress);
    }
  };

  useEffect(() => {
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Handle audio progress bar movements
  const handleProgressClick = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const clickedPercentage = offsetX / progressBarWidth;
    const clickedTime = clickedPercentage * audioRef.current.duration;
    
    // Check if the audio is paused before setting new time and progress
    if (!isPlaying) {
      setElapsedTime(clickedTime);
      setProgress(clickedPercentage * 100);
    } else {
      audioRef.current.currentTime = clickedTime;
      setElapsedTime(clickedTime);
      setProgress(clickedPercentage * 100);
    }
  };
  

  const handleProgressMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleProgressMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      handleProgressClick(e);
    }
  };

  // Control audio's buttons
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current.pause();
      setStatus('Paused');
    } else {
      if (!isDraggingRef.current) { 
        const newTime = (progress / 100) * duration;
        // Check if newTime is valid
        if (!isNaN(newTime) && isFinite(newTime)) { 
          audioRef.current.currentTime = newTime;
          setElapsedTime(newTime);
        }
      }
      setIsPlaying(true);
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));
      const currentTrack = playlist[currentTrackIndex];
      setStatus(`${renderTitle(currentTrack)}`);
    }
  };

  const handlePrev = () => {
    setCurrentTrackIndex(currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1);
    playTrack(playlist[currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1]);
  };

  const handleShuffle = () => {
    const shuffledPlaylist = [...playlist].sort(() => Math.random() - 0.5);
    setPlaylist(shuffledPlaylist);
    setCurrentTrackIndex(0);
    playTrack(shuffledPlaylist[0]);
  };

  const handleDoubleClick = (track) => {
    const newIndex = playlist.findIndex(item => item === track);
    setCurrentTrackIndex(newIndex);
    playTrack(playlist[newIndex]);
  };

  const handleClick = (item) => {
    handleDoubleClick(item);
  };

  const renderAudio = (item, index) => {
    const handleDoubleClick = () => {
      handleClick(item);
    };

    const isActive = index === currentTrackIndex;

    return (
      <React.Fragment key={index}>
        {item.title ? (
          <Song
            className={isActive ? 'active-audio' : 'inactive-audio'}
            {...item}
            onDoubleClick={handleDoubleClick}
          />
        ) : (
          <Podcast className={isActive ? 'active-audio' : 'inactive-audio'}
            {...item}
            onDoubleClick={handleDoubleClick}
          />
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="container">

      {/** Display audio infomation that is currently playing */}
      <div className="audio-info-container">
        <div className="info-item">
          {isPlaying ? <h5>Playing</h5> : <h5 style={{ color: 'var(--color-black)' }}>.</h5>}
          <h2>{status}</h2>
        </div>
        <div className="info-item-container">
          {playlist[currentTrackIndex]?.title ? (
            <>
              <div className="info-item">
                <h5>Artist</h5>
                <p>{playlist[currentTrackIndex]?.artist}</p>
              </div>
              <div className="info-item">
                <h5>Year</h5>
                <p>{playlist[currentTrackIndex]?.year}</p>
              </div>
            </>
          ) : (
            playlist[currentTrackIndex]?.episodeTitle && (
              <>
                {playlist[currentTrackIndex]?.season && playlist[currentTrackIndex]?.episode && (
                  <>
                    <div className="info-item">
                      <h5>Season</h5>
                      <p>{playlist[currentTrackIndex]?.season}</p>
                    </div>
                    <div className="info-item">
                      <h5>Episode</h5>
                      <p>{playlist[currentTrackIndex]?.episode}</p>
                    </div>
                  </>
                )}
                {playlist[currentTrackIndex]?.season && !playlist[currentTrackIndex]?.episode && (
                  <div className="info-item">
                    <h5>Season</h5>
                    <p>{playlist[currentTrackIndex]?.season}</p>
                  </div>
                )}
                {!playlist[currentTrackIndex]?.season && playlist[currentTrackIndex]?.episode && (
                  <div className="info-item">
                    <h5>Episode</h5>
                    <p>{playlist[currentTrackIndex]?.episode}</p>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>

      {/** Display audio duration that is currently playing */}
      <div className="audio-duration">
        <p>{formatTime(elapsedTime)} / {formatTime(duration)}</p>
      </div>

      {/** Display playing progress bar */}
      <div className="progress-playbar" 
          ref={progressBarRef} 
          onClick={handleProgressClick} 
          onMouseDown={handleProgressMouseDown}
          onMouseUp={handleProgressMouseUp}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHoveredProgress(true)}
          onMouseLeave={() => setHoveredProgress(false)}>
        <progress value={progress} max="100"></progress>
        {hoveredProgress !== null && (
          <div
            className="progress-circle"
            style={{ left: `${progress}%` }}
          ></div>
        )}
      </div>

      {/** Display control buttons for pause, prev audio, next audio */}
      <div className="now-play-btn">
        <PrevBtn onClick={handlePrev} />
        <PlayPauseBtn onClick={handlePlayPause} isPlaying={isPlaying} />
        <NextBtn onClick={handleNext} />
      </div>

      <div className="img-nextplay-container">

        {/** Display the image of the current playing audio. If there is no img data in the audio tracks, then display the default song/podcast img */}
        <div className="audio-img">
          {playlist[currentTrackIndex]?.img ? (
            <img src={require(`../assets/images/${playlist[currentTrackIndex]?.img}`)} alt="Audio cover" />
          ) : (
            playlist[currentTrackIndex]?.title ? (
              <img src={require('../assets/images/song.jpg')} alt="Audio cover" />
            ) : (
              <img src={require('../assets/images/podcast.png')} alt="Audio cover" />
            )
          )}
        </div>

        {/** Display play list */}
        <div className="next-play">
          <div className='playtitle'>
            <h2>Play List</h2>
            <ShuffleBtn onClick={handleShuffle} />
          </div>
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
      </div>
      <p className="copyRight">© 2024 Yu-Wei Wu.</p>
    </div>
  );
};

export default Playlist;
