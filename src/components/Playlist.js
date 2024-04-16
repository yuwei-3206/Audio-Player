import React, { useState, useEffect, useCallback, useRef } from 'react';
import Song from './Audio/Song';
import Podcast from './Audio/Podcast';
import ShuffleBtn from './Buttons/ShuffleBtn';
import PlayPauseBtn from './Buttons/PlayPauseBtn';
import PrevBtn from './Buttons/PrevBtn';
import NextBtn from './Buttons/NextBtn';
import './playlist.css';

const Playlist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [status, setStatus] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerInterval = useRef(null);

  const renderTitle = useCallback((item) => {
    if (item && 'title' in item) {
      return item.title;
    } else if (item && 'episodeTitle' in item) {
      return item.episodeTitle;
    }
    return "No Title";
  }, []);

  const calculateDurationInSeconds = (duration) => {
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
};

  const progress = (elapsedTime / duration) * 100;

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
};

  const handleNext = () => {
    setCurrentTrackIndex(currentTrackIndex === playlist.length - 1 ? 0 : currentTrackIndex + 1);
    playTrack(playlist[currentTrackIndex === playlist.length - 1 ? 0 : currentTrackIndex + 1]);
  };

  useEffect(() => {
    if (isPlaying) {
      timerInterval.current = setInterval(() => {
        setElapsedTime(prevElapsedTime => {
          if (prevElapsedTime >= duration) {
            handleNext();
            return 0;
          }
          return prevElapsedTime + 0.1;
        });
      }, 100);
    } else {
      clearInterval(timerInterval.current);
    }
    return () => clearInterval(timerInterval.current);
  }, [isPlaying, duration, handleNext]);

  const handleProgressClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const clickedPercentage = (offsetX / progressBarWidth) * 100;
    const clickedTime = (clickedPercentage / 100) * duration;
    setElapsedTime(clickedTime);
  };

  const playTrack = useCallback((track) => {
    setStatus(`${renderTitle(track)}`);
    setIsPlaying(true);
    setDuration(calculateDurationInSeconds(track.duration));
    setElapsedTime(0);
    return () => clearInterval(timerInterval.current);
  }, [renderTitle]);

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
        playTrack(shuffledPlaylist[0]);
      })
      .catch(error => console.error('Error fetching playlist:', error));
  }, [playTrack]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    const currentTrack = playlist[currentTrackIndex];
    setStatus(isPlaying ? 'Paused' : `${renderTitle(currentTrack)}`);
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
            {isPlaying ? <h5>Playing</h5> : <h5 style={{color: 'var(--color-black)'}}>.</h5>}
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
      <div className="progress-playbar" onClick={handleProgressClick}>
        <progress value={progress} max="100"></progress>
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
      </div>
      <p className="copyRight">© 2024 Yu-Wei Wu.</p>
    </div>
  );
};

export default Playlist;
