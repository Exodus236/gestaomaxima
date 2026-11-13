import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDateTime, getTransactionTypeLabel } from '../../utils/formatters';
import {
  Wallet,
  Layers,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  DollarSign,
  Receipt,
  FileText,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface FinanceViewProps {
  onOpenTransaction: (defaultType?: 'aporte' | 'despesa' | 'retirada') => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ onOpenTransaction }) => {
  const { summary, transactions, sales, receivePendingPayment } = useStore();
  const [filterType, setFilterType] = useState<string>('todos');

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'todos') return true;
    return t.type === filterType;
  });

  const pendingSales = sales.filter((s) => s.amountPending > 0);

  const handleReceive = (saleId: string, customerName: string | undefined, pendingAmount: number) => {
    const valStr = window.prompt(`Receber quanto de ${customerName || 'Cliente'}? (Pendente: ${formatCurrency(pendingAmount)})`, pendingAmount.toFixed(2));
    if (!valStr) return;
    const val = parseFloat(valStr);
    if (isNaN(val) || val <= 0) return;
    receivePendingPayment(saleId, val);
  };

  return (
    <div className="space-y-6">
      {/* Header com os 3 Pilares Separados com Clareza */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Gestão Financeira da Loja
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Separação estratégica entre <strong>Capital de Giro</strong>, <strong>Estoque Ativo</strong> e <strong>Lucro Real</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenTransaction('aporte')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Aporte de Capital</span>
            </button>
            <button
              onClick={() => onOpenTransaction('despesa')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/50 transition cursor-pointer"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Nova Despesa</span>
            </button>
          </div>
        </div>

        {/* Os 3 Pilares Fundamentais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pilar 1: Capital */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 text-slate-900 dark:text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" /> 1. Capital (Caixa Real)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                  Livre
                </span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers my-1">
                {formatCurrency(summary.capitalDisponivel)}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Dinheiro líquido imediato para comprar novas mercadorias ou reinvestir.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">A receber (Fiado):</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 font-mono-numbers">
                {formatCurrency(summary.totalContasAReceber)}
              </span>
            </div>
          </div>

          {/* Pilar 2: Estoque */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/30 text-slate-900 dark:text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> 2. Estoque (Investido)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold">
                  {summary.totalItensEmEstoque} peças
                </span>
              </div>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono-numbers my-1">
                {formatCurrency(summary.totalInvestidoEstoque)}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Dinheiro investido em produtos já adquiridos e estocados.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-blue-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Valor potencial de venda:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                {formatCurrency(summary.valorPotencialEstoque)}
              </span>
            </div>
          </div>

          {/* Pilar 3: Lucro */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/30 text-slate-900 dark:text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> 3. Lucro Líquido Real
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold">
                  Acumulado
                </span>
              </div>
              <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono-numbers my-1">
                {formatCurrency(summary.lucroLiquidoAcumulado)}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Resultado real após descontar o custo das mercadorias, taxas de plataformas e despesas operacionais.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-purple-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Taxas de Canais:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono-numbers">
                - {formatCurrency(summary.totalTaxasPlataformas)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contas a Receber (Vendas a Prazo / Fiado) */}
      {pendingSales.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Contas a Receber de Clientes ({formatCurrency(summary.totalContasAReceber)} pendente)
              </h3>
            </div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              {pendingSales.length} cliente(s)
            </span>
          </div>

          <div className="divide-y divide-amber-200/60 dark:divide-amber-800/40">
            {pendingSales.map((sale) => (
              <div key={sale.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {sale.customerName || 'Cliente sem nome'} (Pedido #{sale.code})
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Produto: {sale.productName} • WhatsApp: {sale.customerPhone || 'Não informado'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Falta pagar</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono-numbers">
                      {formatCurrency(sale.amountPending)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleReceive(sale.id, sale.customerName, sale.amountPending)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Receber
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demonstrativo Resumido de Resultado */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-emerald-500" />
          Demonstrativo de Resultado Líquido Real (DRE)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Faturamento Bruto</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono-numbers">
              {formatCurrency(summary.totalFaturamento)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">(-) CMV (Custo Produtos)</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono-numbers">
              - {formatCurrency(summary.totalFaturamento - summary.lucroBrutoAcumulado)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">(-) Taxas Canais & Cartão</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono-numbers">
              - {formatCurrency(summary.totalTaxasPlataformas)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">(-) Despesas Operacionais</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono-numbers">
              - {formatCurrency(summary.totalDespesasOperacionais)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-emerald-700 dark:text-emerald-300 block text-[11px] font-bold">(=) Lucro no Bolso</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
              {formatCurrency(summary.lucroLiquidoAcumulado)}
            </span>
          </div>
        </div>
      </div>

      {/* Extrato / Livro de Movimentações Financeiras */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Livro Caixa & Movimentações Financeiras
            </h3>
            <span className="text-xs text-slate-400">({filteredTransactions.length} registros)</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
            >
              <option value="todos">Todas as movimentações</option>
              <option value="venda">Vendas (+)</option>
              <option value="recebimento_fiado">Recebimento Fiado (+)</option>
              <option value="aporte_capital">Aportes de Capital (+)</option>
              <option value="compra_estoque">Compras de Estoque (-)</option>
              <option value="despesa_operacional">Despesas Operacionais (-)</option>
              <option value="retirada">Retiradas / Pró-labore (-)</option>
            </select>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Nenhuma movimentação registrada com este filtro.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Data & Hora</th>
                  <th className="pb-3 font-semibold">Tipo</th>
                  <th className="pb-3 font-semibold">Descrição</th>
                  <th className="pb-3 font-semibold text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((tx) => {
                  const info = getTransactionTypeLabel(tx.type);
                  const isPositive = tx.amount > 0;

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 text-slate-500 dark:text-slate-400 font-mono-numbers">
                        {formatDateTime(tx.date)}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 font-semibold ${info.color}`}>
                          {isPositive ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                          )}
                          {info.label}
                        </span>
                      </td>
                      <td className="py-3 text-slate-800 dark:text-slate-200 font-medium">
                        {tx.description}
                        {tx.category && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {tx.category}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right font-bold font-mono-numbers">
                        <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {isPositive ? '+' : ''}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
