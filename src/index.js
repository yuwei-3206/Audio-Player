import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import Playlist from './components/Playlist';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Playlist />
  </React.StrictMode>
);