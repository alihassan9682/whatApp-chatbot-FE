import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import anim from '../images/animations/sendingMessage.json';

export const MessageModal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white p-10 rounded-lg shadow-2xl text-center transform w-[40%] h-[50%]">
        <Player
          autoplay
          loop
          src={anim}
          style={{ height: '300px', width: '300px' }} // Enlarged animation size
        />
        <p className="mt-2 text-lg ">{message[0``]}</p>
        <button
          onClick={onClose}
          className="mt-6 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          {message[1]}
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
