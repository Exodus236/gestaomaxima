import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { X, RotateCcw, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface RefundProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const RefundProductModal: React.FC<RefundProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { refundProduct, capital } = useStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('Devolução ao fornecedor');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Reinicia estado ao abrir
  React.useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setReason('Devolução ao fornecedor');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const maxQuantity = product.quantity;
  const refundAmount = Number((product.costPrice * quantity).toFixed(2));
  const newCapitalProjected = Number((capital + refundAmount).toFixed(2));

  const handleConfirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (quantity <= 0 || quantity > maxQuantity) {
      setError(`Selecione uma quantidade válida entre 1 e ${maxQuantity}.`);
      return;
    }

    const res = refundProduct(product.id, quantity, reason);
    if (!res.success) {
      setError(res.error || 'Erro ao processar reembolso.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Reembolso de Compra
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estornar custo do produto direto para o caixa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reembolso Concluído!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                +{formatCurrency(refundAmount)}
              </strong>{' '}
              foram devolvidos ao seu Capital Disponível.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmRefund} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Informações do Produto */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <img
                src={product.photoUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>
                    Preço de compra: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(product.costPrice)}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Estoque: <strong className="text-slate-700 dark:text-slate-300">{product.quantity} un.</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quantidade a reembolsar */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Quantidade para Devolver / Reembolsar
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setQuantity(Math.min(maxQuantity, Math.max(1, val)));
                  }}
                  className="w-24 px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono-numbers focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  de {maxQuantity} unidades disponíveis em estoque
                </span>
              </div>
            </div>

            {/* Motivo do Reembolso */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Motivo / Justificativa
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Devolução ao fornecedor">Devolução ao fornecedor</option>
                <option value="Defeito de fábrica com ressarcimento">Defeito de fábrica com ressarcimento</option>
                <option value="Cancelamento de pedido do fornecedor">Cancelamento de pedido do fornecedor</option>
                <option value="Ajuste de compra duplicada">Ajuste de compra duplicada</option>
                <option value="Outro motivo">Outro motivo</option>
              </select>
            </div>

            {/* Quadro de Impacto no Caixa */}
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Valor devolvido ao Caixa:
                </span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                  +{formatCurrency(refundAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-emerald-500/20 text-slate-500 dark:text-slate-400">
                <span>Capital Disponível atual:</span>
                <span className="font-mono-numbers">{formatCurrency(capital)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                <span>Novo Capital Disponível:</span>
                <span className="font-mono-numbers">{formatCurrency(newCapitalProjected)}</span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={product.quantity <= 0}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md shadow-amber-600/20 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirmar Reembolso</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
