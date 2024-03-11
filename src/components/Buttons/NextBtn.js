import React from 'react';
import './buttons.css';
import { TbPlayerTrackNextFilled } from "react-icons/tb";

const NextBtn = ({ onClick }) => {
    return (
        <button className="btn" onClick={onClick} data-testid="nextBtn">
            <TbPlayerTrackNextFilled />
        </button>
    );
};

export default NextBtn;
