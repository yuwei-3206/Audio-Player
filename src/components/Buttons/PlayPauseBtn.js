import React from 'react';
import './buttons.css';
import { FaPlay } from "react-icons/fa6";
import { GiPauseButton } from "react-icons/gi";

const PlayPauseBtn = ({ onClick, isPlaying }) => {
    return (
        <button className="btn" onClick={onClick}>
            {isPlaying ? <GiPauseButton/> : <FaPlay />}
        </button>
    );
};

export default PlayPauseBtn;
