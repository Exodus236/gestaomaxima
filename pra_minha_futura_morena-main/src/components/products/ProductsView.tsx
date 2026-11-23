import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatPercent, getStatusBadge } from '../../utils/formatters';
import { Product } from '../../types';
import {
  Package,
  Plus,
  Search,
  ShoppingCart,
  Edit,
  Trash2,
  TrendingUp,
  Sparkles,
  Megaphone,
  RotateCcw,
  Calculator,
  HeartCrack,
  History,
  Briefcase,
} from 'lucide-react';
import { RefundProductModal } from '../modals/RefundProductModal';
import { PriceSimulatorModal } from '../modals/PriceSimulatorModal';
import { BrokenLossModal } from '../modals/BrokenLossModal';
import { ProductHistoryModal } from './ProductHistoryModal';

interface ProductsViewProps {
  onOpenNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onQuickSale: (productId: string) => void;
  onGenerateAd: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  onOpenNewProduct,
  onEditProduct,
  onQuickSale,
  onGenerateAd,
}) => {
  const { products, sales, transactions, tasks, deleteProduct, adjustStock, updateProduct, summary } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedKind, setSelectedKind] = useState<'todos' | 'produto' | 'servico'>('todos');
  const [refundTargetProduct, setRefundTargetProduct] = useState<Product | null>(null);
  const [simulatorTargetProduct, setSimulatorTargetProduct] = useState<Product | null>(null);
  const [brokenLossTargetProduct, setBrokenLossTargetProduct] = useState<Product | null>(null);
  const [historyTargetProduct, setHistoryTargetProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesKind = selectedKind === 'todos' || (p.kind || 'produto') === selectedKind;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.supplier && p.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'todas' || p.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'todos' || (p.kind === 'servico' ? false :
      (selectedStatus === 'esgotado'
        ? p.quantity === 0 || p.status === 'esgotado'
        : p.status === selectedStatus));

    return matchesSearch && matchesKind && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner com Indicadores do Estoque */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Produtos & Serviços
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {products.length} itens no catálogo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gerencie mercadorias em estoque e serviços vendidos diretamente pela empresa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Investido em Estoque</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono-numbers text-sm">
              {formatCurrency(summary.totalInvestidoEstoque)}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Previsão de Venda</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers text-sm">
              {formatCurrency(summary.valorPotencialEstoque)}
            </span>
          </div>
          <button
            onClick={onOpenNewProduct}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition cursor-pointer text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Item</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, categoria ou fornecedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <select
            value={selectedKind}
            onChange={(e) => setSelectedKind(e.target.value as 'todos' | 'produto' | 'servico')}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Produtos e serviços</option>
            <option value="produto">Produtos físicos</option>
            <option value="servico">Serviços</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas as Categorias</option>
            <option value="Ferramentas">Ferramentas</option>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Acessórios">Acessórios</option>
            <option value="Casa & Utilidades">Casa & Utilidades</option>
            <option value="Moda & Vestuário">Moda & Vestuário</option>
            <option value="Outros">Outros</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos os Status</option>
            <option value="disponivel">Apenas Disponíveis</option>
            <option value="reservado">Reservados</option>
            <option value="esgotado">Esgotados (Zero)</option>
          </select>
        </div>
      </div>

      {/* Grid de Produtos */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3">
          <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Nenhum produto encontrado
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'todas' || selectedStatus !== 'todos'
              ? 'Tente ajustar os filtros de busca para encontrar o que procura.'
              : 'Você ainda não cadastrou produtos ou serviços. Comece adicionando o primeiro item ao catálogo!'}
          </p>
          <button
            onClick={onOpenNewProduct}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Item Agora</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const statusInfo = getStatusBadge(product.status);
            const unitProfit = product.salePrice - product.costPrice;
            const marginPct = product.salePrice > 0 ? (unitProfit / product.salePrice) * 100 : 0;
            const totalCost = product.costPrice * product.quantity;
            const isService = product.kind === 'servico';
            const isOutOfStock = !isService && product.quantity === 0;

            return (
              <div
                key={product.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Imagem do Produto */}
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {product.photoUrl ? (
                      <img
                        src={product.photoUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                        {isService ? <Briefcase className="w-8 h-8 opacity-40" /> : <Package className="w-8 h-8 opacity-40" />}
                        <span className="text-[11px]">{isService ? 'Serviço' : 'Sem foto'}</span>
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 backdrop-blur-xs shadow-xs">
                        {product.category}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-xs ${statusInfo.bg}`}
                      >
                        {isService ? 'Serviço' : isOutOfStock ? 'Esgotado' : statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Detalhes do Produto */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      {product.supplier && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isService ? 'Responsável:' : 'Fornecedor:'} {product.supplier}
                        </p>
                      )}
                    </div>

                    {/* Preços e Margem */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                      {!isService && <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">Preço de Compra:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono-numbers">
                          {formatCurrency(product.costPrice)}
                        </span>
                      </div>}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">{isService ? 'Valor do Serviço:' : 'Preço Anunciado:'}</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                          {formatCurrency(product.salePrice)}
                        </span>
                      </div>
                      {!isService && product.minPrice > 0 && <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">Preço Mínimo:</span>
                        <span className="font-medium text-amber-600 dark:text-amber-400 font-mono-numbers">
                          {formatCurrency(product.minPrice)}
                        </span>
                      </div>}

                      {!isService && <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Margem:
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                          +{formatCurrency(unitProfit)} ({formatPercent(marginPct)})
                        </span>
                      </div>}
                    </div>

                    {/* Estoque e Valores Totais */}
                    {!isService ? <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          Estoque Atual
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-base font-extrabold font-mono-numbers ${
                              isOutOfStock
                                ? 'text-rose-600 dark:text-rose-400'
                                : product.quantity <= 2
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {product.quantity} un.
                          </span>

                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => adjustStock(product.id, -1)}
                              disabled={product.quantity <= 0}
                              className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold disabled:opacity-30 hover:bg-slate-300 cursor-pointer"
                              title="Reduzir 1 unidade"
                            >
                              -
                            </button>
                            <button
                              onClick={() => adjustStock(product.id, 1)}
                              className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 cursor-pointer"
                              title="Adicionar 1 unidade"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          Total em Estoque
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono-numbers">
                          {formatCurrency(totalCost)}
                        </span>
                      </div>
                    </div> : <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">Venda de serviço · sem baixa de estoque</div>}
                  </div>
                </div>

                {/* Ações do Card */}
                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5 mt-2">
                  <button
                    onClick={() => onQuickSale(product.id)}
                    disabled={isOutOfStock}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{isService ? 'Vender serviço' : 'Vender'}</span>
                  </button>

                  {!isService && <>
                  {/* Botão Gerar Anúncio */}
                  <button
                    onClick={() => onGenerateAd(product)}
                    className="p-2 rounded-xl text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 transition cursor-pointer"
                    title="Gerar Anúncio para OLX / Instagram"
                  >
                    <Megaphone className="w-4 h-4" />
                  </button>

                  {/* Botão Simulador de Preço e Desconto */}
                  <button
                    onClick={() => setSimulatorTargetProduct(product)}
                    className="p-2 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition cursor-pointer"
                    title="Simulador de Giro: até quanto posso descer sem prejuízo"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setHistoryTargetProduct(product)}
                    className="p-2 rounded-xl text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 transition cursor-pointer"
                    title="Ver histórico do produto"
                  >
                    <History className="w-4 h-4" />
                  </button>

                  {/* Botão Reembolso de Compra */}
                  <button
                    onClick={() => setRefundTargetProduct(product)}
                    disabled={isOutOfStock}
                    className="p-2 rounded-xl text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Reembolso de Compra (devolve custo ao caixa)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Botão Registrar Quebra / Prejuízo */}
                  <button
                    onClick={() => setBrokenLossTargetProduct(product)}
                    disabled={isOutOfStock}
                    className="p-2 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Dar baixa por Quebra / Defeito (Prejuízo real)"
                  >
                    <HeartCrack className="w-4 h-4" />
                  </button>
                  </>}

                  <button
                    onClick={() => onEditProduct(product)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition cursor-pointer"
                    title={isService ? 'Editar Serviço' : 'Editar Produto'}
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition cursor-pointer"
                    title="Excluir Produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Reembolso de Produto */}
      <RefundProductModal
        isOpen={!!refundTargetProduct}
        onClose={() => setRefundTargetProduct(null)}
        product={refundTargetProduct}
      />

      {/* Modal de Simulador de Preço de Giro */}
      <PriceSimulatorModal
        isOpen={!!simulatorTargetProduct}
        onClose={() => setSimulatorTargetProduct(null)}
        product={simulatorTargetProduct}
        onApplyMinPrice={(newMin) => {
          if (simulatorTargetProduct) {
            updateProduct(simulatorTargetProduct.id, { minPrice: newMin });
          }
        }}
      />

      {/* Modal de Quebra / Prejuízo */}
      <BrokenLossModal
        isOpen={!!brokenLossTargetProduct}
        onClose={() => setBrokenLossTargetProduct(null)}
        product={brokenLossTargetProduct}
      />

      <ProductHistoryModal
        product={historyTargetProduct}
        sales={sales}
        transactions={transactions}
        tasks={tasks}
        onClose={() => setHistoryTargetProduct(null)}
      />
    </div>
  );
};
