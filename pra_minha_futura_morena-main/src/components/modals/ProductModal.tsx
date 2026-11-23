import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { CatalogItemKind, Product, ProductCategory, ProductStatus } from '../../types';
import { calculateIdealPrice } from '../../utils/channelFees';
import { X, Package, DollarSign, Image as ImageIcon, Sparkles, AlertCircle, Calculator } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const samplePhotos = [
  { label: 'Parafusadeira', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fone TWS', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80' },
  { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
  { label: 'Mochila', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
  { label: 'Luminária', url: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80' },
  { label: 'Acessório', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80' },
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, capital } = useStore();

  const [name, setName] = useState('');
  const [kind, setKind] = useState<CatalogItemKind>('produto');
  const [category, setCategory] = useState<ProductCategory>('Ferramentas');
  const [photoUrl, setPhotoUrl] = useState('');
  const [costPrice, setCostPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [status, setStatus] = useState<ProductStatus>('disponivel');
  const [warrantyDays, setWarrantyDays] = useState<number>(90);
  const [description, setDescription] = useState('');
  const [supplier, setSupplier] = useState('');
  const [debitFromCapital, setDebitFromCapital] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Simulador de canal
  const [showSimulator, setShowSimulator] = useState(false);

  const isEditing = Boolean(productToEdit);
  const isService = kind === 'servico';

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setShowSimulator(false);
      if (productToEdit) {
        setName(productToEdit.name);
        setKind(productToEdit.kind || 'produto');
        setCategory(productToEdit.category);
        setPhotoUrl(productToEdit.photoUrl || '');
        setCostPrice(productToEdit.costPrice);
        setSalePrice(productToEdit.salePrice);
        setMinPrice(productToEdit.minPrice);
        setQuantity(productToEdit.quantity);
        setStatus(productToEdit.status);
        setWarrantyDays(productToEdit.warrantyDays || 90);
        setDescription(productToEdit.description || '');
        setSupplier(productToEdit.supplier || '');
        setDebitFromCapital(false);
      } else {
        setName('');
        setKind('produto');
        setCategory('Ferramentas');
        setPhotoUrl(samplePhotos[0].url);
        setCostPrice(80);
        setSalePrice(160);
        setMinPrice(120);
        setQuantity(1);
        setStatus('disponivel');
        setWarrantyDays(90);
        setDescription('');
        setSupplier('');
        setDebitFromCapital(false);
      }
    }
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  const totalCost = costPrice * quantity;
  const potentialProfit = salePrice - costPrice;
  const marginPct = salePrice > 0 ? (potentialProfit / salePrice) * 100 : 0;

  // Cálculos do simulador de canais
  const desiredProfit = Math.max(0, potentialProfit);
  const priceML = calculateIdealPrice(costPrice, desiredProfit, 13); // ML ~13%
  const priceOLX = calculateIdealPrice(costPrice, desiredProfit, 10); // OLX Pay ~10%
  const priceCard = calculateIdealPrice(costPrice, desiredProfit, 3.5); // Maquininha ~3.5%

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage(isService ? 'O nome do serviço é obrigatório.' : 'O nome do produto é obrigatório.');
      return;
    }

    if (isService && salePrice <= 0) {
      setErrorMessage('O valor do serviço precisa ser maior que zero.');
      return;
    }

    if (costPrice < 0 || salePrice < 0 || minPrice < 0) {
      setErrorMessage('Os preços não podem ser negativos.');
      return;
    }

    if (!isEditing && debitFromCapital && totalCost > capital) {
      setErrorMessage(
        `Capital insuficiente no caixa! Custo total: ${formatCurrency(totalCost)}, disponível no caixa: ${formatCurrency(capital)}.`
      );
      return;
    }

    if (isEditing && productToEdit) {
      updateProduct(productToEdit.id, {
        name: name.trim(),
          kind,
        category,
        photoUrl: photoUrl.trim(),
        costPrice,
        salePrice,
        minPrice,
        quantity,
        status,
        warrantyDays,
        description: description.trim() || undefined,
        supplier: supplier.trim() || undefined,
      });
    } else {
      addProduct(
        {
          name: name.trim(),
          kind,
          category,
          photoUrl: photoUrl.trim(),
          costPrice,
          salePrice,
          minPrice,
          quantity,
          status,
          warrantyDays,
          description: description.trim() || undefined,
          supplier: supplier.trim() || undefined,
        },
        debitFromCapital
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? (isService ? 'Editar Serviço' : 'Editar Produto') : (isService ? 'Cadastrar Serviço' : 'Cadastrar Novo Produto')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isService ? 'Cadastre o serviço que você oferece e o valor cobrado.' : 'Preencha os detalhes para controlar estoque, custos e preços.'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMessage && (
            <div className="p-3 text-sm bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isEditing && (
            <div className="flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Tipo do item">
              <button
                type="button"
                onClick={() => {
                  setKind('produto');
                  setCategory('Ferramentas');
                  setPhotoUrl(samplePhotos[0].url);
                  setCostPrice(80);
                  setSalePrice(160);
                  setMinPrice(120);
                  setQuantity(1);
                  setWarrantyDays(90);
                  setDebitFromCapital(false);
                }}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${!isService ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Produto físico
              </button>
              <button
                type="button"
                onClick={() => {
                  setKind('servico');
                  setCategory('Outros');
                  setPhotoUrl('');
                  setCostPrice(0);
                  setSalePrice(0);
                  setMinPrice(0);
                  setQuantity(0);
                  setStatus('disponivel');
                  setWarrantyDays(0);
                  setDebitFromCapital(false);
                  setShowSimulator(false);
                }}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${isService ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Serviço
              </button>
            </div>
          )}

          {/* Nome e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {isService ? 'Nome do Serviço *' : 'Nome do Produto *'}
              </label>
              <input
                type="text"
                placeholder={isService ? 'Ex: Criação de site institucional' : 'Ex: Parafusadeira Furadeira Bateria 12V Bivolt'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ferramentas">Ferramentas</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Casa & Utilidades">Casa & Utilidades</option>
                <option value="Moda & Vestuário">Moda & Vestuário</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          {/* Foto */}
          {!isService && (
            <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              URL da Foto do Produto
            </label>
            <div className="flex gap-3 items-center">
              <div className="w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <input
                type="url"
                placeholder="https://exemplo.com/foto.jpg ou escolha abaixo"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 self-center mr-1">
                <Sparkles className="w-3 h-3" /> Exemplos rápidos:
              </span>
              {samplePhotos.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => setPhotoUrl(p.url)}
                  className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Preços e Simulador */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                {isService ? 'Preço do Serviço' : 'Estrutura de Preços & Margens'}
              </h3>
              {!isService && (
              <button
                type="button"
                onClick={() => setShowSimulator(!showSimulator)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{showSimulator ? 'Fechar Simulador' : 'Simulador de Canais'}</span>
              </button>
              )}
            </div>

            {/* Sugestões Rápidas de Marcação de Preço */}
            {!isService && costPrice > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Sugestões automáticas:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSalePrice(Math.round(costPrice * 1.35));
                    setMinPrice(Math.round(costPrice * 1.15));
                  }}
                  className="px-2 py-1 text-[11px] font-bold rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 hover:bg-blue-100 transition"
                  title="35% de margem no anúncio e 15% como mínimo de queima"
                >
                  ⚡ Giro Rápido (+35%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSalePrice(Math.round(costPrice * 1.70));
                    setMinPrice(Math.round(costPrice * 1.35));
                  }}
                  className="px-2 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-100 transition"
                  title="70% de margem no anúncio e 35% como mínimo"
                >
                  🟢 Margem Padrão (+70%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSalePrice(Math.round(costPrice * 2.0));
                    setMinPrice(Math.round(costPrice * 1.5));
                  }}
                  className="px-2 py-1 text-[11px] font-bold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-900/40 hover:bg-purple-100 transition"
                  title="Margem dobrada 100% markup (ex: comprou por 80, vende por 160)"
                >
                  👑 Dobrado (+100%)
                </button>
              </div>
            )}

            <div className={`grid grid-cols-1 ${isService ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-3`}>
              {!isService && <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Preço de Compra (Custo) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono-numbers"
                  required
                />
                </div>}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isService ? 'Valor cobrado pelo serviço *' : 'Preço Anunciado (Venda) *'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={salePrice}
                  onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono-numbers"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {isService ? 'Valor mínimo do serviço (opcional)' : 'Preço Mínimo de Venda *'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono-numbers"
                  required={!isService}
                />
              </div>
            </div>

            {/* Simulador de Preço por Canal */}
            {!isService && showSimulator && (
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2 text-xs">
                <span className="font-bold text-blue-950 dark:text-blue-300 block">
                  💡 Sugestão de Preço para sobrar {formatCurrency(desiredProfit)} líquido no bolso:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Mercado Livre (13%)</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono-numbers">{formatCurrency(priceML)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">OLX Pay (10%)</span>
                    <span className="font-extrabold text-orange-600 font-mono-numbers">{formatCurrency(priceOLX)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Maquininha (3.5%)</span>
                    <span className="font-extrabold text-emerald-600 font-mono-numbers">{formatCurrency(priceCard)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1 text-slate-500 dark:text-slate-400">
              <span>{isService ? 'Valor bruto por serviço:' : 'Lucro bruto unitário:'}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                {isService ? formatCurrency(salePrice) : `${formatCurrency(potentialProfit)} (${formatPercent(marginPct)})`}
              </span>
            </div>
            {isService && <p className="text-[11px] text-slate-500">Custos de execução, se houver, podem ser lançados depois em Financeiro &gt; Despesas. A venda entra no caixa da empresa.</p>}
          </div>

          {/* Estoque e Status */}
          {!isService ? <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Quantidade em Estoque *
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono-numbers"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                <option value="disponivel">Disponível</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
                <option value="esgotado">Esgotado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Garantia Oferecida (dias)
              </label>
              <input
                type="number"
                min="0"
                value={warrantyDays}
                onChange={(e) => setWarrantyDays(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono-numbers"
              />
            </div>
          </div> : <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">Serviços não controlam quantidade nem reduzem o estoque quando vendidos.</div>}

          {/* Opção de debitar do capital */}
          {!isEditing && !isService && (
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={debitFromCapital}
                  onChange={(e) => setDebitFromCapital(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-semibold text-blue-900 dark:text-blue-300 block">
                    Debitar custo total ({formatCurrency(totalCost)}) do Capital Disponível
                  </span>
                  <span className="text-blue-700/80 dark:text-blue-400/80">
                    Deduzirá {formatCurrency(totalCost)} do caixa da loja automaticamente.
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Fornecedor e Descrição */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {isService ? 'Responsável ou parceiro (opcional)' : 'Fornecedor (opcional)'}
              </label>
              <input
                type="text"
                placeholder={isService ? 'Ex: execução própria' : 'Ex: Distribuidora Brasil'}
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {isService ? 'Descrição do serviço' : 'Observações / Descrição para Anúncios'}
              </label>
              <input
                type="text"
                placeholder={isService ? 'Ex: Site institucional com até 5 páginas' : 'Ex: Acompanha maleta, 2 baterias e kit bits'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
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
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : (isService ? 'Cadastrar Serviço' : 'Cadastrar Produto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
