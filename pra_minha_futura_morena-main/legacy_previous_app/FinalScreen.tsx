import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';
import sushiPhoto from '../assets/images/eu_de_sushi.png';

interface FinalScreenProps {
  onRestart: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({ onRestart }) => {
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    sounds.playCelebration();

    // Gentle soft confetti pop
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#ffffff', '#fbbf24'],
      });
    } catch {
      // Ignore
    }

    // After 1.8 seconds reveal second message
    const timer = setTimeout(() => {
      setShowSecondMessage(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleRestartClick = () => {
    sounds.playPop();
    onRestart();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCustomPhotoUrl(url);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-3 sm:px-4 py-4 sm:py-8 text-center z-20 w-full max-w-xl sm:max-w-2xl mx-auto animate-pop-in">
      {/* Polaroid style photo frame for the sushi picture */}
      <div className="relative mb-6 group w-full max-w-[340px] sm:max-w-md mx-auto">
        <div className="p-3 sm:p-4 pb-6 sm:pb-8 bg-white rounded-2xl shadow-2xl border-4 border-rose-200 transform -rotate-1 sm:-rotate-2 hover:rotate-0 transition-transform duration-300 w-full mx-auto">
          <div className="relative overflow-hidden rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center min-h-[250px] sm:min-h-[360px] p-1">
            <img
              src={customPhotoUrl || sushiPhoto}
              alt="Eu vestido de sushi"
              className="w-full h-auto max-h-[55vh] sm:max-h-[460px] object-contain rounded-lg shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              🍣 Prontinho!
            </div>
          </div>
          <p className="mt-3 font-extrabold text-rose-800 text-sm sm:text-base tracking-tight leading-snug px-1">
            ja estou pronto com minha roupa , só esperando você agora :)
          </p>
        </div>
      </div>

      {/* Primary message box */}
      <div className="space-y-6 bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border border-rose-200/80 w-full">
        <h1 className="text-2xl sm:text-4xl font-black text-rose-900 tracking-tight leading-snug">
          Pedido registrado com sucesso. ❤️
        </h1>

        {/* Revealed message */}
        {showSecondMessage && (
          <div className="space-y-4 animate-pop-in pt-2">
            <div className="p-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl border-2 border-rose-300 shadow-sm">
              <p className="text-base sm:text-xl font-black text-rose-900 leading-relaxed">
                "ja prepara a make mulher que agora oficialmente você é minha, acabou de assinar o contrato comigo... aaah e prepara a cabeça que quero fazer tu ter uma vida surreal , te quero pa krl mulher !"
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center gap-2">
              <span className="text-4xl sm:text-5xl animate-bounce">🍣❤️</span>
              <p className="text-lg sm:text-xl font-extrabold text-rose-900 tracking-wide">
                Nosso encontro só tem que marcar KKK.
              </p>
            </div>
          </div>
        )}

        {/* Restart Button */}
        <div className="pt-4">
          <button
            onClick={handleRestartClick}
            className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-rose-300"
          >
            Recomeçar 🔄
          </button>
        </div>
      </div>
    </div>
  );
};
