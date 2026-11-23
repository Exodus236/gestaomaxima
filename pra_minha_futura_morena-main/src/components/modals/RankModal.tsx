import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { STORE_RANKS } from '../../utils/ranks';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import {
  X,
  Trophy,
  CheckCircle2,
  Lock,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Flame,
  PackageCheck,
  Calendar,
  Layers,
  Crown,
  Share2,
} from 'lucide-react';

interface RankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RankModal: React.FC<RankModalProps> = ({ isOpen, onClose }) => {
  const { rankProgress, summary, nickname, sales, products, userLevelInfo } = useStore();
  const [activeTab, setActiveTab] = useState<'patentes' | 'conquistas'>('patentes');

  if (!isOpen) return null;

  const { currentRank, nextRank, progressPct, remainingAmount } = rankProgress;

  // Gradientes e estilos visuais metálicos por patente
  const rankThemes: Record<string, { bg: string; badgeGlow: string; border: string; textGradient: string }> = {
    bronze: {
      bg: 'from-amber-950/80 via-stone-900 to-amber-900/60',
      badgeGlow: 'shadow-amber-700/30 border-amber-600/40 text-amber-500',
      border: 'border-amber-700/40',
      textGradient: 'from-amber-400 via-orange-300 to-amber-500',
    },
    prata: {
      bg: 'from-slate-900 via-slate-800 to-zinc-900',
      badgeGlow: 'shadow-slate-400/30 border-slate-400/40 text-slate-300',
      border: 'border-slate-500/40',
      textGradient: 'from-slate-200 via-white to-slate-400',
    },
    ouro: {
      bg: 'from-yellow-950/90 via-amber-900/50 to-stone-950',
      badgeGlow: 'shadow-yellow-500/40 border-yellow-500/50 text-yellow-400',
      border: 'border-yellow-500/40',
      textGradient: 'from-yellow-300 via-amber-200 to-yellow-500',
    },
    safira: {
      bg: 'from-blue-950/90 via-slate-900 to-indigo-950/80',
      badgeGlow: 'shadow-blue-500/40 border-blue-500/50 text-blue-400',
      border: 'border-blue-500/40',
      textGradient: 'from-blue-300 via-sky-200 to-blue-400',
    },
    rubi: {
      bg: 'from-rose-950/90 via-stone-900 to-red-950/70',
      badgeGlow: 'shadow-rose-500/40 border-rose-500/50 text-rose-400',
      border: 'border-rose-500/40',
      textGradient: 'from-rose-300 via-red-200 to-rose-400',
    },
    platina: {
      bg: 'from-cyan-950/90 via-slate-900 to-teal-950/70',
      badgeGlow: 'shadow-cyan-500/40 border-cyan-500/50 text-cyan-400',
      border: 'border-cyan-500/40',
      textGradient: 'from-cyan-300 via-teal-200 to-cyan-400',
    },
    diamante: {
      bg: 'from-purple-950/90 via-fuchsia-950/60 to-slate-950',
      badgeGlow: 'shadow-purple-500/50 border-purple-500/50 text-purple-300',
      border: 'border-purple-500/40',
      textGradient: 'from-purple-300 via-pink-200 to-fuchsia-400',
    },
  };

  const theme = rankThemes[currentRank.id] || rankThemes.bronze;

