import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  formatCurrency,
  formatPercent,
  formatDateTime,
  getChannelLabel,
  getPaymentMethodLabel,
} from '../../utils/formatters';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Receipt,
  RotateCcw,
  User,
  Share2,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Sale } from '../../types';

interface SalesViewProps {
  onOpenNewSale: () => void;
  onOpenReceipt: (sale: Sale) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ onOpenNewSale, onOpenReceipt }) => {
  const { sales, cancelSale, summary, receivePendingPayment } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');

  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.customerName && s.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesChannel =
      selectedChannel === 'todos' || s.channel === selectedChannel;

    const matchesStatus =
      selectedStatus === 'todos' || s.paymentStatus === selectedStatus;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  const handleCancelSale = (saleId: string, code: string) => {
    if (
      window.confirm(
        `Deseja realmente cancelar/estornar a venda #${code}? Isso devolverá as mercadorias ao estoque e debitará o valor do caixa.`
      )
    ) {
      cancelSale(saleId);
    }
  };

  const handleReceivePayment = (sale: Sale) => {
    const amountStr = window.prompt(
      `Quanto o cliente ${sale.customerName || ''} está pagando agora? (Falta pagar: ${formatCurrency(sale.amountPending)})`,
      sale.amountPending.toFixed(2)
    );
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Valor inválido!');
      return;
    }
    receivePendingPayment(sale.id, amount);
  };

  const ticketMedio =
    summary.totalVendasRealizadas > 0
      ? summary.totalFaturamento / summary.totalVendasRealizadas
      : 0;

  return (
    <div className="space-y-6">
      {/* Header com Botão e KPIs */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Histórico & Registro de Vendas
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {sales.length} vendas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cada venda calcula taxas do canal, lucro líquido no bolso e gera comprovantes para o cliente.
          </p>
        </div>

        <button
          onClick={onOpenNewSale}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Registrar Nova Venda</span>
        </button>
      </div>

      {/* 4 Cards de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px] uppercase font-bold">Faturamento Total</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono-numbers mt-1 block">
            {formatCurrency(summary.totalFaturamento)}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px] uppercase font-bold">Lucro Líquido Real</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers mt-1 block">
            {formatCurrency(summary.lucroLiquidoAcumulado)}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px] uppercase font-bold">Taxas Plataformas</span>
          <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono-numbers mt-1 block">
            - {formatCurrency(summary.totalTaxasPlataformas)}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px] uppercase font-bold">A Receber (Fiado)</span>
          <span className={`text-xl font-extrabold font-mono-numbers mt-1 block ${summary.totalContasAReceber > 0 ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
            {formatCurrency(summary.totalContasAReceber)}
          </span>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, produto ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">Todos os Canais</option>
            <option value="olx">OLX</option>
            <option value="instagram">Instagram</option>
            <option value="mercado_livre">Mercado Livre</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="balcao">Balcão / Presencial</option>
            <option value="loja_virtual">Loja Virtual</option>
            <option value="outro">Outro</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">Todos os Pagamentos</option>
            <option value="pago">Apenas Pagos</option>
            <option value="pendente">Apenas Pendentes (Fiado)</option>
            <option value="parcial">Parcial</option>
          </select>
        </div>
      </div>

      {/* Tabela de Vendas */}
      {filteredSales.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3">
          <ShoppingCart className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Nenhuma venda encontrada
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            {searchTerm || selectedChannel !== 'todos'
              ? 'Tente mudar o canal ou limpar o campo de busca.'
              : 'Registre sua primeira venda para ver os cálculos em ação!'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Código</th>
                  <th className="py-3 px-4 font-semibold">Produto</th>
                  <th className="py-3 px-4 font-semibold">Qtd</th>
                  <th className="py-3 px-4 font-semibold">Total / Taxa</th>
                  <th className="py-3 px-4 font-semibold">Líquido Caixa</th>
                  <th className="py-3 px-4 font-semibold">Lucro Real</th>
                  <th className="py-3 px-4 font-semibold">Situação</th>
                  <th className="py-3 px-4 font-semibold">Data</th>
                  <th className="py-3 px-4 font-semibold text-right">Comprovante & Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white font-mono-numbers">
                      #{sale.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                          {sale.productPhoto ? (
                            <img src={sale.productPhoto} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">📦</div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-[180px]">
                          <span className="font-semibold text-slate-900 dark:text-white truncate block">
                            {sale.productName}
                          </span>
                          {sale.customerName && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <User className="w-3 h-3" /> {sale.customerName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono-numbers font-bold text-slate-700 dark:text-slate-300">
                      {sale.quantity}x
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white font-mono-numbers block">
                        {formatCurrency(sale.totalReceived)}
                      </span>
                      {sale.feeAmount > 0 ? (
                        <span className="text-[10px] text-rose-500 font-mono-numbers block">
                          Taxa: -{formatCurrency(sale.feeAmount)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 block">Sem taxa</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-blue-600 dark:text-blue-400 font-mono-numbers">
                      {formatCurrency(sale.netReceived)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono-numbers block">
                        +{formatCurrency(sale.netProfit)}
                      </span>
                      <span className="text-[10px] text-emerald-600/80 font-medium">
                        Margem: {formatPercent(sale.profitMarginPct)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {sale.paymentStatus === 'pago' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          ✅ Pago
                        </span>
                      ) : sale.paymentStatus === 'parcial' ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            🟡 Falta: {formatCurrency(sale.amountPending)}
                          </span>
                          <button
                            onClick={() => handleReceivePayment(sale)}
                            className="text-[10px] font-bold text-emerald-600 hover:underline block"
                          >
                            + Receber agora
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            ⏳ Fiado ({formatCurrency(sale.amountPending)})
                          </span>
                          <button
                            onClick={() => handleReceivePayment(sale)}
                            className="text-[10px] font-bold text-emerald-600 hover:underline block"
                          >
                            + Quitar valor
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] font-mono-numbers whitespace-nowrap">
                      {formatDateTime(sale.soldAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Botão Recibo WhatsApp */}
                        <button
                          onClick={() => onOpenReceipt(sale)}
                          className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition cursor-pointer"
                          title="Gerar Comprovante / WhatsApp"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>

                        {/* Botão Estorno */}
                        <button
                          onClick={() => handleCancelSale(sale.id, sale.code)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="Cancelar venda e estornar estoque/caixa"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
