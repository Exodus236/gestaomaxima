import React from 'react';
import { sounds } from '../utils/soundEffects';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const handleClick = () => {
    sounds.playPop();
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center z-10 animate-pop-in">
      {/* Decorative badge */}
      <div className="relative mb-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-rose-100 flex items-center justify-center text-4xl sm:text-5xl shadow-inner animate-pulse-slow border-4 border-white">
          💖
        </div>
        <div className="absolute -bottom-2 -right-2 bg-rose-600 text-white rounded-full p-2 text-xl shadow-md animate-bounce">
          ✨
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-rose-900 tracking-tight mb-4 drop-shadow-sm">
        Tenho algo pra você veyyr KK
      </h1>

      <p className="text-base sm:text-lg text-rose-700/90 max-w-md mb-8 leading-relaxed font-medium">
        sei la, penso em você tempo todo mulher... 💕
      </p>

      {/* Start Button */}
      <button
        onClick={handleClick}
        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-full shadow-lg shadow-rose-300/60 hover:shadow-xl hover:shadow-rose-400/80 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          Começar ❤️
        </span>
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  );
};
