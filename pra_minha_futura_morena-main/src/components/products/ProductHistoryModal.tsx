import React from 'react';
import { X } from 'lucide-react';
import { Product, Sale, FinancialTransaction, StoreTask } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

interface ProductHistoryModalProps {
  product: Product | null;
  sales: Sale[];
  transactions: FinancialTransaction[];
  tasks: StoreTask[];
  onClose: () => void;
}

export const ProductHistoryModal: React.FC<ProductHistoryModalProps> = ({ product, sales, transactions, tasks, onClose }) => {
  if (!product) return null;

  const priceHistory = product.priceHistory?.length ? product.priceHistory : [{
    costPrice: product.costPrice,
    salePrice: product.salePrice,
    minPrice: product.minPrice,
    recordedAt: product.createdAt,
  }];
  const events = [
    {
      id: `created-${product.id}`,
      date: product.createdAt,
      title: 'Produto cadastrado',
      detail: `Estoque inicial: ${product.quantity} un. · Custo: ${formatCurrency(product.costPrice)}`,
      type: 'Cadastro',
    },
    ...priceHistory.map((snapshot, index) => ({
      id: `price-${product.id}-${index}`,
      date: snapshot.recordedAt,
      title: index === 0 ? 'Preço inicial' : 'Preço atualizado',
      detail: `Compra ${formatCurrency(snapshot.costPrice)} · Venda ${formatCurrency(snapshot.salePrice)} · Mínimo ${formatCurrency(snapshot.minPrice)} · Margem bruta ${snapshot.salePrice > 0 ? (((snapshot.salePrice - snapshot.costPrice) / snapshot.salePrice) * 100).toFixed(1) : '0.0'}%`,
      type: 'Preço',
    })),
    ...sales.filter((sale) => sale.productId === product.id).map((sale) => ({
      id: `sale-${sale.id}`,
      date: sale.soldAt,
      title: `Venda ${sale.code} · ${sale.quantity} un.`,
      detail: `${formatCurrency(sale.totalReceived)} recebido · lucro líquido ${formatCurrency(sale.netProfit)} · margem ${sale.profitMarginPct.toFixed(1)}%${sale.customerName ? ` · ${sale.customerName}` : ''}`,
      type: 'Venda',
    })),
    ...transactions.filter((transaction) => transaction.relatedProductId === product.id).map((transaction) => ({
      id: `transaction-${transaction.id}`,
      date: transaction.date,
      title: transaction.description,
      detail: `${transaction.type === 'compra_estoque' ? 'Compra registrada' : 'Movimentação'} · ${formatCurrency(Math.abs(transaction.amount))}`,
      type: transaction.type === 'compra_estoque' ? 'Compra' : 'Financeiro',
    })),
    ...tasks.filter((task) => task.relatedProductId === product.id).map((task) => ({
      id: `task-${task.id}`,
      date: task.completedAt || task.createdAt,
      title: task.title,
      detail: task.dismissed ? 'Dispensada' : task.completed ? 'Concluída' : 'Pendente',
      type: 'Tarefa',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="product-history-title" className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
          <div>
            <h2 id="product-history-title" className="text-lg font-extrabold text-slate-900 dark:text-white">Histórico do produto</h2>
            <p className="mt-1 text-xs text-slate-500">{product.name}</p>
          </div>
          <button onClick={onClose} aria-label="Fechar histórico" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
        </header>
        <div className="max-h-[calc(90vh-76px)] overflow-y-auto px-5 py-4">
          {events.length ? <ol className="relative ml-2 border-l border-slate-200 dark:border-slate-700">
            {events.map((event) => (
              <li key={event.id} className="relative pb-5 pl-5 last:pb-0">
                <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">{event.type}</span>
                  <time className="text-[10px] text-slate-400">{formatDateTime(event.date)}</time>
                </div>
                <h3 className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">{event.title}</h3>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{event.detail}</p>
              </li>
            ))}
          </ol> : <p className="py-8 text-center text-xs text-slate-500">Ainda não há eventos para este produto.</p>}
        </div>
      </section>
    </div>
  );
};