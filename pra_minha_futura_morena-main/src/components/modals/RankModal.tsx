import React from 'react';
import { useStore } from '../../context/StoreContext';
import { STORE_RANKS } from '../../utils/ranks';
import { formatCurrency } from '../../utils/formatters';
import { X, Trophy, CheckCircle2, Lock, Sparkles, TrendingUp } from 'lucide-react';

interface RankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RankModal: React.FC<RankModalProps> = ({ isOpen, onClose }) => {
  const { rankProgress, summary } = useStore();

  if (!isOpen) return null;

  const { currentRank, nextRank, progressPct, remainingAmount } = rankProgress;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Carreira & Patentes da Loja</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sua evolução baseada no faturamento histórico total
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Card Patente Atual */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white border border-slate-800 relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentRank.badge}</span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Patente Atual
                  </span>
                  <h3 className="text-lg font-black text-white">
                    {currentRank.name} — {currentRank.title}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Faturamento Total
                </span>
                <span className="text-sm font-extrabold text-emerald-400 font-mono-numbers">
                  {formatCurrency(summary.totalFaturamento)}
                </span>
              </div>
            </div>

            {/* Barra para o próximo nível */}
            {nextRank ? (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>Próxima: {nextRank.badge} {nextRank.name} ({formatCurrency(nextRank.minRevenue)})</span>
                  </span>
                  <span className="text-amber-400 font-bold">{progressPct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(4, progressPct)}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Faltam apenas <strong className="text-white">{formatCurrency(remainingAmount)}</strong> em vendas para subir de patente!
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 pt-1">
                <Sparkles className="w-4 h-4" />
                <span>Parabéns! Você alcançou a patente máxima da RL Market!</span>
              </div>
            )}
          </div>

          {/* Árvore de Patentes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Hierarquia de Conquistas
            </h4>

            <div className="space-y-2.5">
              {STORE_RANKS.map((r, idx) => {
                const isCurrent = r.id === currentRank.id;
                const isUnlocked = summary.totalFaturamento >= r.minRevenue;

                return (
                  <div
                    key={r.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isCurrent
                        ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/40 shadow-sm'
                        : isUnlocked
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                        : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/40 opacity-70'
                    }`}
                  >
                    <div className="text-2xl shrink-0 pt-0.5">{r.badge}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                            {r.name}
                          </h5>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            • {r.title}
                          </span>
                        </div>
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                            Atual
                          </span>
                        ) : isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Conquistado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                            <Lock className="w-3 h-3" />
                            Bloqueado
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {r.maxRevenue
                          ? `A partir de ${formatCurrency(r.minRevenue)} até ${formatCurrency(r.maxRevenue)}`
                          : `Acima de ${formatCurrency(r.minRevenue)}`}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {r.description}
                      </p>

                      <div className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <span className="font-bold">Benefício:</span>
                        <span>{r.perk}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
