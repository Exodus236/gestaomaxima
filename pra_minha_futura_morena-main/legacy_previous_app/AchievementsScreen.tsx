import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';

interface AchievementsScreenProps {
  onOpenDlc: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ onOpenDlc }) => {
  const [visibleCount, setVisibleCount] = useState<number>(0);

  useEffect(() => {
    // Reveal cards one by one with cute sound effect
    const timer1 = setTimeout(() => {
      setVisibleCount(1);
      sounds.playPop();
    }, 300);

    const timer2 = setTimeout(() => {
      setVisibleCount(2);
      sounds.playPop();
    }, 800);

    const timer3 = setTimeout(() => {
      setVisibleCount(3);
      sounds.playPop();
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleOpenDlcClick = () => {
    sounds.playSuccess();
    onOpenDlc();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-6 text-center z-10 w-full max-w-lg mx-auto animate-pop-in">
      {/* Screen Title */}
      <h2 className="text-3xl sm:text-4xl font-black text-rose-950 tracking-tight mb-2 flex items-center justify-center gap-2">
        🏆 CONQUISTAS 🏆
      </h2>
      <p className="text-sm sm:text-base font-bold text-rose-700 mb-6">
        Histórico dos nossos capítulos juntos
      </p>

      {/* Chapters Cards */}
      <div className="space-y-3.5 w-full mb-8">
        {/* Chapter 1 */}
        {visibleCount >= 1 && (
          <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-rose-300 shadow-md flex items-center justify-between animate-pop-in">
            <div className="flex items-center gap-3 text-left">
              <span className="text-3xl">🏆</span>
              <div>
                <h3 className="font-black text-rose-900 text-base sm:text-lg">
                  CAPÍTULO 01
                </h3>
                <p className="text-xs sm:text-sm font-extrabold text-rose-700/80">
                  1º mês
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-300 font-extrabold text-xs sm:text-sm rounded-full shadow-sm">
              DESBLOQUEADO ✓
            </span>
          </div>
        )}

        {/* Chapter 2 */}
        {visibleCount >= 2 && (
          <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-100 backdrop-blur-md rounded-2xl border-2 border-rose-400 shadow-md flex items-center justify-between animate-pop-in">
            <div className="flex items-center gap-3 text-left">
              <span className="text-3xl">🏆</span>
              <div>
                <h3 className="font-black text-rose-900 text-base sm:text-lg">
                  CAPÍTULO 02
                </h3>
                <p className="text-xs sm:text-sm font-extrabold text-rose-700/80">
                  2º mês
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-300 font-extrabold text-xs sm:text-sm rounded-full shadow-sm animate-pulse">
              DESBLOQUEADO ✓
            </span>
          </div>
        )}

        {/* Chapter 3 */}
        {visibleCount >= 3 && (
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-rose-300/80 flex items-center justify-between opacity-85 animate-pop-in">
            <div className="flex items-center gap-3 text-left">
              <span className="text-3xl">🔒</span>
              <div>
                <h3 className="font-black text-rose-800 text-base sm:text-lg">
                  CAPÍTULO 03
                </h3>
                <p className="text-xs sm:text-sm font-bold text-rose-600/70">
                  3º mês
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-xs sm:text-sm rounded-full">
              EM ANDAMENTO...
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar Container */}
      {visibleCount >= 3 && (
        <div className="w-full bg-white/80 backdrop-blur-md p-5 rounded-2xl border-2 border-rose-200 shadow-md space-y-3 mb-8 animate-pop-in">
          <div className="flex justify-between items-center text-xs sm:text-sm font-black text-rose-900">
            <span>PROGRESSO DO RELACIONAMENTO</span>
            <span className="text-rose-600">66%</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-5 bg-rose-100 rounded-full overflow-hidden p-1 border border-rose-300 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: '66%' }}
            />
          </div>

          <p className="text-xs sm:text-sm font-extrabold text-rose-700 text-center">
            02 meses desbloqueados ❤️
          </p>
        </div>
      )}

      {/* Next Button */}
      {visibleCount >= 3 && (
        <button
          onClick={handleOpenDlcClick}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-lg sm:text-xl rounded-2xl shadow-lg shadow-rose-300/60 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-rose-300 animate-pop-in"
        >
          ABRIR DLC →
        </button>
      )}
    </div>
  );
};
