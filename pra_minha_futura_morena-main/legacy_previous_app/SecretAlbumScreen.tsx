import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';

import primeiraVezImg from '../assets/images/primeira_vez_encontrando.jpeg';
import elaSendoElaImg from '../assets/images/ela_sendo_ela.jpeg';
import sorrisoDelaImg from '../assets/images/sorriso_dela.jpeg';
import call17hImg from '../assets/images/17_horas_call.jpeg';
import euDormindoImg from '../assets/images/eu_dormindo.jpeg';
import umDesejoImg from '../assets/images/um_desejo.jpeg';

interface CardData {
  id: number;
  icon: string;
  title: string;
  frontSub: string;
  backText: string;
  image: string;
}

const CARDS_DATA: CardData[] = [
  {
    id: 1,
    icon: "📸",
    title: "Nosso começo",
    frontSub: "Primeira vez se encontrando...",
    backText: "Aqui começou algo, que eu nem imaginava que ia escalar pra o que estamos sentindo hoje kkkk... <3",
    image: primeiraVezImg,
  },
  {
    id: 2,
    icon: "❤️",
    title: "Você sendo você",
    frontSub: "Aquele seu jeito único...",
    backText: "Eu amo quando você é sincera, quando você é você, sem medo de eu julgar, ou quando você mesmo cansada, deita no chão dançando e fica só os pézinho pra cima KKKK, não tenho a foto, mais esse print ja representa algo....",
    image: elaSendoElaImg,
  },
  {
    id: 3,
    icon: "❤️",
    title: "Uma coisa que amo em você",
    frontSub: "Seu sorriso lindo...",
    backText: "O jeito único que você cuida de mim, sua risada gostosa , seu sorriso... só de receber uma foto do seu sorriso ou você rindo e demonstrando felicidade, o resto do dia fica alegre demais...",
    image: sorrisoDelaImg,
  },
  {
    id: 4,
    icon: "🥰",
    title: "Um momento especial",
    frontSub: "17 horas de call...",
    backText: "Esse dia foi legal KKKK, 37 horas de call, porém, não achei a foto das 37, só das 17 horas.. Mais enfim, vamos ter momentos mais especiais quando estivermos juntos!",
    image: call17hImg,
  },
  {
    id: 5,
    icon: "🤣",
    title: "Memória aleatória",
    frontSub: "Eu dormindo KKKK...",
    backText: "O dia que você ficou rindo atoa comigo dormindo e tu bebada KKKKKK, isso é tão gostoso mano, eu te amo pa krl...",
    image: euDormindoImg,
  },
  {
    id: 6,
    icon: "💌",
    title: "Uma mensagem pra você",
    frontSub: "De todo o meu coração...",
    backText: "Eu te amo mt amor, talves você quebrou o palitinho pra mim, por isso estou tao apaixonado por tu KKK, talvez eu tenha quebrado um pra você também. É só 2 mesêszinhos, porém, parece mais, a gente tem uma conexão tão boa, eu me sinto tão bem contigo, eu imagino todo meu futuro com você incluida nele.. Eu não vejo mais nada que você não esteja incluida.. Eu te amo mt mesmo amor, se pudesse, eu te demonstraria com atitudes agora mesmo, nesse exato momento. Enfim, um eu te amo não é o suficiente, pra te mostrar o que eu realmente sinto..",
    image: umDesejoImg,
  },
];

interface SecretAlbumScreenProps {
  onComplete: () => void;
}

