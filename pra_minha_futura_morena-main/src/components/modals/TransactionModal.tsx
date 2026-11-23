import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, DollarSign, ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'aporte' | 'despesa' | 'retirada';
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'aporte',
}) => {
  const { addCapitalEntry, addExpense, addWithdrawal } = useStore();

  const [type, setType] = useState<'aporte' | 'despesa' | 'retirada'>(defaultType);
  const [amount, setAmount] = useState<number>(100);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Embalagem');
  const [withdrawalCategory, setWithdrawalCategory] = useState('Pessoal / Pró-labore');

  useEffect(() => {
    if (!isOpen) return;
    setType(defaultType);
    setAmount(100);
    setDescription('');
    setCategory('Embalagem');
    setWithdrawalCategory('Pessoal / Pró-labore');
  }, [isOpen, defaultType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    if (type === 'aporte') {
      addCapitalEntry(amount, description || 'Aporte de Capital');
    } else if (type === 'despesa') {
      addExpense(amount, description || 'Despesa Operacional', category);
    } else {
      addWithdrawal(amount, description || 'Retirada / Pró-labore', withdrawalCategory);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              type === 'aporte'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}>
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Movimentação de Caixa
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aporte, despesa operacional ou retirada
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo de Movimentação */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setType('aporte')}
              className={`p-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                type === 'aporte'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span>Aporte (+)</span>
            </button>
            <button
              type="button"
              onClick={() => setType('despesa')}
              className={`p-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                type === 'despesa'
                  ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-rose-500" />
              <span>Despesa (-)</span>
            </button>
            <button
              type="button"
              onClick={() => setType('retirada')}
              className={`p-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                type === 'retirada'
                  ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4 text-purple-500" />
              <span>Retirada (-)</span>
            </button>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Valor (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono-numbers"
              required
            />
          </div>

          {/* Categoria para despesas */}
          {type === 'despesa' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Categoria da Despesa
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Embalagem">Embalagens & Caixas</option>
                <option value="Frete / Envio">Frete e Envio</option>
                <option value="Anúncios / Tráfego">Anúncios & Tráfego Pago</option>
                <option value="Taxas de Plataforma">Taxas de Plataforma / Tarifas</option>
                <option value="Material de Escritório">Material de Escritório</option>
                <option value="Alimentação / Transporte">Alimentação / Transporte</option>
                <option value="Outros">Outras Despesas</option>
              </select>
            </div>
          )}

          {type === 'retirada' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Tipo de retirada
              </label>
              <select
                value={withdrawalCategory}
                onChange={(e) => setWithdrawalCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Pessoal / Pró-labore">Pessoal / Pró-labore</option>
                <option value="Urgente / A repor">Urgente (vou repor depois)</option>
              </select>
            </div>
          )}

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Descrição / Motivo
            </label>
            <input
              type="text"
              placeholder={
                type === 'aporte'
                  ? 'Ex: Entrada de dinheiro para investimento'
                  : type === 'despesa'
                  ? 'Ex: Compra de fitas adesivas e caixas correios'
                  : withdrawalCategory === 'Urgente / A repor'
                  ? 'Ex: Retirada urgente para gasto pessoal, vou repor depois'
                  : 'Ex: Saque pessoal / pró-labore'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition cursor-pointer ${
                type === 'aporte'
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
              }`}
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
