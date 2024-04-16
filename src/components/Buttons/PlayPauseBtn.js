import React from 'react';
import './buttons.css';
import { FaPlay } from "react-icons/fa6";
import { GiPauseButton } from "react-icons/gi";

const PlayPauseBtn = ({ onClick, isPlaying }) => {
    return (
        <button className="play-pause-btn" onClick={onClick} data-testid="playPauseBtn">
            {isPlaying ? <GiPauseButton style={{ marginLeft: '1px', marginTop: '3px' }} /> : <FaPlay style={{ marginLeft: '4.5px', marginTop: '5px' }} />}
        </button>
    );
};

export default PlayPauseBtn;
