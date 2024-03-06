import React from 'react';
import './buttons.css';
import { TbPlayerTrackPrevFilled } from "react-icons/tb";

const PrevBtn = ({ onClick }) => {
    return (
        <button className="btn" onClick={onClick}>
            <TbPlayerTrackPrevFilled />
        </button>
    );
};

export default PrevBtn;
