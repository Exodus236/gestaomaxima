import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { X, Target, Calendar, Check, TrendingUp } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose }) => {
  const { monthlyGoal, setMonthlyGoal, goalInfo } = useStore();
  const [targetValue, setTargetValue] = useState<string>(String(monthlyGoal || 1000));
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const presets = [500, 1000, 2000, 3000, 5000, 10000];
  const numValue = parseFloat(targetValue.replace(/[^0-9.]/g, '')) || 0;

  // Cálculo prévio do ritmo
  const remaining = Math.max(0, numValue - goalInfo.currentMonthRevenue);
  const dailyPace = goalInfo.daysRemainingInMonth > 0 ? remaining / goalInfo.daysRemainingInMonth : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numValue <= 0) return;
    setMonthlyGoal(numValue);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Definir Meta do Mês
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Acompanhe seu ritmo de vendas diário
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Campo de Valor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Valor da Meta Mensal (R$)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="50"
                min="100"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="1000"
                required
              />
            </div>
          </div>

          {/* Atalhos Rápidos */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Valores sugeridos:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setTargetValue(String(p))}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    numValue === p
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {formatCurrency(p)}
                </button>
              ))}
            </div>
          </div>

          {/* Previsão do Ritmo */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Ritmo Diário Necessário:</span>
              </span>
              <span className="font-extrabold text-sm">{formatCurrency(dailyPace)} / dia</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Faltam <strong>{goalInfo.daysRemainingInMonth} dias</strong> para encerrar o mês.
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Meta Salva!</span>
                </>
              ) : (
                <span>Salvar Meta</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
