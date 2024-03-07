import React from 'react';
import { IoMusicalNotes } from "react-icons/io5";
import './audio.css';

const Song = ({ title, artist, year, onDoubleClick }) => {
  const renderYear = (year) => {
    if (typeof year === 'number') {
      return year;
    } else if (typeof year === 'string' && /^\d{4}$/.test(year)) {
      return parseInt(year, 10);
    } else {
      return 'Invalid year';
    }
  };

  return (
    <div className="song" onDoubleClick={() => onDoubleClick({ title, artist, year })}>
      <p>
        <span className="audio-icon"><IoMusicalNotes /></span>
        <span>Title: {title}</span>
        <span>Artist: {artist}</span>
        <span>Year: {renderYear(year)}</span>
      </p>
    </div>
  );
};

export default Song;