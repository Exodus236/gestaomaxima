import React, { useState } from 'react';
import { Product } from '../../types';
import { generateAdCopy } from '../../utils/receiptGenerator';
import { X, Sparkles, Copy, Check, Megaphone, Instagram } from 'lucide-react';

interface AdCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const AdCopyModal: React.FC<AdCopyModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [platform, setPlatform] = useState<'olx' | 'instagram'>('olx');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const copies = generateAdCopy(product, 'RL Market');
  const activeCopy = platform === 'olx' ? copies.olx : copies.instagram;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Gerador de Anúncios & Copywriting
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-xs">
                {product.name}
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Seletor de Plataforma */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlatform('olx')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                platform === 'olx'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Anúncio OLX / Mercado Livre</span>
            </button>
            <button
              onClick={() => setPlatform('instagram')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                platform === 'instagram'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Instagram className="w-4 h-4" />
              <span>Legenda Instagram</span>
            </button>
          </div>

          {/* Área de Texto Formatada */}
          <div className="relative">
            <textarea
              readOnly
              rows={12}
              value={activeCopy}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs font-sans leading-relaxed resize-none focus:outline-none"
            />
          </div>

          {/* Botão Copiar */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Anúncio Copiado com Sucesso!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Anúncio para Colar na Plataforma</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
