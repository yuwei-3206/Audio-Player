import React from 'react';
/*import { IoMusicalNotes } from "react-icons/io5";*/
import './audio.css';

const Song = ({ title, artist, year, onDoubleClick, className }) => {
  const renderYear = (year) => {
    // Convert year to a positive number if negative
    const positiveYear = Math.abs(year);
  
    // Check if year is a valid number between 1500 and 9999
    const isValidYear = Number.isInteger(positiveYear) && positiveYear >= 1500 && positiveYear <= 9999;
  
    // Return the year if it's valid, otherwise return Unknown
    return isValidYear ? positiveYear : 'Unknown';
  };
  

  return (
    <div className={`audio ${className}`} onDoubleClick={() => onDoubleClick({ title, artist, year })}>
      <p>
        {/*<span className="audio-icon"><IoMusicalNotes /></span>*/}
        <span className='firstSpan'>{title}</span>
        <span className='secondSpan'>{artist}</span>
        <span className='thirdSpan'>{renderYear(year)}</span>
      </p>
    </div>
  );
};

export default Song;
