import { UserLevelInfo } from '../types';

/**
 * Cada tarefa concluída: +50 XP
 * Cada venda realizada: +100 XP (Dobrado)
 * Cada meta batida: +300 XP (Triplicado)
 */

export const XP_VALUES = {
  TASK_COMPLETED: 50,
  SALE_REGISTERED: 100, // Dobrado em relação à tarefa
  GOAL_COMPLETED: 300,  // Triplicado em relação à venda / 6x tarefa
};

export const LEVEL_TITLES: { [level: number]: string } = {
  1: 'Novato das Vendas',
  2: 'Praticante Ativo',
  3: 'Comerciante Esperto',
  4: 'Negociador de Elite',
  5: 'Estrategista de Giro',
  6: 'Mestre da Negociação',
  7: 'Gerente Ágil',
  8: 'Veterano do Mercado',
  9: 'Comandante Comercial',
  10: 'Lenda do Varejo',
};

/**
 * Fórmula de XP por nível:
 * Nível 1: 0 - 150 XP
 * Nível 2: 150 - 350 XP (precisa de 200 XP)
 * Nível 3: 350 - 650 XP (precisa de 300 XP)
 * etc... Cada nível subsequente precisa de 100 + (level * 50) XP.
 */
export function calculateUserLevel(totalXP: number): UserLevelInfo {
  const xp = Math.max(0, Math.floor(totalXP || 0));

  let level = 1;
  let accumulatedXPForLevel = 0;
  let neededForCurrentLevel = 150;

  while (xp >= accumulatedXPForLevel + neededForCurrentLevel) {
    accumulatedXPForLevel += neededForCurrentLevel;
    level++;
    neededForCurrentLevel = 100 + (level * 50);
  }

  const xpInCurrentLevel = xp - accumulatedXPForLevel;
  const progressPct = Math.min(100, Math.max(0, (xpInCurrentLevel / neededForCurrentLevel) * 100));

  const levelTitle = LEVEL_TITLES[level] || `Mestre Nv. ${level}`;

  // Estrelas de prestígio e cores de borda por faixa de level
  let starsCount = 0;
  let levelBorderColor = 'border-slate-400/60 shadow-slate-500/20';

  if (level >= 10) {
    starsCount = 3;
    levelBorderColor = 'border-amber-400 shadow-amber-400/40 text-amber-400';
  } else if (level >= 7) {
    starsCount = 2;
    levelBorderColor = 'border-purple-400 shadow-purple-400/30 text-purple-400';
  } else if (level >= 4) {
    starsCount = 1;
    levelBorderColor = 'border-blue-400 shadow-blue-400/30 text-blue-400';
  } else {
    starsCount = 0;
    levelBorderColor = 'border-emerald-400 shadow-emerald-400/20 text-emerald-400';
  }

  return {
    level,
    currentXP: xp,
    xpInCurrentLevel,
    xpForNextLevel: neededForCurrentLevel,
    progressPct,
    levelTitle,
    starsCount,
    levelBorderColor,
  };
}
