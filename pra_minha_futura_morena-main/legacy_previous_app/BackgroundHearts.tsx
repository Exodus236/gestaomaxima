import React, { useEffect, useState } from 'react';

interface FloatingHeart {
  id: number;
  left: number; // percentage
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
  rotation: number;
}

interface TapHeart {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export const BackgroundHearts: React.FC = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [tapHearts, setTapHearts] = useState<TapHeart[]>([]);

  useEffect(() => {
    // Generate initial set of ambient background floating hearts
    const heartList: FloatingHeart[] = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      heartList.push({
        id: i,
        left: Math.random() * 96 + 2, // 2% to 98%
        size: Math.random() * 22 + 10, // 10px to 32px
        duration: Math.random() * 8 + 6, // 6s to 14s
        delay: Math.random() * 8, // 0s to 8s
        opacity: Math.random() * 0.45 + 0.25, // 0.25 to 0.70
        rotation: Math.random() * 360,
      });
    }
    setHearts(heartList);

    // Global tap handler for romantic particle burst
    const handlePointerDown = (e: PointerEvent) => {
      // Don't spawn tap particle if clicking inside an interactive button to avoid clutter,
      // or spawn gentle emoji burst
      const emojis = ['❤️', '💖', '💕', '✨', '🌸', '🍣'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      
      const newTap: TapHeart = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        emoji: randomEmoji,
      };

      setTapHearts((prev) => [...prev.slice(-15), newTap]);

      // Remove after animation completes
      setTimeout(() => {
        setTapHearts((prev) => prev.filter((h) => h.id !== newTap.id));
      }, 1000);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute animate-float-up text-rose-400/60 transition-transform"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
            transform: `rotate(${h.rotation}deg)`,
          }}
        >
          ❤️
        </div>
      ))}

      {/* Tap particles */}
      {tapHearts.map((t) => (
        <div
          key={t.id}
          className="absolute text-xl pointer-events-none transition-all duration-700 ease-out"
          style={{
            left: `${t.x - 12}px`,
            top: `${t.y - 12}px`,
            animation: 'popIn 0.8s ease-out forwards',
          }}
        >
          <span className="inline-block animate-bounce">{t.emoji}</span>
        </div>
      ))}
    </div>
  );
};
