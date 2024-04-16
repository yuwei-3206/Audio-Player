import React from 'react';
import './buttons.css';
import { MdSkipNext } from "react-icons/md";

const NextBtn = ({ onClick }) => {
    return (
        <button className="btn" onClick={onClick} data-testid="nextBtn">
            <MdSkipNext />
        </button>
    );
};

export default NextBtn;
