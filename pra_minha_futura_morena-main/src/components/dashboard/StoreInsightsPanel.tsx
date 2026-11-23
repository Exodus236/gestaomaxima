import React from 'react';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Boxes, CircleDollarSign, ClipboardCheck, PackagePlus } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

const DAY_MS = 24 * 60 * 60 * 1000;

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace('.', '');
}

export const StoreInsightsPanel: React.FC = () => {
  const { products, sales, tasks, summary, capital } = useStore();
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * DAY_MS);
  const previous30Days = new Date(now.getTime() - 60 * DAY_MS);
  const last60Days = new Date(now.getTime() - 60 * DAY_MS);
  const recentSales = sales.filter((sale) => new Date(sale.soldAt) >= last30Days);
  const previousSales = sales.filter((sale) => {
    const soldAt = new Date(sale.soldAt);
    return soldAt >= previous30Days && soldAt < last30Days;
  });
  const activeProducts = products.filter((product) => product.quantity > 0);
  const soldRecently = new Set(recentSales.map((sale) => sale.productId));

  const profitMargin = recentSales.length
    ? recentSales.reduce((total, sale) => total + sale.netProfit, 0) /
      Math.max(1, recentSales.reduce((total, sale) => total + sale.totalReceived, 0))
    : 0;
  const profitScore = recentSales.length ? Math.max(0, Math.min(100, 50 + profitMargin * 200)) : 50;
  const turnoverScore = activeProducts.length
    ? (activeProducts.filter((product) => soldRecently.has(product.id)).length / activeProducts.length) * 100
    : 70;
  const currentRevenue = recentSales.reduce((total, sale) => total + sale.totalReceived, 0);
  const previousRevenue = previousSales.reduce((total, sale) => total + sale.totalReceived, 0);
  const salesScore = previousRevenue > 0
    ? Math.max(10, Math.min(100, (currentRevenue / previousRevenue) * 60 + 40))
    : currentRevenue > 0 ? 75 : 50;
  const recentTasks = tasks.filter((task) => new Date(task.createdAt) >= last30Days && !task.dismissed);
  const organizationScore = recentTasks.length
    ? (recentTasks.filter((task) => task.completed).length / recentTasks.length) * 100
    : 70;
  const healthScore = Math.round(profitScore * 0.3 + turnoverScore * 0.25 + salesScore * 0.25 + organizationScore * 0.2);

  const healthDrivers = [
    { label: 'Lucro líquido', score: Math.round(profitScore), detail: recentSales.length ? `${(profitMargin * 100).toFixed(1)}% de margem nos últimos 30 dias` : 'Ainda sem vendas recentes', icon: CircleDollarSign },
    { label: 'Giro de estoque', score: Math.round(turnoverScore), detail: `${soldRecently.size} de ${activeProducts.length} produtos vendidos no período`, icon: Boxes },
    { label: 'Vendas', score: Math.round(salesScore), detail: previousRevenue ? `${currentRevenue >= previousRevenue ? 'Acima' : 'Abaixo'} do período anterior` : 'Comparação começa após o próximo mês', icon: BarChart3 },
    { label: 'Organização', score: Math.round(organizationScore), detail: recentTasks.length ? `${recentTasks.filter((task) => task.completed).length} de ${recentTasks.length} tarefas recentes concluídas` : 'Sem tarefas recentes para avaliar', icon: ClipboardCheck },
  ];

  const stalledProducts = activeProducts
    .map((product) => {
      const lastSale = sales
        .filter((sale) => sale.productId === product.id)
        .reduce<Date | null>((latest, sale) => {
          const soldAt = new Date(sale.soldAt);
          return !latest || soldAt > latest ? soldAt : latest;
        }, null);
      const referenceDate = lastSale || new Date(product.createdAt);
      return { product, daysIdle: Math.floor((now.getTime() - referenceDate.getTime()) / DAY_MS) };
    })
    .filter((item) => item.daysIdle >= 5)
    .sort((a, b) => b.daysIdle - a.daysIdle)
    .slice(0, 3);

  const allUrgentTasks = tasks
    .filter((task) => !task.completed && !task.dismissed && (task.priority === 'alta' || (task.dueDate && new Date(task.dueDate) <= now)));
  const urgentTasks = allUrgentTasks
    .slice(0, 3);
  const followUpReminders = sales
    .filter((sale) => sale.afterSaleStatus !== 'resolved' && sale.followUpDate)
    .filter((sale) => {
      const followUpTime = new Date(sale.followUpDate as string).getTime();
      return followUpTime >= now.getTime() - DAY_MS && followUpTime <= now.getTime() + 7 * DAY_MS;
    })
    .slice(0, 3);

  const restockSuggestions = products
    .filter((product) => product.kind !== 'servico')
    .map((product) => {
      const unitsSold = sales
        .filter((sale) => sale.productId === product.id && new Date(sale.soldAt) >= last60Days)
        .reduce((total, sale) => total + sale.quantity, 0);
      const dailyRate = unitsSold / 60;
      const targetStock = Math.ceil(dailyRate * 14);
      const suggestedQuantity = Math.max(0, targetStock - product.quantity);
      return { product, suggestedQuantity, investment: suggestedQuantity * product.costPrice, daysLeft: dailyRate ? Math.floor(product.quantity / dailyRate) : null };
    })
    .filter((item) => item.suggestedQuantity > 0)
    .sort((a, b) => (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity))
    .slice(0, 5);
  const restockTotal = restockSuggestions.reduce((total, item) => total + item.investment, 0);

  const chartMonths = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const monthSales = sales.filter((sale) => {
      const soldAt = new Date(sale.soldAt);
      return soldAt.getFullYear() === date.getFullYear() && soldAt.getMonth() === date.getMonth();
    });
    return {
      label: monthLabel(date),
      revenue: monthSales.reduce((total, sale) => total + sale.totalReceived, 0),
      profit: monthSales.reduce((total, sale) => total + sale.netProfit, 0),
    };
  });
  const chartValues = chartMonths.flatMap((month) => [month.revenue, month.profit]);
  const chartMin = Math.min(0, ...chartValues);
  const chartMax = Math.max(1, ...chartValues);
  const chartX = (index: number) => 38 + (index * 520) / Math.max(1, chartMonths.length - 1);
  const chartY = (value: number) => 142 - ((value - chartMin) / (chartMax - chartMin)) * 112;
  const chartPath = (key: 'revenue' | 'profit') => chartMonths
    .map((month, index) => `${index === 0 ? 'M' : 'L'} ${chartX(index)} ${chartY(month[key])}`)
    .join(' ');

  const alerts = [
    ...stalledProducts.map(({ product, daysIdle }) => ({ key: `stalled-${product.id}`, label: `${product.name} está sem venda há ${daysIdle} dias`, detail: `${product.quantity} un. em estoque`, tone: 'amber' })),
    ...urgentTasks.map((task) => ({ key: `task-${task.id}`, label: task.title, detail: 'Tarefa prioritária', tone: 'rose' })),
    ...followUpReminders.map((sale) => ({ key: `followup-${sale.id}`, label: `Pós-venda: ${sale.customerName || sale.productName}`, detail: `${sale.productName} · lembrar em ${new Date(sale.followUpDate as string).toLocaleDateString('pt-BR')}`, tone: 'rose' })),
  ];

  return (
    <section className="space-y-4" aria-label="Central do dia e inteligência da loja">
      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Central do dia</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">O que merece sua atenção agora</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{now.toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <span className="block text-[10px] uppercase font-bold text-slate-500">A receber</span>
              <strong className="mt-1 block text-sm text-amber-600 dark:text-amber-400">{formatCurrency(summary.totalContasAReceber)}</strong>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <span className="block text-[10px] uppercase font-bold text-slate-500">Lucro do mês</span>
              <strong className="mt-1 block text-sm text-emerald-600 dark:text-emerald-400">{formatCurrency(summary.vendasDoMesLucro)}</strong>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <span className="block text-[10px] uppercase font-bold text-slate-500">Estoque baixo</span>
              <strong className="mt-1 block text-sm text-slate-900 dark:text-white">{products.filter((product) => product.quantity <= 1).length} produtos</strong>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <span className="block text-[10px] uppercase font-bold text-slate-500">Prioridades</span>
              <strong className="mt-1 block text-sm text-rose-600 dark:text-rose-400">{allUrgentTasks.length + followUpReminders.length} itens</strong>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <span className="block text-[10px] uppercase font-bold text-slate-500">Receita de serviços</span>
              <strong className="mt-1 block text-sm text-emerald-600 dark:text-emerald-400">{formatCurrency(summary.totalFaturamentoServicos)}</strong>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <span className="block text-[10px] uppercase font-bold text-slate-500">Compras de estoque</span>
              <strong className="mt-1 block text-sm text-blue-600 dark:text-blue-400">{formatCurrency(summary.totalComprasEstoque)}</strong>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {alerts.length ? alerts.map((alert) => (
              <div key={alert.key} className="flex items-start gap-2.5 py-2.5">
                <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${alert.tone === 'rose' ? 'text-rose-500' : 'text-amber-500'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{alert.label}</p>
                  <p className="text-[11px] text-slate-500">{alert.detail}</p>
                </div>
              </div>
            )) : <p className="py-3 text-xs text-emerald-600 dark:text-emerald-400">Sem alertas prioritários por enquanto.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Saúde da loja</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Lucro, giro, vendas e organização</p>
            </div>
            <div className="flex items-baseline gap-1">
              <strong className="text-3xl font-black text-slate-900 dark:text-white">{healthScore}</strong>
              <span className="text-xs text-slate-500">/100</span>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4">
            <div className={`h-full rounded-full ${healthScore >= 70 ? 'bg-emerald-500' : healthScore >= 45 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${healthScore}%` }} />
          </div>
          <div className="space-y-3">
            {healthDrivers.map((driver) => {
              const Icon = driver.icon;
              return (
                <div key={driver.label} className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-200">{driver.label}</span>
                      <span className="font-semibold text-slate-500">{driver.score}</span>
                    </div>
                    <p className="truncate text-[10px] text-slate-500">{driver.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Evolução da loja</h2>
              <p className="text-xs text-slate-500">Faturamento e lucro líquido por mês</p>
            </div>
            <div className="flex gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1.5 text-blue-600"><i className="h-2 w-2 rounded-full bg-blue-500" />Faturamento</span>
              <span className="flex items-center gap-1.5 text-emerald-600"><i className="h-2 w-2 rounded-full bg-emerald-500" />Lucro</span>
            </div>
          </div>
          <svg className="h-44 w-full overflow-visible" viewBox="0 0 580 170" role="img" aria-label="Gráfico dos últimos seis meses">
            {[0, 1, 2, 3].map((line) => <line key={line} x1="36" x2="564" y1={30 + line * 36} y2={30 + line * 36} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 5" />)}
            <path d={chartPath('revenue')} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d={chartPath('profit')} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {chartMonths.map((month, index) => (
              <g key={`${month.label}-${index}`}>
                <circle cx={chartX(index)} cy={chartY(month.revenue)} r="3.5" fill="#3b82f6" />
                <circle cx={chartX(index)} cy={chartY(month.profit)} r="3.5" fill="#10b981" />
                <text x={chartX(index)} y="163" textAnchor="middle" className="fill-slate-500 text-[10px]">{month.label}</text>
              </g>
            ))}
          </svg>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            {chartMonths.length > 0 && <span>Último mês: {formatCurrency(chartMonths[chartMonths.length - 1].revenue)} faturados, {formatCurrency(chartMonths[chartMonths.length - 1].profit)} de lucro.</span>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Reposição inteligente</h2>
              <p className="text-xs text-slate-500">Estimativa para manter cerca de 14 dias de estoque</p>
            </div>
            <PackagePlus className="h-5 w-5 text-emerald-600" />
          </div>
          {restockSuggestions.length ? (
            <>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {restockSuggestions.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{item.product.name}</p>
                      <p className="text-[10px] text-slate-500">{item.product.quantity} em estoque · sugerido: +{item.suggestedQuantity}</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-slate-700 dark:text-slate-200">{formatCurrency(item.investment)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 text-xs">
                <span className="text-slate-500">Capital comprometido / disponível</span>
                <strong className={restockTotal > capital ? 'text-rose-600' : 'text-emerald-600'}>{formatCurrency(restockTotal)} / {formatCurrency(capital)}</strong>
              </div>
              {restockTotal > capital && <p className="mt-2 text-[10px] text-rose-600">A sugestão total excede o capital disponível.</p>}
            </>
          ) : <p className="py-5 text-xs text-slate-500">Ainda não há vendas recentes suficientes para estimar reposição.</p>}
        </div>
      </div>
    </section>
  );
};