import React, { useEffect } from 'react';
import { StoreRank } from '../../types';
import { Sparkles, Trophy, ArrowRight, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  rank: StoreRank | null;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ rank, onClose }) => {
  useEffect(() => {
    if (rank) {
      // Chuva de confetes comemorativa
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'],
        });
        const timer = setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 300);
        return () => clearTimeout(timer);
      } catch (e) {
        console.error(e);
      }
    }
  }, [rank]);

  if (!rank) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 overflow-hidden">
        {/* Efeito de brilho de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-b from-yellow-500/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Emblema Animado */}
        <div className="relative pt-2">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-800/80 border-2 border-yellow-500/50 shadow-xl shadow-yellow-500/20 text-5xl animate-bounce">
            {rank.badge}
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Level Up!</span>
          </div>
        </div>

        {/* Textos */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest block">
            Nova Patente Conquistada
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Patente {rank.name}
          </h2>
          <p className="text-sm font-semibold text-slate-300">
            {rank.title}
          </p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto pt-1 leading-relaxed">
            {rank.description}
          </p>
        </div>

        {/* Card do Benefício / Conquista */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Check className="w-4 h-4 shrink-0" />
            <span>Marco Desbloqueado:</span>
          </div>
          <p className="text-xs text-slate-300 pl-6 leading-relaxed">
            {rank.perk}
          </p>
        </div>

        {/* Botão de Continuar */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-yellow-500/20 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trophy className="w-4 h-4" />
          <span>Continuar Vendendo!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
