import React from 'react';
/*import { FaPodcast } from "react-icons/fa";*/
import './audio.css';

const Podcast = ({ season, episode, episodeTitle, onDoubleClick, className }) => {
  const displaySeason = season !== undefined ? `Season ${season}` : '';
  const displayEpisode = episode !== undefined ? `Episode ${episode}` : '';
  const displayEpisodeTitle = episodeTitle !== undefined ? `${episodeTitle}` : '';

  return (
    <div className={`audio ${className}`} onDoubleClick={() => onDoubleClick({ season, episode, episodeTitle })}>
      <p>
        {/*<span className="audio-icon"><FaPodcast /></span>*/}
        {displayEpisodeTitle && <span className='firstSpan'>{displayEpisodeTitle} </span>}
        {displaySeason && <span className='secondSpan'>{displaySeason} </span>}
        {displayEpisode && <span className='thirdSpan'>{displayEpisode} </span>}
      </p>
    </div>
  );
};

export default Podcast;