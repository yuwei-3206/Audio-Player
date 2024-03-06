import React from 'react';
import './buttons.css';
import { FaShuffle } from "react-icons/fa6";

const ShuffleBtn = ({ onClick }) => {
    return (
        <button className="btn" onClick={onClick}>
            <FaShuffle />
        </button>
    );
};

export default ShuffleBtn;