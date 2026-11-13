import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  formatCurrency,
  formatPercent,
  formatDate,
  getChannelLabel,
} from '../../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  Package,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { products, sales, transactions, summary, capital } = useStore();

  // 1. PRODUTOS MAIS VENDIDOS
  const salesByProduct: { [productId: string]: { name: string; quantity: number; revenue: number; profit: number } } = {};
  sales.forEach((s) => {
    if (!salesByProduct[s.productId]) {
      salesByProduct[s.productId] = {
        name: s.productName,
        quantity: 0,
        revenue: 0,
        profit: 0,
      };
    }
    salesByProduct[s.productId].quantity += s.quantity;
    salesByProduct[s.productId].revenue += s.totalReceived;
    salesByProduct[s.productId].profit += s.grossProfit;
  });

  const topSellingProducts = Object.values(salesByProduct).sort(
    (a, b) => b.quantity - a.quantity
  );

  // 2. PRODUTOS PARADOS (SEM VENDAS OU COM ESTOQUE SEM GIRO)
  const soldProductIds = new Set(sales.map((s) => s.productId));
  const stagnantProducts = products.filter(
    (p) => !soldProductIds.has(p.id) && p.quantity > 0
  );

  // 3. MARGEM DE LUCRO POR PRODUTO CADASTRADO
  const productsWithMargin = products.map((p) => {
    const profit = p.salePrice - p.costPrice;
    const marginPct = p.salePrice > 0 ? (profit / p.salePrice) * 100 : 0;
    return {
      ...p,
      unitProfit: profit,
      marginPct,
    };
  }).sort((a, b) => b.marginPct - a.marginPct);

  // 4. EVOLUÇÃO E FATURAMENTO POR CANAL DE VENDA
  const salesByChannel: { [channel: string]: { count: number; total: number; profit: number } } = {};
  sales.forEach((s) => {
    if (!salesByChannel[s.channel]) {
      salesByChannel[s.channel] = { count: 0, total: 0, profit: 0 };
    }
    salesByChannel[s.channel].count += 1;
    salesByChannel[s.channel].total += s.totalReceived;
    salesByChannel[s.channel].profit += s.grossProfit;
  });

  // Exportação CSV para Excel
  const handleExportCSV = () => {
    const headers = [
      'Código',
      'Data',
      'Produto',
      'Quantidade',
      'Preço Custo Unit',
      'Preço Venda Unit',
      'Total Recebido',
      'Custo Total (CMV)',
      'Lucro Bruto',
      'Margem %',
      'Canal',
      'Pagamento',
      'Cliente',
    ];

    const rows = sales.map((s) => [
      s.code,
      s.soldAt.slice(0, 10),
      `"${s.productName.replace(/"/g, '""')}"`,
      s.quantity,
      s.unitCostPrice.toFixed(2),
      s.unitFinalPrice.toFixed(2),
      s.totalReceived.toFixed(2),
      s.totalCost.toFixed(2),
      s.grossProfit.toFixed(2),
      s.profitMarginPct.toFixed(1),
      s.channel,
      s.paymentMethod,
      `"${(s.customerName || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio-vendas-rlmarket-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Relatórios & Inteligência da Loja
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              Métricas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Análise de produtos mais vendidos, produtos parados, margens de lucro e desempenho por canal.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={sales.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer disabled:opacity-40"
        >
          <Download className="w-4 h-4 text-emerald-500" />
          <span>Exportar Vendas para Excel (CSV)</span>
        </button>
      </div>

      {/* Grade de Destaques: Produtos Mais Vendidos vs Produtos Parados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloco 1: Produtos Mais Vendidos */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Produtos Mais Vendidos (Campeões de Giro)
              </h3>
            </div>
          </div>

          {topSellingProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Nenhuma venda registrada até o momento.
            </div>
          ) : (
            <div className="space-y-3">
              {topSellingProducts.map((item, idx) => {
                const maxQty = topSellingProducts[0]?.quantity || 1;
                const pct = (item.quantity / maxQty) * 100;

                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}º
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                          {item.quantity} un.
                        </span>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 ml-2 font-mono-numbers">
                          (+{formatCurrency(item.profit)})
                        </span>
                      </div>
                    </div>
                    {/* Barra de progresso */}
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bloco 2: Produtos Parados (Alerta de Estoque Encalhado) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Produtos Parados (Sem Giro Recente)
              </h3>
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              {stagnantProducts.length} itens
            </span>
          </div>

          {stagnantProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-600 dark:text-emerald-400">
              Excelente! Todos os produtos com estoque já tiveram pelo menos uma venda realizada.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {stagnantProducts.map((p) => {
                const capitalPreso = p.costPrice * p.quantity;
                return (
                  <div key={p.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-900 dark:text-white truncate block">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {p.quantity} un. em estoque • Categoria: {p.category}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-slate-400 text-[10px] block">Capital parado</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 font-mono-numbers">
                        {formatCurrency(capitalPreso)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Margem de Lucro por Produto */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-500" />
          Ranking de Margem de Lucro por Produto Cadastrado
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Produto</th>
                <th className="pb-3 font-semibold">Custo Compra</th>
                <th className="pb-3 font-semibold">Preço Anunciado</th>
                <th className="pb-3 font-semibold">Preço Mínimo</th>
                <th className="pb-3 font-semibold">Lucro Projetado</th>
                <th className="pb-3 font-semibold text-right">Margem %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {productsWithMargin.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 font-semibold text-slate-900 dark:text-white">
                    {p.name}
                  </td>
                  <td className="py-2.5 font-mono-numbers text-slate-500">
                    {formatCurrency(p.costPrice)}
                  </td>
                  <td className="py-2.5 font-mono-numbers text-slate-800 dark:text-slate-200 font-bold">
                    {formatCurrency(p.salePrice)}
                  </td>
                  <td className="py-2.5 font-mono-numbers text-amber-600">
                    {formatCurrency(p.minPrice)}
                  </td>
                  <td className="py-2.5 font-mono-numbers text-emerald-600 dark:text-emerald-400 font-bold">
                    +{formatCurrency(p.unitProfit)}
                  </td>
                  <td className="py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                    {formatPercent(p.marginPct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Desempenho por Canal de Venda */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-500" />
          Faturamento e Lucro por Canal de Venda
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(salesByChannel).map(([channel, data]) => (
            <div
              key={channel}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">
                  {getChannelLabel(channel as any)}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
                  {data.count} vendas
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 dark:text-slate-400">Total Faturado:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                  {formatCurrency(data.total)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Lucro Bruto:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                  +{formatCurrency(data.profit)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
