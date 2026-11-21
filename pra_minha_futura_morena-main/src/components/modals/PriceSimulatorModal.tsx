import React, { useState } from 'react';
import { Product } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { calculateChannelNetPayout } from '../../utils/channelFees';
import { X, Calculator, ArrowRight, ShieldAlert, CheckCircle, TrendingDown, Sparkles, Tag, DollarSign } from 'lucide-react';

interface PriceSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onApplyMinPrice?: (newMinPrice: number) => void;
}

export const PriceSimulatorModal: React.FC<PriceSimulatorModalProps> = ({
  isOpen,
  onClose,
  product,
  onApplyMinPrice,
}) => {
  if (!isOpen || !product) return null;

  const cost = product.costPrice;
  const currentSale = product.salePrice;
  const currentMin = product.minPrice;

  // Preço que o lojista está testando no simulador (inicia com o preço mínimo atual ou 20% acima do custo)
  const [offerPrice, setOfferPrice] = useState<number>(() => {
    return currentMin > 0 ? currentMin : Math.round(cost * 1.2);
  });
  const [selectedChannel, setSelectedChannel] = useState<'balcao' | 'pix' | 'olx' | 'mercado_livre' | 'cartao_credito'>('pix');

  // Cálculos de Cenários Predefinidos:
  // 1. Queima de Estoque / Giro Rápido (Recupera o Custo sem prejuízo: margem zero líquida)
  const breakEvenPix = Math.ceil(cost);
  const breakEvenOLX = Math.ceil(cost / (1 - 0.10)); // OLX Pay ~10%
  const breakEvenML = Math.ceil(cost / (1 - 0.13)); // ML ~13%

  // 2. Giro Rápido com Lucro Moderado (+30% sobre custo)
  const fastTurnaroundPrice = Math.round(cost * 1.35);

  // 3. Margem Padrão Saudável (+70% sobre custo)
  const standardPrice = Math.round(cost * 1.70);

  // 4. Margem Dobrada / Anúncio Cheio (+100% sobre custo)
  const highMarginPrice = Math.round(cost * 2.0);

  // Análise da oferta atual simulada
  let feeRate = 0;
  let channelName = 'Pix / À Vista (0% taxa)';
  if (selectedChannel === 'olx') {
    feeRate = 0.10;
    channelName = 'OLX Pay (10% taxa)';
  } else if (selectedChannel === 'mercado_livre') {
    feeRate = 0.13;
    channelName = 'Mercado Livre (13% taxa)';
  } else if (selectedChannel === 'cartao_credito') {
    feeRate = 0.045;
    channelName = 'Cartão de Crédito (~4.5% taxa)';
  }

  const feeAmount = Number((offerPrice * feeRate).toFixed(2));
  const netReceived = Number((offerPrice - feeAmount).toFixed(2));
  const netProfit = Number((netReceived - cost).toFixed(2));
  const netMarginPct = offerPrice > 0 ? (netProfit / offerPrice) * 100 : 0;

  // Classificação do preço simulado
  let statusBadge = {
    color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    title: '🟢 Preço Lucrativo e Seguro',
    desc: 'Ótima margem de lucro para a loja, cobrindo custos e gerando caixa saudável.',
  };

  if (netProfit < 0) {
    statusBadge = {
      color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      title: '🔴 Prejuízo Real! Não venda por este valor',
      desc: 'O valor líquido recebido após taxas fica abaixo do que você pagou no produto.',
    };
  } else if (netProfit === 0 || netMarginPct <= 5) {
    statusBadge = {
      color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      title: '🟡 Preço de Break-Even (Giro Máximo / Sem Lucro)',
      desc: 'Você recupera 100% do dinheiro investido para repor mercadoria, mas sem lucro financeiro.',
    };
  } else if (netMarginPct <= 20) {
    statusBadge = {
      color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      title: '🔵 Giro Rápido (Margem Enxuta)',
      desc: 'Excelente para queimar última unidade ou fechar na hora com cliente indeciso.',
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Simulador de Giro & Desconto</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Até quanto você pode descer sem tomar prejuízo
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
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Card Resumo do Produto */}
          <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <img
              src={product.photoUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover bg-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {product.name}
              </h4>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span>
                  Custo pago: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(cost)}</strong>
                </span>
                <span>•</span>
                <span>
                  Anunciado: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(currentSale)}</strong>
                </span>
                <span>•</span>
                <span>
                  Mínimo atual: <strong className="text-amber-600 dark:text-amber-400">{formatCurrency(currentMin)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Atalhos Rápidos de Cenários (Semáforo de Preço) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Sugestões Rápidas de Preço de Venda
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setOfferPrice(breakEvenPix)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  offerPrice === breakEvenPix
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
                  🔴 Break-even
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono-numbers block mt-0.5">
                  {formatCurrency(breakEvenPix)}
                </span>
                <span className="text-[10px] text-slate-400 block">Custo seco (R$ 0 lucro)</span>
              </button>

              <button
                type="button"
                onClick={() => setOfferPrice(fastTurnaroundPrice)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  offerPrice === fastTurnaroundPrice
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">
                  🟡 Giro Rápido
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono-numbers block mt-0.5">
                  {formatCurrency(fastTurnaroundPrice)}
                </span>
                <span className="text-[10px] text-slate-400 block">+35% margem</span>
              </button>

              <button
                type="button"
                onClick={() => setOfferPrice(standardPrice)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  offerPrice === standardPrice
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                  🟢 Saudável
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono-numbers block mt-0.5">
                  {formatCurrency(standardPrice)}
                </span>
                <span className="text-[10px] text-slate-400 block">+70% margem</span>
              </button>

              <button
                type="button"
                onClick={() => setOfferPrice(highMarginPrice)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  offerPrice === highMarginPrice
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 block">
                  👑 Dobrado (2x)
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono-numbers block mt-0.5">
                  {formatCurrency(highMarginPrice)}
                </span>
                <span className="text-[10px] text-slate-400 block">+100% markup</span>
              </button>
            </div>
          </div>

          {/* Testar Valor Manual / Proposta do Cliente */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-500" />
                Simular Proposta ou Preço de Balcão
              </label>

              {/* Canal de Venda */}
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value as any)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="pix">Pix / Dinheiro (0%)</option>
                <option value="olx">OLX Pay (~10%)</option>
                <option value="mercado_livre">Mercado Livre (~13%)</option>
                <option value="cartao_credito">Cartão de Crédito (~4.5%)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  R$
                </span>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono-numbers font-black text-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Slider de variação rápida */}
              <input
                type="range"
                min={Math.max(10, Math.floor(cost * 0.8))}
                max={Math.ceil(cost * 2.5)}
                value={offerPrice}
                onChange={(e) => setOfferPrice(parseFloat(e.target.value) || 0)}
                className="w-28 sm:w-36 accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Painel de Resultado do Teste */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">Taxa Canal</span>
                <span className="text-xs font-bold text-rose-500 font-mono-numbers">
                  -{formatCurrency(feeAmount)}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">Líquido na Mão</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono-numbers">
                  {formatCurrency(netReceived)}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">Lucro Limpo</span>
                <span
                  className={`text-xs font-black font-mono-numbers ${
                    netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {netProfit >= 0 ? `+${formatCurrency(netProfit)}` : formatCurrency(netProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Diagnóstico em Tempo Real */}
          <div className={`p-4 rounded-2xl border ${statusBadge.color} space-y-1`}>
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
              <span>{statusBadge.title}</span>
              <span className="text-xs opacity-80 font-mono-numbers font-medium">
                (Margem líquida: {formatPercent(netMarginPct)})
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              {statusBadge.desc}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Fechar
          </button>

          {onApplyMinPrice && (
            <button
              onClick={() => {
                onApplyMinPrice(offerPrice);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <span>Salvar {formatCurrency(offerPrice)} como Preço Mínimo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