export const SecretAlbumScreen: React.FC<SecretAlbumScreenProps> = ({ onComplete }) => {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [modalImage, setModalImage] = useState<{
    url: string;
    title: string;
    caption: string;
    isFinalTrigger?: boolean;
  } | null>(null);

  const handleCardClick = (id: number) => {
    sounds.playFlip();

    setFlippedCards((prev) => {
      const isAlreadyFlipped = prev[id];
      const willBeFlipped = !isAlreadyFlipped;
      const updated = { ...prev, [id]: willBeFlipped };

      const flippedCount = Object.keys(updated).filter((key) => updated[Number(key)]).length;
      const targetCard = CARDS_DATA.find((c) => c.id === id);

      // If opening a card into flipped state, automatically open modal so she can read and view photo comfortably
      if (willBeFlipped && targetCard) {
        const isFinal = flippedCount === 6 || id === 6;
        setTimeout(() => {
          setModalImage({
            url: targetCard.image,
            title: targetCard.title,
            caption: targetCard.backText,
            isFinalTrigger: isFinal,
          });
        }, 350);
      }

      return updated;
    });
  };

  const handleCloseModal = () => {
    const isFinal = modalImage?.isFinalTrigger;
    setModalImage(null);

    // Only transition to final achievement screen after she closes the modal on the final card
    if (isFinal) {
      setTimeout(() => {
        onComplete();
      }, 400);
    }
  };

  const flippedCount = Object.keys(flippedCards).filter((key) => flippedCards[Number(key)]).length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-3 sm:px-4 py-6 text-center z-20 w-full max-w-2xl mx-auto animate-pop-in">
      {/* Theme Transition Header: Dark Cyber-Romantic expansion aesthetic */}
      <div className="w-full bg-slate-900/90 text-white backdrop-blur-xl p-5 sm:p-6 rounded-3xl border-2 border-rose-500/50 shadow-2xl mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-300 font-extrabold text-xs mb-3 border border-rose-500/40">
          🎮 SEGUNDA PARTE DO SITE • DLC UNLOCKED
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-rose-100 tracking-tight flex items-center justify-center gap-2 mb-1">
          🧩 NOSSO ÁLBUM 🧩
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-rose-200/90">
          Algumas coisas que só fazem sentido pra gente.
        </p>

        {/* Counter indicator */}
        <div className="mt-4 inline-flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-rose-300">
          <span>Memórias reveladas:</span>
          <span className="text-amber-400 font-black text-sm">{flippedCount} / 6</span>
        </div>
      </div>

      {/* 2x3 Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
        {CARDS_DATA.map((card) => {
          const isFlipped = !!flippedCards[card.id];

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="h-72 sm:h-80 w-full perspective-1000 cursor-pointer select-none group"
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT FACE */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border-2 border-rose-400/40 shadow-xl p-4 flex flex-col items-center justify-center text-center backface-hidden group-hover:border-rose-400/80 transition-colors">
                  <div className="text-4xl sm:text-5xl mb-3 animate-bounce">
                    {card.icon}
                  </div>
                  <h3 className="font-black text-lg sm:text-xl text-rose-100 leading-tight mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-300/80 font-medium">
                    {card.frontSub}
                  </p>
                  <span className="mt-4 text-xs uppercase tracking-wider font-black text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/30">
                    Toque para revelar foto 🖼️
                  </span>
                </div>

                {/* BACK FACE WITH PHOTO AND TEXT */}
                <div className="absolute inset-0 w-full h-full bg-slate-950 text-white rounded-2xl border-2 border-amber-400/80 shadow-2xl overflow-hidden flex flex-col justify-between rotate-y-180 backface-hidden p-2">
                  {/* Photo area - clickable for Fullscreen modal */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playPop();
                      setModalImage({ url: card.image, title: card.title, caption: card.backText });
                    }}
                    className="relative w-full h-[58%] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 cursor-zoom-in group/img"
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover rounded-xl group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-black text-amber-300 border border-slate-700">
                      {card.icon} {card.title}
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 bg-rose-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow border border-white/40 flex items-center gap-1">
                      🔍 Expandir
                    </div>
                  </div>

                  {/* Caption Text Box */}
                  <div className="w-full h-[40%] bg-gradient-to-t from-slate-900 via-slate-900 to-slate-900/90 rounded-xl p-2 sm:p-2.5 flex items-center justify-center border border-slate-800 overflow-y-auto custom-scrollbar">
                    <p className="text-[11px] sm:text-xs font-extrabold text-rose-100 leading-relaxed tracking-tight text-center drop-shadow">
                      "{card.backText}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual advance button if all 6 are flipped */}
      {flippedCount === 6 && (
        <button
          onClick={onComplete}
          className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-amber-300 animate-bounce"
        >
          🏆 VER CONQUISTA FINAL →
        </button>
      )}

      {/* LIGHTBOX FULLSCREEN PHOTO MODAL */}
      {modalImage && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-pop-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-full max-h-[92vh] w-full max-w-lg bg-slate-900 border-2 border-rose-400/80 rounded-3xl p-4 shadow-2xl flex flex-col items-center justify-between overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-full w-9 h-9 flex items-center justify-center shadow-lg border-2 border-white cursor-pointer z-10"
            >
              ✕
            </button>

            {/* Full Image Display */}
            <div className="overflow-hidden rounded-2xl bg-black max-h-[60vh] w-full flex items-center justify-center border border-slate-800">
              <img
                src={modalImage.url}
                alt={modalImage.title}
                className="w-full h-auto max-h-[60vh] object-contain rounded-2xl shadow-lg"
              />
            </div>

            {/* Caption */}
            <div className="mt-3 w-full text-center px-2 max-h-[25vh] overflow-y-auto">
              <h4 className="text-sm sm:text-base font-black text-rose-300 mb-1">
                {modalImage.title}
              </h4>
              <p className="text-xs sm:text-sm font-extrabold text-white leading-relaxed">
                "{modalImage.caption}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
