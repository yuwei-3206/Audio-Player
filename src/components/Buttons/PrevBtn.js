import React from 'react';
import './buttons.css';
import { MdSkipPrevious } from "react-icons/md";

const PrevBtn = ({ onClick }) => {
    return (
        <button className="btn" onClick={onClick} data-testid="prevBtn">
            <MdSkipPrevious />
        </button>
    );
};

export default PrevBtn;
