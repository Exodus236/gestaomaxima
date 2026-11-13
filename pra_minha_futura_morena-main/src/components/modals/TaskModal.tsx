import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { TaskCategory, TaskPriority } from '../../types';
import { X, CheckSquare, Sparkles } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategory?: TaskCategory;
}

const quickTaskPresets = [
  { title: 'Fotografar produtos novos', category: 'fotografar' as TaskCategory, priority: 'alta' as TaskPriority },
  { title: 'Criar novos anúncios no Mercado Livre e OLX', category: 'marketplace' as TaskCategory, priority: 'alta' as TaskPriority },
  { title: 'Publicar Reels e Stories no Instagram', category: 'instagram' as TaskCategory, priority: 'media' as TaskPriority },
  { title: 'Divulgar produtos em grupos do Facebook / Marketplace', category: 'marketplace' as TaskCategory, priority: 'media' as TaskPriority },
  { title: 'Criar nova conta de vendas / canal alternativo', category: 'contas' as TaskCategory, priority: 'baixa' as TaskPriority },
  { title: 'Pesquisar e cotar novos fornecedores atacado', category: 'fornecedores' as TaskCategory, priority: 'media' as TaskPriority },
  { title: 'Conferir e organizar estoque físico da loja', category: 'estoque' as TaskCategory, priority: 'alta' as TaskPriority },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  preselectedCategory,
}) => {
  const { addTask, products } = useStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>(preselectedCategory || 'geral');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [relatedProductId, setRelatedProductId] = useState<string>('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      category,
      priority,
      relatedProductId: relatedProductId || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const handleApplyPreset = (preset: typeof quickTaskPresets[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setPriority(preset.priority);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Nova Tarefa ou Checklist
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Organize a rotina operacional da sua loja
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
          {/* Sugestões Rápidas */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Modelos frequentes para lojistas:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickTaskPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.title}
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 dark:bg-slate-800 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 transition text-left"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Título da Tarefa *
            </label>
            <input
              type="text"
              placeholder="Ex: Fotografar parafusadeira com luz branca"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Categoria e Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="fotografar">📸 Fotografar produtos</option>
                <option value="anunciar">📢 Criar anúncios</option>
                <option value="instagram">📷 Publicar no Instagram</option>
                <option value="marketplace">🛒 Divulgar no Marketplace</option>
                <option value="contas">🔑 Criar novas contas</option>
                <option value="fornecedores">📦 Buscar fornecedores</option>
                <option value="estoque">📋 Conferir estoque</option>
                <option value="geral">📌 Outros / Geral</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Prioridade *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="alta">🔴 Alta Prioridade</option>
                <option value="media">🟡 Média Prioridade</option>
                <option value="baixa">🟢 Baixa Prioridade</option>
              </select>
            </div>
          </div>

          {/* Vínculo com Produto (Opcional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Vincular a um Produto da Loja (opcional)
            </label>
            <select
              value={relatedProductId}
              onChange={(e) => setRelatedProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Nenhum produto específico</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Detalhes adicionais
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Detalhes, links de fornecedor ou especificações"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20 transition cursor-pointer"
            >
              Criar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
