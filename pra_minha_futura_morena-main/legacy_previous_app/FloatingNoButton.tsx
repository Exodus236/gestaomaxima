import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../utils/soundEffects';

interface FloatingNoButtonProps {
  label?: string;
}

const TEASING_MESSAGES = [
  "Tem certeza? 😂",
  "Pensa melhor...",
  "Resposta inválida.",
  "Nem tenta 😎",
  "Ops! Errou o botão 😜",
  "Esse botão tá quebrado! ❤️",
  "Não vale! 🙈",
  "Clica no Sim, vai! 👉",
  "Já era, é Sim! 💍",
  "Nem a pau! 🏃‍♂️",
];

export const FloatingNoButton: React.FC<FloatingNoButtonProps> = ({
  label = "🙈 Não",
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isEvasive, setIsEvasive] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  // Safe Dodge action calculator bounded strictly inside visible screen viewport
  const dodge = useCallback(() => {
    (window as any).__lastDodgeTimestamp = Date.now();
    sounds.playDodge();

    const btnWidth = buttonRef.current?.offsetWidth || 120;
    const btnHeight = buttonRef.current?.offsetHeight || 50;

    // Viewport dimensions with strict safety padding
    const vpWidth = Math.max(300, window.innerWidth || document.documentElement.clientWidth);
    const vpHeight = Math.max(450, window.innerHeight || document.documentElement.clientHeight);

    // Padding ensures button + popover message stay well within screen edges
    const minX = 30;
    const maxX = Math.max(minX, vpWidth - btnWidth - 30);

    const minY = 90; // keep below top header bar and leaves room for popover message above
    const maxY = Math.max(minY, vpHeight - btnHeight - 90);

    const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    // Random rotation between -12deg and +12deg
    const randomRot = Math.floor(Math.random() * 24) - 12;
    // Random scale between 0.9 and 1.05
    const randomScale = Number((Math.random() * 0.15 + 0.9).toFixed(2));

    setCoords({ x: randomX, y: randomY });
    setRotation(randomRot);
    setScale(randomScale);
    setIsEvasive(true);

    setDodgeCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= 1) {
        const msgIndex = (nextCount - 1) % TEASING_MESSAGES.length;
        setCurrentMessage(TEASING_MESSAGES[msgIndex]);
        setShowMessage(true);
      }
      return nextCount;
    });
  }, []);

  // Desktop proximity listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      // Trigger dodge when cursor comes within 100px on desktop
      if (distance < 100) {
        dodge();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [dodge]);

  // Mobile touch / click attempt handler
  const handleTouchOrAttempt = (e: React.SyntheticEvent) => {
    (window as any).__lastDodgeTimestamp = Date.now();
    e.preventDefault();
    e.stopPropagation();
    dodge();
  };

  return (
    <div
      className={
        isEvasive
          ? "fixed z-50 transition-all duration-300 ease-out animate-float-bounce pointer-events-auto"
          : "relative inline-block animate-float-bounce"
      }
      style={
        isEvasive
          ? {
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              transform: `rotate(${rotation}deg) scale(${scale})`,
            }
          : {}
      }
    >
      {/* Teasing message popover above button */}
      {showMessage && currentMessage && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-600 text-white font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-full shadow-xl border-2 border-white animate-bounce z-50 pointer-events-none">
          {currentMessage}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-rose-600" />
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onMouseEnter={handleTouchOrAttempt}
        onTouchStart={handleTouchOrAttempt}
        onPointerDown={handleTouchOrAttempt}
        onClick={handleTouchOrAttempt}
        className="px-6 py-3.5 bg-white/95 hover:bg-rose-100 text-gray-800 font-extrabold rounded-2xl shadow-xl border-2 border-rose-300 cursor-pointer transition-all duration-200 select-none active:scale-95 flex items-center justify-center gap-2"
        style={{ touchAction: 'none' }}
      >
        <span className="text-lg">{label}</span>
      </button>
    </div>
  );
};
