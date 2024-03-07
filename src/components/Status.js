import React from 'react';
import PlayPauseBtn from './Buttons/PlayPauseBtn';
import PrevBtn from './Buttons/PrevBtn';
import NextBtn from './Buttons/NextBtn';

const Status = ({ status, isPlaying, handlePlayPause, handlePrev, handleNext }) => {
  return (
    <div className="now-play">
      <h2 className="playtitle">{status}</h2>
      <div className="now-play-item">
        <PrevBtn onClick={handlePrev} />
        <PlayPauseBtn onClick={handlePlayPause} isPlaying={isPlaying} />
        <NextBtn onClick={handleNext} />
      </div>
    </div>
  );
};

export default Status;