  // Badges Colecionáveis e Conquistas
  const achievements = [
    {
      id: 'first_sale',
      title: 'Primeira Venda',
      desc: 'Realizou a primeira venda registrada na plataforma.',
      badge: '🎯',
      unlocked: sales.length >= 1,
      hint: `${sales.length >= 1 ? '1' : '0'}/1 venda`,
    },
    {
      id: 'fast_turnaround',
      title: 'Estoque Ativo',
      desc: 'Manteve 3 ou mais produtos ativos e cadastrados simultaneamente.',
      badge: '📦',
      unlocked: products.length >= 3,
      hint: `${products.length}/3 produtos`,
    },
    {
      id: 'golden_day',
      title: 'Vendedor Destaque',
      desc: 'Acumulou mais de R$ 500 em vendas totais.',
      badge: '⚡',
      unlocked: summary.totalFaturamento >= 500,
      hint: `${formatCurrency(summary.totalFaturamento)} de R$ 500,00`,
    },
    {
      id: 'four_figure_club',
      title: 'Clube dos 4 Dígitos',
      desc: 'Bateu a marca de R$ 1.000,00 em faturamento histórico.',
      badge: '💰',
      unlocked: summary.totalFaturamento >= 1000,
      hint: `${formatCurrency(summary.totalFaturamento)} de R$ 1.000,00`,
    },
    {
      id: 'profit_master',
      title: 'Lucro Líquido Real',
      desc: 'Acumulou mais de R$ 300,00 em lucro líquido limpo.',
      badge: '💎',
      unlocked: summary.lucroLiquidoAcumulado >= 300,
      hint: `${formatCurrency(summary.lucroLiquidoAcumulado)} de R$ 300,00`,
    },
    {
      id: 'zero_inventory',
      title: 'Giro Completo de Lote',
      desc: 'Vendeu produtos suficientes a ponto de esgotar ao menos 1 lote cadastrado.',
      badge: '🔥',
      unlocked: products.some((p) => p.status === 'esgotado' || p.quantity === 0),
      hint: products.some((p) => p.status === 'esgotado') ? 'Completado' : 'Aguardando esgotar 1 item',
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl shadow-inner">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Patentes & Conquistas da Loja</span>
              </h2>
              <p className="text-xs text-slate-400">
                Lojista: <strong className="text-slate-200">{nickname || 'Comerciante'}</strong> • {unlockedCount}/{achievements.length} medalhas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex items-center px-6 pt-3 gap-2 border-b border-slate-800/80 bg-slate-950/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('patentes')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'patentes'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Passe de Carreira</span>
          </button>
          <button
            onClick={() => setActiveTab('conquistas')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'conquistas'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Medalhas ({unlockedCount})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {activeTab === 'patentes' ? (
            <>
              {/* Card de Nível & XP do Lojista */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-purple-500/30 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-purple-900/40">
                    {userLevelInfo.level}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-purple-400 uppercase tracking-wider">
                        Nível {userLevelInfo.level}
                      </span>
                      <span className="text-xs text-slate-300 font-bold">
                        • {userLevelInfo.levelTitle}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      XP Total: <strong className="text-slate-200 font-mono-numbers">{userLevelInfo.currentXP} XP</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right min-w-[130px]">
                  <div className="text-[10px] text-slate-400 font-bold">
                    {userLevelInfo.xpInCurrentLevel} / {userLevelInfo.xpForNextLevel} XP ({userLevelInfo.progressPct.toFixed(0)}%)
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mt-1.5 border border-slate-700/60">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
                      style={{ width: `${userLevelInfo.progressPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-purple-300 font-medium block mt-1">
                    Venda (+100 XP) • Tarefa (+50 XP)
                  </span>
                </div>
              </div>

              {/* Card Holográfico / Metálico da Patente Atual */}
              <div
                className={`relative p-5 rounded-2xl bg-gradient-to-br ${theme.bg} text-white border ${theme.border} shadow-xl overflow-hidden space-y-4`}
              >
                {/* Efeito decorativo de fundo */}
                <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-slate-950/80 border flex items-center justify-center text-3xl shadow-lg ${theme.badgeGlow}`}
                    >
                      {currentRank.badge}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black text-amber-400/90 tracking-widest block">
                        Patente Atual do Lojista
                      </span>
                      <h3 className={`text-xl font-black bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                        {currentRank.name}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">
                        {currentRank.title}
                      </p>
                      <button
                        onClick={() => setActiveTab('conquistas')}
                        aria-label={`Abrir medalhas: ${unlockedCount} de ${achievements.length} coletadas`}
                        className={`mt-2 inline-flex items-center gap-1.5 rounded-lg border bg-slate-950/40 px-2 py-1 text-[10px] font-bold transition hover:bg-slate-950/70 ${theme.badgeGlow}`}
                      >
                        <Award className="h-3 w-3" />
                        <span>{unlockedCount}/{achievements.length} medalhas coletadas</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Faturamento Total
                    </span>
                    <span className="text-base font-black text-emerald-400 font-mono-numbers">
                      {formatCurrency(summary.totalFaturamento)}
                    </span>
                  </div>
                </div>

                {/* Trilha de XP para próxima patente */}
                {nextRank ? (
                  <div className="space-y-1.5 pt-2 border-t border-white/10 relative z-10">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                        <span>Próxima: {nextRank.badge} {nextRank.name} ({formatCurrency(nextRank.minRevenue)})</span>
                      </span>
                      <span className="text-amber-300 font-black">{progressPct.toFixed(1)}%</span>
                    </div>

                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-700 shadow-md shadow-amber-500/30"
                        style={{ width: `${Math.max(5, progressPct)}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-300">
                      Faltam apenas <strong className="text-white font-bold">{formatCurrency(remainingAmount)}</strong> em vendas para subir!
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 pt-2 border-t border-white/10">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Você atingiu a Patente Diamante Máxima! Verdadeiro Tubarão do Mercado.</span>
                  </div>
                )}
              </div>

              {/* Trilha de Patentes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Hierarquia Completa de Patentes
                </h4>

                <div className="space-y-2.5">
                  {STORE_RANKS.map((r) => {
                    const isCurrent = r.id === currentRank.id;
                    const isUnlocked = summary.totalFaturamento >= r.minRevenue;

                    return (
                      <div
                        key={r.id}
                        className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-md shadow-amber-500/5'
                            : isUnlocked
                            ? 'bg-slate-800/40 border-slate-700/60'
                            : 'bg-slate-900/40 border-slate-800/50 opacity-60'
                        }`}
                      >
                        <div className="text-2xl shrink-0 pt-0.5">{r.badge}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-bold text-white">
                                {r.name}
                              </h5>
                              <span className="text-xs text-slate-400 font-medium">
                                • {r.title}
                              </span>
                            </div>

                            {isCurrent ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                                Sua Patente
                              </span>
                            ) : isUnlocked ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" />
                                Desbloqueado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                <Lock className="w-3 h-3" />
                                {formatCurrency(r.minRevenue)}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {r.description}
                          </p>

                          <div className="mt-2 text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
                            <span className="font-bold">Privilégio:</span>
                            <span>{r.perk}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Tab de Medalhas e Conquistas */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Complete marcos para colecionar todas as insígnias</span>
                <span className="font-bold text-amber-400">{unlockedCount} de {achievements.length} completadas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                      ach.unlocked
                        ? 'bg-slate-800/60 border-emerald-500/30'
                        : 'bg-slate-900/30 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        ach.unlocked
                          ? 'bg-emerald-500/10 border border-emerald-500/20'
                          : 'bg-slate-800 border border-slate-700/50 grayscale'
                      }`}
                    >
                      {ach.badge}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="text-xs font-bold text-white truncate">
                          {ach.title}
                        </h5>
                        {ach.unlocked && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {ach.desc}
                      </p>
                      <span className="text-[10px] font-mono-numbers text-slate-500 mt-1 block">
                        {ach.hint}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
