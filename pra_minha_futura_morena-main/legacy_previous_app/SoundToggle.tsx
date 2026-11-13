import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const SoundToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(true);

  const toggle = () => {
    sounds.enabled = !enabled;
    setEnabled(!enabled);
    if (!enabled) {
      sounds.playPop();
    }
  };

  return (
    <button
      onClick={toggle}
      title={enabled ? "Desativar sons" : "Ativar sons"}
      className="fixed top-4 right-4 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:shadow-lg border border-rose-200/80 text-rose-700 hover:text-rose-900 transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center"
    >
      {enabled ? <Volume2 size={20} /> : <VolumeX size={20} className="text-gray-400" />}
    </button>
  );
};
