import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { X, AlertTriangle, HeartCrack, CheckCircle2 } from 'lucide-react';

interface BrokenLossModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const BrokenLossModal: React.FC<BrokenLossModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { recordBrokenLoss } = useStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('Avaria / Quebra no manuseio ou transporte');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  React.useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setReason('Avaria / Quebra no manuseio ou transporte');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const maxQuantity = product.quantity;
  const totalLoss = Number((product.costPrice * quantity).toFixed(2));

  const handleConfirmLoss = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (quantity <= 0 || quantity > maxQuantity) {
      setError(`Selecione uma quantidade válida entre 1 e ${maxQuantity}.`);
      return;
    }

    const res = recordBrokenLoss(product.id, quantity, reason);
    if (!res.success) {
      setError(res.error || 'Erro ao registrar prejuízo.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-red-500/5 dark:bg-red-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center">
              <HeartCrack className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Dar Baixa: Quebrou / Avaria</span>
              </h2>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                Registra perda e desconta como prejuízo real
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
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Prejuízo Registrado
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              O produto foi baixado do estoque e o prejuízo de{' '}
              <strong className="text-red-600 dark:text-red-400 font-mono-numbers">
                -{formatCurrency(totalLoss)}
              </strong>{' '}
              foi contabilizado no seu relatório financeiro.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmLoss} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Informações do Produto */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={product.photoUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover bg-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>
                    Custo unitário: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(product.costPrice)}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Estoque: <strong className="text-slate-700 dark:text-slate-300">{product.quantity} un.</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quantidade que Quebrou */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Quantidade Avariada / Quebrada
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
                  className="w-24 px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono-numbers focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  de {maxQuantity} unidades em estoque
                </span>
              </div>
            </div>

            {/* Motivo da Perda */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Motivo do Prejuízo
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="Quebrou no transporte / frete">Quebrou no transporte / frete</option>
                <option value="Quebrou no estoque / caiu no chão">Quebrou no estoque / caiu no chão</option>
                <option value="Defeito de fábrica sem garantia do fornecedor">Defeito de fábrica sem garantia do fornecedor</option>
                <option value="Extravio / Perda física">Extravio / Perda física</option>
                <option value="Outro motivo">Outro motivo</option>
              </select>
            </div>

            {/* Impacto Financeiro de Prejuízo */}
            <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Prejuízo Contabilizado:
                </span>
                <span className="text-base font-black text-red-600 dark:text-red-400 font-mono-numbers">
                  -{formatCurrency(totalLoss)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1 border-t border-red-500/15">
                ⚠️ Este valor <strong>não volta ao caixa</strong>. Ele será descontado diretamente do seu Lucro Líquido Acumulado como perda operacional.
              </p>
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
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md shadow-red-600/20 cursor-pointer"
              >
                <HeartCrack className="w-3.5 h-3.5" />
                <span>Confirmar Prejuízo</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
