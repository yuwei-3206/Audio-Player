import React from 'react';
import { FaPodcast } from "react-icons/fa";
import './audio.css';

const Podcast = ({ season, episode, episodeTitle, onDoubleClick }) => {
  const displaySeason = season !== undefined ? `Season: ${season}` : '';

  return (
    <div className="podcast" onDoubleClick={() => onDoubleClick({ season, episode, episodeTitle })}>
      <p>
        <FaPodcast />
        {displaySeason && <span className='season'>{displaySeason} </span>}
        <span>Episode: {episode}</span>
        <span>Episode Title: {episodeTitle}</span>
      </p>
    </div>
  );
};

export default Podcast;