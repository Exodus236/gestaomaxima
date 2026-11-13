import React, { useState } from 'react';
import { Sale } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getChannelLabel,
  getPaymentMethodLabel,
} from '../../utils/formatters';
import {
  generateWhatsAppReceipt,
  generateWhatsAppLink,
} from '../../utils/receiptGenerator';
import {
  X,
  Printer,
  Copy,
  Check,
  Share2,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface SaleReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export const SaleReceiptModal: React.FC<SaleReceiptModalProps> = ({
  isOpen,
  onClose,
  sale,
}) => {
  const { pixKey } = useStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !sale) return null;

  const receiptText = generateWhatsAppReceipt(sale, 'RL Market', pixKey);
  const whatsAppLink = generateWhatsAppLink(sale.customerPhone, receiptText);

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Comprovante de Venda #{sale.code}
              </h3>
              <p className="text-[11px] text-slate-400">
                Pronto para envio no WhatsApp ou impressão
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cupom Imprimível */}
        <div className="p-6 overflow-y-auto space-y-4 print:p-0">
          <div
            id="printable-receipt"
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 font-mono text-xs space-y-3"
          >
            {/* Cabeçalho da Loja */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300 dark:border-slate-700">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
                RL MARKET
              </h2>
              <p className="text-[10px] text-slate-500 font-sans">
                Sistema de Gestão & Loja
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Data: {formatDateTime(sale.soldAt)}
              </p>
            </div>

            {/* Informações da Venda */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Pedido:</span>
                <span className="font-bold text-slate-900 dark:text-white">#{sale.code}</span>
              </div>
              {sale.customerName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Cliente:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{sale.customerName}</span>
                </div>
              )}
              {sale.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">WhatsApp:</span>
                  <span>{sale.customerPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Canal:</span>
                <span>{getChannelLabel(sale.channel)}</span>
              </div>
            </div>

            {/* Itens */}
            <div className="py-2 border-t border-b border-dashed border-slate-300 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white font-sans">
                {sale.productName}
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{sale.quantity}x {formatCurrency(sale.unitFinalPrice)}</span>
                <span className="font-bold font-mono-numbers">{formatCurrency(sale.totalReceived)}</span>
              </div>
            </div>

            {/* Totais e Pagamento */}
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white font-sans pt-1">
                <span>TOTAL:</span>
                <span className="font-mono-numbers">{formatCurrency(sale.totalReceived)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Forma:</span>
                <span>{getPaymentMethodLabel(sale.paymentMethod)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Situação:</span>
                <span className={`font-bold ${sale.paymentStatus === 'pago' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                  {sale.paymentStatus === 'pago' ? 'PAGO' : sale.paymentStatus === 'parcial' ? `PARCIAL (R$ ${sale.amountPaid.toFixed(2)})` : 'PENDENTE'}
                </span>
              </div>
              {sale.warrantyDays ? (
                <div className="flex justify-between text-[11px] text-blue-600 dark:text-blue-400 font-sans pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Garantia:
                  </span>
                  <span>{sale.warrantyDays} dias</span>
                </div>
              ) : null}
            </div>

            {/* Rodapé Agradecimento */}
            <div className="text-center pt-3 border-t border-dashed border-slate-300 dark:border-slate-700 text-[10px] text-slate-400 font-sans">
              Obrigado pela preferência e confiança!
            </div>
          </div>

          {/* Ações de Envio */}
          <div className="space-y-2.5 pt-2">
            {/* Botão Abrir WhatsApp */}
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Enviar pelo WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              {/* Botão Copiar Texto */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>

              {/* Botão Imprimir */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
