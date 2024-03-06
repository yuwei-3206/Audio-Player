import React from 'react';
import { IoMusicalNotes } from "react-icons/io5";
import './audio.css';

const Song = ({ title, artist, year, onDoubleClick }) => {
  return (
    <div className="song" onDoubleClick={() => onDoubleClick({ title, artist, year })}>
      <p>
        <IoMusicalNotes />
        <span>Title: {title}</span>
        <span>Artist: {artist}</span>
        <span>Year: {year}</span>
      </p>
    </div>
  );
};

export default Song;