import React, { useState } from 'react';
import logo from '../../assets/Logo.png'; 
import './LateralContent.css';

const LateralContent = () => {
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const togglePlaylistModal = () => {
    setShowPlaylistModal(!showPlaylistModal);
  }

  return (
    <div className='flex flex-col space-y-4'>
      <div className="content flex p-5 rounded flex-col shadow-md w-content">
          <div className="content-header flex flex-row items-center space-x-4 mb-6">
            <img src={logo} alt="Logo" className="h-20 w-auto" />
            <h1 className="text-3xl font-bold">Music App</h1>
          </div>
          <ul className="flex flex-col space-y-2">
            <li className="flex items-center space-x-2 text-lg cursor-pointer hover:bg-gray-700 p-2 rounded">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </li>
            <li className="flex items-center space-x-2 text-lg cursor-pointer hover:bg-gray-700  p-2 rounded">
              <i className="fas fa-search"></i>
              <span>Search</span>
            </li>
          </ul>
      </div>
      <div className='content flex p-5 rounded flex-col shadow-md w-content'>
        <div className='content-header flex flex-row items-center space-x-4 mb-6'>
          <i className="fas fa-bars"></i>
          <h1 className='text-2xl font-bold'>Sua Biblioteca</h1>
          <i onClick={togglePlaylistModal} className="fas fa-plus"></i>
        </div>
        {showPlaylistModal && (
          <button className="playlist-modal w-auto max-w-fit hover:bg-gray-800 text-white p-4 rounded-lg">
            <p>Criar uma nova playlist</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default LateralContent;
