import { StoreRank, StoreRankProgress, StoreGoalInfo } from '../types';

export const STORE_RANKS: StoreRank[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    title: 'Lojista Iniciante',
    minRevenue: 0,
    maxRevenue: 1000,
    badge: '🥉',
    color: 'text-amber-700 dark:text-amber-500',
    bgColor: 'bg-amber-700/10 dark:bg-amber-500/15',
    borderColor: 'border-amber-700/30 dark:border-amber-500/30',
    cardBorderClass: 'border-amber-700/40 dark:border-amber-700/50 shadow-amber-900/10',
    description: 'Primeiros passos no mercado. O foco inicial é girar mercadorias e validar canais.',
    perk: 'Acesso a relatórios de margem e simulador de taxas de canais.',
  },
  {
    id: 'prata',
    name: 'Prata',
    title: 'Lojista Ativo',
    minRevenue: 1000,
    maxRevenue: 2500,
    badge: '🥈',
    color: 'text-slate-500 dark:text-slate-300',
    bgColor: 'bg-slate-400/10 dark:bg-slate-300/15',
    borderColor: 'border-slate-400/30 dark:border-slate-300/30',
    cardBorderClass: 'border-slate-400/50 dark:border-slate-400/50 shadow-slate-500/10',
    description: 'Tração conquistada! O capital está girando e criando uma base de clientes recorrentes.',
    perk: 'Geração rápida de comprovantes para WhatsApp e copy para anúncios.',
  },
  {
    id: 'ouro',
    name: 'Ouro',
    title: 'Lojista Pro',
    minRevenue: 2500,
    maxRevenue: 5000,
    badge: '🥇',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-500/10 dark:bg-yellow-400/15',
    borderColor: 'border-yellow-500/30 dark:border-yellow-400/30',
    cardBorderClass: 'border-yellow-500/50 dark:border-yellow-500/60 shadow-yellow-500/15',
    description: 'Vendas consistentes e capital crescente. Você já domina negociação e margens.',
    perk: 'Simulador avançado de giro e descontos para clientes indecisos.',
  },
  {
    id: 'safira',
    name: 'Safira',
    title: 'Lojista Expert',
    minRevenue: 5000,
    maxRevenue: 7500,
    badge: '💠',
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 dark:bg-blue-400/15',
    borderColor: 'border-blue-500/30 dark:border-blue-400/30',
    cardBorderClass: 'border-blue-500/50 dark:border-blue-500/60 shadow-blue-500/15',
    description: 'Meio caminho até os 5 dígitos! Fluxo de caixa forte e reposição contínua de estoque.',
    perk: 'Análise aprofundada de contas a receber e histórico de lucratividade líquida.',
  },
  {
    id: 'rubi',
    name: 'Rubi',
    title: 'Mestre do Varejo',
    minRevenue: 7500,
    maxRevenue: 10000,
    badge: '💎',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-500/10 dark:bg-rose-400/15',
    borderColor: 'border-rose-500/30 dark:border-rose-400/30',
    cardBorderClass: 'border-rose-500/50 dark:border-rose-500/60 shadow-rose-500/15',
    description: 'Operação de alta performance na iminência de cruzar os R$ 10.000,00 de faturamento.',
    perk: 'Prioridade máxima em metas dinâmicas diárias e controle de giro rápido.',
  },
  {
    id: 'platina',
    name: 'Platina',
    title: 'Lojista Elite',
    minRevenue: 10000,
    maxRevenue: 25000,
    badge: '⚡',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10 dark:bg-cyan-400/15',
    borderColor: 'border-cyan-500/30 dark:border-cyan-400/30',
    cardBorderClass: 'border-cyan-400/50 dark:border-cyan-400/60 shadow-cyan-400/15',
    description: 'Alto volume de vendas, reinvestimento agressivo e domínio dos marketplaces.',
    perk: 'Metas dinâmicas por ritmo diário e projeção patrimonial de estoque.',
  },
  {
    id: 'diamante',
    name: 'Diamante',
    title: 'Tubarão do Mercado',
    minRevenue: 25000,
    maxRevenue: null,
    badge: '👑',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10 dark:bg-purple-400/15',
    borderColor: 'border-purple-500/30 dark:border-purple-400/30',
    cardBorderClass: 'border-purple-500/60 dark:border-purple-500/70 shadow-purple-500/20',
    description: 'Referência em escala, autoridade máxima e patrimônio comercial consolidado.',
    perk: 'Patente máxima da RL Market: o topo do ecossistema de vendas!',
  },
];

export function calculateStoreRank(totalRevenue: number): StoreRankProgress {
  const rev = Math.max(0, totalRevenue || 0);

  let currentRankIndex = 0;
  for (let i = STORE_RANKS.length - 1; i >= 0; i--) {
    if (rev >= STORE_RANKS[i].minRevenue) {
      currentRankIndex = i;
      break;
    }
  }

  const currentRank = STORE_RANKS[currentRankIndex];
  const nextRank = currentRankIndex < STORE_RANKS.length - 1 ? STORE_RANKS[currentRankIndex + 1] : null;

  if (!nextRank || currentRank.maxRevenue === null) {
    return {
      currentRank,
      nextRank: null,
      totalRevenue: rev,
      progressPct: 100,
      remainingAmount: 0,
    };
  }

  const rangeSpan = nextRank.minRevenue - currentRank.minRevenue;
  const currentInSpan = rev - currentRank.minRevenue;
  const progressPct = Math.min(100, Math.max(0, (currentInSpan / rangeSpan) * 100));
  const remainingAmount = Math.max(0, nextRank.minRevenue - rev);

  return {
    currentRank,
    nextRank,
    totalRevenue: rev,
    progressPct,
    remainingAmount,
  };
}

export function calculateStoreGoalInfo(
  monthlyGoal: number,
  currentMonthRevenue: number,
  currentMonthProfit: number,
  currentMonthSalesCount: number
): StoreGoalInfo {
  const goal = Math.max(1, monthlyGoal || 1000);
  const rev = Math.max(0, currentMonthRevenue || 0);
  const profit = Math.max(0, currentMonthProfit || 0);

  const progressPct = Math.min(100, (rev / goal) * 100);
  const remainingAmount = Math.max(0, goal - rev);
  const isCompleted = rev >= goal;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemainingInMonth = Math.max(1, daysInMonth - currentDay + 1);

  const dailyPaceRequired = isCompleted ? 0 : remainingAmount / daysRemainingInMonth;

  const averageTicket = currentMonthSalesCount > 0 ? rev / currentMonthSalesCount : 0;
  const estimatedOrdersNeeded =
    isCompleted
      ? 0
      : averageTicket > 0
      ? Math.ceil(remainingAmount / averageTicket)
      : Math.ceil(remainingAmount / 100);

  return {
    monthlyGoal: goal,
    currentMonthRevenue: rev,
    currentMonthProfit: profit,
    progressPct,
    remainingAmount,
    isCompleted,
    daysRemainingInMonth,
    dailyPaceRequired,
    estimatedOrdersNeeded,
    averageTicket,
  };
}
