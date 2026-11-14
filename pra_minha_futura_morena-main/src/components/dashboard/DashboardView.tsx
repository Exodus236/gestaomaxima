import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatPercent, formatDate, formatDateTime, getChannelLabel } from '../../utils/formatters';
import {
  Wallet,
  Package,
  TrendingUp,
  ShoppingCart,
  CheckSquare,
  ArrowUpRight,
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles,
  DollarSign,
  Plus,
} from 'lucide-react';
import { ActiveTab } from '../layout/Navigation';
import { GoalAndRankCard } from './GoalAndRankCard';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenNewSale: (productId?: string) => void;
  onOpenNewProduct: () => void;
  onOpenTransaction: () => void;
  onOpenTask: () => void;
  onOpenGoalModal: () => void;
  onOpenRankModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewSale,
  onOpenNewProduct,
  onOpenTransaction,
  onOpenTask,
  onOpenGoalModal,
  onOpenRankModal,
}) => {
  const { summary, sales, tasks, products, toggleTask } = useStore();

  const recentSales = sales.slice(0, 5);
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 5);
  const lowStockProducts = products.filter((p) => p.quantity <= 1);

  // Patrimônio Total da Loja = Capital + Estoque
  const patrimonioTotal = summary.capitalDisponivel + summary.totalInvestidoEstoque;
  const pctCapital = patrimonioTotal > 0 ? (summary.capitalDisponivel / patrimonioTotal) * 100 : 0;
  const pctEstoque = patrimonioTotal > 0 ? (summary.totalInvestidoEstoque / patrimonioTotal) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Banner de Boas-Vindas & Ações Rápidas */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Painel de Controle Centralizado</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              RL Market — Gestão Inteligente
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Tarefas, estoque, vendas e fluxo de caixa sincronizados em tempo real. Cada venda atualiza seu lucro e reabastece seu caixa automaticamente.
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenNewSale()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>+ Registrar Venda</span>
            </button>
            <button
              onClick={onOpenNewProduct}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/10 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </button>
            <button
              onClick={onOpenTransaction}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/10 transition cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>Movimentar Caixa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metas do Mês & Patente da Loja */}
      <GoalAndRankCard
        onOpenGoalModal={onOpenGoalModal}
        onOpenRankModal={onOpenRankModal}
      />

      {/* 6 Indicadores Principais (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Capital disponível */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Capital Disponível
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {formatCurrency(summary.capitalDisponivel)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>Dinheiro em caixa para novas compras</span>
          </p>
        </div>

        {/* 2. Total investido em mercadorias */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Investido em Estoque
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {formatCurrency(summary.totalInvestidoEstoque)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{summary.totalItensEmEstoque} unidades em {summary.totalProdutosCadastrados} produtos</span>
          </p>
        </div>

        {/* 3. Valor potencial de venda */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Potencial de Venda (Estoque)
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {formatCurrency(summary.valorPotencialEstoque)}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            + {formatCurrency(summary.lucroPotencialEstoque)} de lucro futuro previsto
          </p>
        </div>

        {/* 4. Lucro acumulado */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lucro Acumulado
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
            {formatCurrency(summary.lucroBrutoAcumulado)}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>Líquido pós-despesas:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono-numbers">
              {formatCurrency(summary.lucroLiquidoAcumulado)}
            </span>
          </div>
        </div>

        {/* 5. Vendas do mês */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Vendas do Mês
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {formatCurrency(summary.vendasDoMesFaturamento)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{summary.vendasDoMesCount} vendas realizadas</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(summary.vendasDoMesLucro)} lucro
            </span>
          </p>
        </div>

        {/* 6. Tarefas pendentes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tarefas Pendentes
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {summary.tarefasPendentesCount}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            {summary.tarefasAltaPrioridadeCount > 0 ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                {summary.tarefasAltaPrioridadeCount} de alta prioridade
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Tudo sob controle!</span>
            )}
            <button
              onClick={() => onNavigate('tasks')}
              className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
            >
              Ver todas →
            </button>
          </p>
        </div>
      </div>

      {/* Barra de Distribuição de Patrimônio da Loja */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Composição Patrimonial da Loja
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Patrimônio Total: <strong className="text-slate-900 dark:text-white font-mono-numbers">{formatCurrency(patrimonioTotal)}</strong> (Capital Disponível + Mercadorias em Estoque)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-300">
                Capital ({formatPercent(pctCapital)})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-slate-600 dark:text-slate-300">
                Estoque ({formatPercent(pctEstoque)})
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Progresso visual */}
        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${pctCapital}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Capital: ${formatPercent(pctCapital)}`}
          />
          <div
            style={{ width: `${pctEstoque}%` }}
            className="bg-blue-500 transition-all duration-500"
            title={`Estoque: ${formatPercent(pctEstoque)}`}
          />
        </div>
      </div>

      {/* Alerta de Produtos com Estoque Baixo ou Esgotado */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              Alerta de Estoque Crítico ({lowStockProducts.length} itens precisam de atenção)
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2"
                >
                  <span className="font-semibold">{p.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${p.quantity === 0 ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                    {p.quantity === 0 ? 'Esgotado' : `${p.quantity} un`}
                  </span>
                  <button
                    onClick={() => onNavigate('products')}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-[11px]"
                  >
                    Repor
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grade: Últimas Vendas & Tarefas Prioritárias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloco 1: Últimas Vendas */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Últimas Vendas Registradas
                </h3>
              </div>
              <button
                onClick={() => onNavigate('sales')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Ver histórico <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentSales.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Nenhuma venda registrada ainda. Clique no botão acima para registrar a primeira!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                        {sale.productPhoto ? (
                          <img src={sale.productPhoto} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {sale.productName}
                        </h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{sale.quantity} un.</span>
                          <span>•</span>
                          <span>{getChannelLabel(sale.channel)}</span>
                          <span>•</span>
                          <span>{formatDate(sale.soldAt)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white font-mono-numbers">
                        {formatCurrency(sale.totalReceived)}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                        + {formatCurrency(sale.grossProfit)} lucro
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenNewSale()}
            className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-emerald-500/40 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/5 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nova Venda</span>
          </button>
        </div>

        {/* Bloco 2: Tarefas Prioritárias & Checklist */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-purple-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Checklist & Tarefas da Loja
                </h3>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                Gerenciar tarefas <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Todas as tarefas foram concluídas! Parabéns. 🎉
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 group-hover:border-purple-500 flex items-center justify-center transition shrink-0">
                        {t.completed && <div className="w-2.5 h-2.5 bg-purple-500 rounded-xs" />}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate block">
                          {t.title}
                        </span>
                        {t.notes && (
                          <span className="text-[11px] text-slate-400 truncate block">
                            {t.notes}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        t.priority === 'alta'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenTask}
            className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-purple-500/40 hover:border-purple-500 text-purple-600 dark:text-purple-400 text-xs font-bold hover:bg-purple-500/5 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Tarefa ou Checklist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
