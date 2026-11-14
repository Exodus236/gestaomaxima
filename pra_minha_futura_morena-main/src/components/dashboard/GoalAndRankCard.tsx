import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Target,
  Trophy,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  ShoppingBag,
} from 'lucide-react';

interface GoalAndRankCardProps {
  onOpenGoalModal: () => void;
  onOpenRankModal: () => void;
}

export const GoalAndRankCard: React.FC<GoalAndRankCardProps> = ({
  onOpenGoalModal,
  onOpenRankModal,
}) => {
  const { goalInfo, rankProgress, summary } = useStore();
  const { currentRank, nextRank } = rankProgress;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* CARD 1: META MENSAL DE VENDAS (7 Colunas) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
        {/* Fundo Decorativo Suave */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        <div>
          {/* Topo do Card */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Meta de Vendas do Mês</span>
                  {goalInfo.isCompleted && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wide">
                      <Sparkles className="w-2.5 h-2.5" />
                      Atingida!
                    </span>
                  )}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenGoalModal}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Ajustar Meta</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Números Principais & Porcentagem */}
          <div className="flex items-end justify-between mt-2 mb-2.5">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                Vendas Realizadas
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono-numbers">
                  {formatCurrency(goalInfo.currentMonthRevenue)}
                </span>
                <span className="text-xs font-semibold text-slate-400 font-mono-numbers">
                  / {formatCurrency(goalInfo.monthlyGoal)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                {goalInfo.progressPct.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Barra de Progresso com Gradiente */}
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60 mb-3">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                goalInfo.isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-400 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-400'
              }`}
              style={{ width: `${Math.max(2, goalInfo.progressPct)}%` }}
            ></div>
          </div>
        </div>

        {/* Rodapé Inteligente: Ritmo Diário e Estimativa */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                Ritmo Necessário
              </span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono-numbers">
                {goalInfo.isCompleted ? 'Concluído! 🏆' : `${formatCurrency(goalInfo.dailyPaceRequired)} / dia`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                Prazo Restante
              </span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">
                {goalInfo.daysRemainingInMonth} dias no mês
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: PATENTE DA LOJA (5 Colunas) */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
        {/* Brilho de Fundo da Patente */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12"></div>

        <div>
          {/* Topo do Card */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Patente da Loja
                </h3>
                <span className="text-[11px] text-slate-400">
                  Carreira & Nível do Lojista
                </span>
              </div>
            </div>

            <button
              onClick={onOpenRankModal}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Ver Patentes</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Emblema & Nome da Patente */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center text-2xl">
                {currentRank.badge}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {currentRank.name}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    Nível Atual
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {currentRank.title}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Histórico
              </span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                {formatCurrency(summary.totalFaturamento)}
              </span>
            </div>
          </div>
        </div>

        {/* Barra para o Próximo Nível */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {nextRank ? (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Rumo a {nextRank.badge} {nextRank.name}</span>
                </span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono-numbers">
                  {rankProgress.progressPct.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(4, rankProgress.progressPct)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Faltam {formatCurrency(rankProgress.remainingAmount)} em vendas para subir.
              </p>
            </>
          ) : (
            <p className="text-xs font-bold text-amber-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Você atingiu a patente máxima! 👑</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
