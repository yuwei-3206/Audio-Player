import React from 'react';
import { FaPodcast } from "react-icons/fa";
import './audio.css';

const Podcast = ({ season, episode, episodeTitle, onDoubleClick }) => {
  const displaySeason = season !== undefined ? `Season: ${season}` : '';
  const displayEpisode = episode !== undefined ? `Episode: ${episode}` : '';
  const displayEpisodeTitle = episodeTitle !== undefined ? `Episode Title: ${episodeTitle}` : '';

  return (
    <div className="podcast" onDoubleClick={() => onDoubleClick({ season, episode, episodeTitle })}>
      <p>
        <span className="audio-icon"><FaPodcast /></span>
        {displaySeason && <span className='season'>{displaySeason} </span>}
        {displayEpisode && <span>{displayEpisode} </span>}
        {displayEpisodeTitle && <span>{displayEpisodeTitle} </span>}
      </p>
    </div>
  );
};

export default Podcast;