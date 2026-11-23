import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { PaymentMethod, SalesChannel, PaymentStatus } from '../../types';
import { getDefaultChannelFee } from '../../utils/channelFees';
import { X, ShoppingCart, AlertTriangle, CheckCircle, TrendingUp, Percent, Phone, ShieldCheck } from 'lucide-react';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProductId?: string;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({
  isOpen,
  onClose,
  preselectedProductId,
}) => {
  const { products, registerSale } = useStore();

  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitFinalPrice, setUnitFinalPrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [channel, setChannel] = useState<SalesChannel>('olx');
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [isManualFee, setIsManualFee] = useState<boolean>(false);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pago');
  const [amountPaid, setAmountPaid] = useState<number>(0);

  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [warrantyDays, setWarrantyDays] = useState<number>(90);
  const [notes, setNotes] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const availableProducts = products.filter((p) => p.kind === 'servico' || p.quantity > 0);
  const selectedProduct = products.find((p) => p.id === productId);
  const isService = selectedProduct?.kind === 'servico';

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      const initialId =
        preselectedProductId ||
        (availableProducts.length > 0 ? availableProducts[0].id : '');
      setProductId(initialId);
      const prod = products.find((p) => p.id === initialId);
      if (prod) {
        setUnitFinalPrice(prod.salePrice);
        setQuantity(1);
        setWarrantyDays(prod.kind === 'servico' ? 0 : prod.warrantyDays || 90);
        if (prod.kind === 'servico') setChannel('whatsapp');
      }
      setIsManualFee(false);
    }
  }, [isOpen, preselectedProductId, products]);

  // Recalcular taxa sugerida se o usuário não tiver customizado manualmente
  useEffect(() => {
    if (!isManualFee && selectedProduct) {
      const total = unitFinalPrice * quantity;
      const { feePct } = getDefaultChannelFee(channel, paymentMethod);
      const calcFee = (total * feePct) / 100;
      setFeeAmount(parseFloat(calcFee.toFixed(2)));
    }
  }, [channel, paymentMethod, unitFinalPrice, quantity, isManualFee, selectedProduct]);

  // Manter amountPaid atualizado com total se o status for 'pago'
  const saleQuantity = isService ? 1 : quantity;
  const totalReceived = unitFinalPrice * saleQuantity;
  useEffect(() => {
    if (paymentStatus === 'pago') {
      setAmountPaid(totalReceived);
    } else if (paymentStatus === 'pendente') {
      setAmountPaid(0);
    }
  }, [paymentStatus, totalReceived]);

  const handleProductChange = (newId: string) => {
    setProductId(newId);
    const prod = products.find((p) => p.id === newId);
    if (prod) {
      setUnitFinalPrice(prod.salePrice);
      setQuantity(1);
      setWarrantyDays(prod.kind === 'servico' ? 0 : prod.warrantyDays || 90);
      if (prod.kind === 'servico') setChannel('whatsapp');
    }
  };

  if (!isOpen) return null;

  const totalCost = selectedProduct && !isService ? selectedProduct.costPrice * saleQuantity : 0;
  const netReceived = Math.max(0, totalReceived - feeAmount);
  const netProfit = netReceived - totalCost;
  const profitMargin = totalReceived > 0 ? (netProfit / totalReceived) * 100 : 0;

  const isBelowMinPrice = selectedProduct && unitFinalPrice < selectedProduct.minPrice;
  const isBelowCost = selectedProduct && unitFinalPrice < selectedProduct.costPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedProduct) {
      setErrorMessage('Selecione um produto.');
      return;
    }

    if (!isService && quantity <= 0) {
      setErrorMessage('A quantidade deve ser de pelo menos 1 item.');
      return;
    }

    if (!isService && quantity > selectedProduct.quantity) {
      setErrorMessage(
        `Estoque insuficiente. Há apenas ${selectedProduct.quantity} unidades deste produto.`
      );
      return;
    }

    if (unitFinalPrice <= 0) {
      setErrorMessage('O valor unitário de venda deve ser maior que zero.');
      return;
    }

    const result = registerSale({
      productId: selectedProduct.id,
      quantity: saleQuantity,
      unitFinalPrice,
      feeAmount,
      paymentMethod,
      channel,
      paymentStatus,
      amountPaid: paymentStatus === 'pago' ? totalReceived : amountPaid,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      warrantyDays,
      notes: notes.trim() || undefined,
    });

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Erro ao registrar venda.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Registrar Nova Venda
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vendas entram no caixa; produtos físicos também atualizam o estoque.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMessage && (
            <div className="p-3 text-sm bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Seleção do Produto */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Produto ou Serviço *
            </label>
            {availableProducts.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
                Nenhum produto com estoque ou serviço cadastrado no momento.
              </div>
            ) : (
              <select
                value={productId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                {availableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.kind === 'servico' ? `Serviço: ${p.name}` : `${p.name} — Estoque: ${p.quantity} un.`} | Sugerido: {formatCurrency(p.salePrice)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Quantidade e Preço Final */}
          <div className={`grid grid-cols-1 ${isService ? '' : 'sm:grid-cols-2'} gap-4`}>
            {!isService && <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Quantidade *
              </label>
              <input
                type="number"
                min="1"
                max={selectedProduct ? selectedProduct.quantity : 999}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono-numbers"
                required
              />
            </div>}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {isService ? 'Valor cobrado (R$) *' : 'Preço Unitário Negociado (R$) *'}
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={unitFinalPrice}
                onChange={(e) => setUnitFinalPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono-numbers"
                required
              />
            </div>
          </div>

          {/* Canal de Venda e Forma de Pagamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Canal de Venda *
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as SalesChannel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="olx">OLX</option>
                <option value="instagram">Instagram Direct</option>
                <option value="mercado_livre">Mercado Livre (~13% taxa)</option>
                <option value="whatsapp">WhatsApp (Direto)</option>
                <option value="balcao">Balcão / Pessoalmente</option>
                <option value="loja_virtual">Loja Virtual</option>
                <option value="outro">Outro Canal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Forma de Pagamento *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="pix">Pix (0% taxa)</option>
                <option value="dinheiro">Dinheiro (0% taxa)</option>
                <option value="cartao_debito">Cartão Débito (~1.5%)</option>
                <option value="cartao_credito">Cartão Crédito (~3.5%)</option>
                <option value="transferencia">Transferência Bancária</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          {/* Taxa da Plataforma / Canal (Calculada ou Manual) */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-blue-500" />
                Taxa do Canal / Maquininha (R$)
              </span>
              <p className="text-[11px] text-slate-400">
                Calculada automaticamente para {channel} + {paymentMethod}. Você pode editar livremente.
              </p>
            </div>
            <div className="w-32">
              <input
                type="number"
                step="0.01"
                min="0"
                value={feeAmount}
                onChange={(e) => {
                  setIsManualFee(true);
                  setFeeAmount(parseFloat(e.target.value) || 0);
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono-numbers text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Resumo da Venda com Lucro Líquido Real */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-900 dark:text-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Total Bruto Anunciado:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                {formatCurrency(totalReceived)}
              </span>
            </div>
            {feeAmount > 0 && (
              <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400">
                <span>(-) Taxa da Plataforma / Maquininha:</span>
                <span className="font-mono-numbers">- {formatCurrency(feeAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">(=) Líquido que entra no Caixa:</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono-numbers">
                {formatCurrency(netReceived)}
              </span>
            </div>
            {!isService && <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">(-) Custo da Mercadoria (CMV):</span>
              <span className="text-slate-600 dark:text-slate-300 font-mono-numbers">
                - {formatCurrency(totalCost)}
              </span>
            </div>}
            {isService && <p className="text-[11px] text-slate-500">Custos de execução são lançados separadamente em Financeiro &gt; Despesas.</p>}
            <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>{isService ? 'Líquido da venda após taxas:' : 'Lucro Líquido Real no Bolso:'}</span>
              </div>
              <div className="text-right">
                <span className={`font-mono-numbers text-base ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                  {formatCurrency(netProfit)}
                </span>
                <span className="text-[11px] block text-emerald-600/80 font-normal">
                  Margem Líquida: {formatPercent(profitMargin)}
                </span>
              </div>
            </div>
          </div>

          {/* Status de Pagamento (Controle de Fiado / Parcelas) */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Status do Pagamento
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentStatus('pago')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                  paymentStatus === 'pago'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                ✅ Pago Integral
              </button>
              <button
                type="button"
                onClick={() => setPaymentStatus('parcial')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                  paymentStatus === 'parcial'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                🟡 Entrada + Parcela
              </button>
              <button
                type="button"
                onClick={() => setPaymentStatus('pendente')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                  paymentStatus === 'pendente'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                ⏳ Fiado (A Receber)
              </button>
            </div>

            {paymentStatus === 'parcial' && (
              <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">Valor pago agora como entrada:</span>
                <input
                  type="number"
                  step="0.01"
                  max={totalReceived}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  className="w-28 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 font-mono-numbers text-right"
                />
              </div>
            )}
          </div>

          {/* Dados do Cliente & Garantia */}
          <div className={`grid grid-cols-1 ${isService ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-3`}>
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Nome do Cliente
              </label>
              <input
                type="text"
                placeholder="Ex: Carlos Eduardo"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                WhatsApp (com DDD)
              </label>
              <input
                type="text"
                placeholder="Ex: 11999998888"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {!isService && <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Garantia (dias)
              </label>
              <input
                type="number"
                min="0"
                value={warrantyDays}
                onChange={(e) => setWarrantyDays(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>}
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
              disabled={!selectedProduct || availableProducts.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isService ? 'Registrar Venda do Serviço' : 'Concluir Venda'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
