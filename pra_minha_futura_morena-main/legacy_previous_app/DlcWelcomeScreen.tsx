import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';

interface DlcWelcomeScreenProps {
  onUnlock: () => void;
}

export const DlcWelcomeScreen: React.FC<DlcWelcomeScreenProps> = ({ onUnlock }) => {
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlockClick = () => {
    sounds.playAchievement();
    setIsUnlocking(true);

    setTimeout(() => {
      onUnlock();
    }, 900);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[80vh] px-4 text-center z-10 transition-all duration-700 ${
        isUnlocking ? 'scale-110 opacity-0 blur-sm' : 'animate-pop-in'
      }`}
    >
      {/* DLC Badge Header */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600/90 text-white font-extrabold text-xs sm:text-sm shadow-lg border border-rose-300 tracking-wider mb-6 animate-bounce">
        🎮 NOVO DLC DESBLOQUEADO 🎮
      </div>

      {/* Main Title Badge / Disc Icon */}
      <div className="relative mb-6">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-300 p-1 shadow-2xl animate-pulse-slow">
          <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-4xl sm:text-5xl border-4 border-rose-200 shadow-inner">
            💿
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-rose-600 text-white rounded-full px-3 py-1 text-xs font-black shadow-md border-2 border-white">
          v2.0 ✨
        </div>
      </div>

      {/* Title block */}
      <h1 className="text-3xl sm:text-5xl font-black text-rose-950 tracking-tight mb-2 drop-shadow-sm">
        LUANA & RHYAN
      </h1>

      <p className="text-xl sm:text-2xl font-extrabold text-rose-700 mb-8 tracking-wide">
        2 MESES JUNTOS ❤️
      </p>

      {/* Unlock Button */}
      <button
        onClick={handleUnlockClick}
        disabled={isUnlocking}
        className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 text-xl sm:text-2xl font-black text-white bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 rounded-2xl shadow-xl shadow-rose-300/80 hover:shadow-2xl hover:shadow-rose-400/90 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border-2 border-rose-300"
      >
        <span className="relative z-10 flex items-center gap-2">
          {isUnlocking ? "DESBLOQUEANDO... ✨" : "[ DESBLOQUEAR ]"}
        </span>
        <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  );
};
