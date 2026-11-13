import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';
import euTemakiImg from '../assets/images/eu_temaki.jpeg';

interface DlcFinalScreenProps {
  onRestart: () => void;
}

export const DlcFinalScreen: React.FC<DlcFinalScreenProps> = ({ onRestart }) => {
  const [showToast, setShowToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    sounds.playCelebration();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f43f5e', '#ec4899', '#fbbf24', '#ffffff', '#a855f7'],
      });
    } catch {
      // Ignore
    }
  }, []);

  const handleContinueClick = () => {
    sounds.playPop();
    setShowToast(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore
    }

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handlePhotoClick = () => {
    sounds.playPop();
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-6 text-center z-20 w-full max-w-xl mx-auto animate-pop-in">
      {/* ACHIEVEMENT NOTIFICATION BANNER */}
      <div className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white p-5 rounded-3xl shadow-2xl border-4 border-amber-300 mb-6 animate-float-bounce">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-900/40 rounded-full text-xs font-black tracking-wider text-amber-200 mb-2 border border-amber-300/40">
          🏆 NOVA CONQUISTA!
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
          ÁLBUM COMPLETADO
        </h2>
        <p className="text-xs sm:text-sm font-bold text-amber-100">
          Você desbloqueou todas as memórias dos primeiros 2 meses. ✨
        </p>
      </div>

      {/* POLAROID PHOTO FRAME WITH EU TEMAKI */}
      <div className="relative mb-6 group w-full max-w-[320px] sm:max-w-sm mx-auto">
        <div
          onClick={handlePhotoClick}
          className="p-3 pb-6 bg-white rounded-2xl shadow-2xl border-4 border-rose-200 transform -rotate-1 hover:rotate-0 transition-transform duration-300 w-full mx-auto cursor-zoom-in"
        >
          <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-rose-100 flex items-center justify-center min-h-[260px] sm:min-h-[300px]">
            <img
              src={euTemakiImg}
              alt="Eu temaki"
              className="w-full h-auto max-h-[50vh] sm:max-h-[380px] object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow border border-white/40">
              🍣 Eu temaki!
            </div>
            <div className="absolute bottom-2 right-2 bg-slate-900/90 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full shadow border border-amber-300/40 flex items-center gap-1">
              🔍 Toque para expandir foto
            </div>
          </div>
          <p className="mt-3 font-black text-rose-900 text-sm sm:text-base tracking-tight leading-snug">
            Eu temaki pra tu 🍣🥰
          </p>
        </div>
      </div>

      {/* ROMANTIC MESSAGE CONTAINER */}
      <div className="w-full bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-rose-300 space-y-4 mb-6">
        <div className="text-4xl sm:text-5xl animate-bounce">
          💖🍣
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-rose-950 tracking-tight leading-snug">
          Feliz 2 meses, meu amor. ❤️
        </h1>

        <p className="text-base sm:text-xl font-extrabold text-rose-800 leading-relaxed">
          É só o começo da nossa história. 🥰
        </p>
      </div>

      {/* CONTINUAR JOGANDO BUTTON */}
      <button
        onClick={handleContinueClick}
        className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl shadow-rose-300/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-rose-300"
      >
        🎮 CONTINUAR JOGANDO
      </button>

      {/* TOAST / NEXT CHAPTER BANNER */}
      {showToast && (
        <div className="mt-4 px-6 py-3 bg-slate-900 text-white font-black text-sm sm:text-base rounded-2xl shadow-2xl border-2 border-amber-400 animate-pop-in flex items-center gap-2">
          <span>Próximo capítulo: 03 meses... 🔒❤️</span>
        </div>
      )}

      {/* RESTART / VOLTA AO INÍCIO */}
      <button
        onClick={onRestart}
        className="mt-6 text-xs font-bold text-rose-700 hover:underline cursor-pointer opacity-80"
      >
        Recomeçar DLC 🔄
      </button>

      {/* LIGHTBOX FULLSCREEN PHOTO MODAL */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-pop-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-full max-h-[92vh] w-full max-w-md bg-slate-900 border-2 border-rose-400/80 rounded-3xl p-4 shadow-2xl flex flex-col items-center justify-between overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-full w-9 h-9 flex items-center justify-center shadow-lg border-2 border-white cursor-pointer z-10"
            >
              ✕
            </button>

            {/* Full Image Display */}
            <div className="overflow-hidden rounded-2xl bg-black max-h-[70vh] w-full flex items-center justify-center border border-slate-800">
              <img
                src={euTemakiImg}
                alt="Eu temaki"
                className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-lg"
              />
            </div>

            {/* Caption */}
            <div className="mt-3 text-center px-2">
              <h4 className="text-sm sm:text-base font-black text-rose-300">
                Eu temaki pra tu 🍣🥰
              </h4>
              <p className="text-xs sm:text-sm font-extrabold text-white mt-1">
                Feliz 2 meses, meu amor. É só o começo da nossa história. ❤️
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
