import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  formatDate,
  formatDateTime,
  getPriorityBadge,
  getTaskCategoryLabel,
} from '../../utils/formatters';
import {
  CheckSquare,
  Square,
  Plus,
  Filter,
  Trash2,
  Sparkles,
  AlertCircle,
  Tag,
  Clock,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { StoreTask, TaskCategory, TaskPriority } from '../../types';

interface TasksViewProps {
  onOpenNewTask: (category?: TaskCategory) => void;
}

const suggestedQuickTasks = [
  { title: '📸 Fotografar novos produtos com fundo neutro e boa iluminação', category: 'fotografar' as TaskCategory, priority: 'alta' as TaskPriority },
  { title: '🛒 Criar anúncios com palavras-chave no Mercado Livre e OLX', category: 'marketplace' as TaskCategory, priority: 'alta' as TaskPriority },
  { title: '📱 Gravar vídeo demonstrativo para Reels e Stories no Instagram', category: 'instagram' as TaskCategory, priority: 'media' as TaskPriority },
  { title: '📢 Compartilhar produtos nos grupos locais de vendas e desapego', category: 'marketplace' as TaskCategory, priority: 'media' as TaskPriority },
  { title: '🔍 Pesquisar fornecedores alternativos com melhor preço de frete', category: 'fornecedores' as TaskCategory, priority: 'baixa' as TaskPriority },
  { title: '📦 Fazer contagem física de estoque para conferência geral', category: 'estoque' as TaskCategory, priority: 'alta' as TaskPriority },
];

export const TasksView: React.FC<TasksViewProps> = ({ onOpenNewTask }) => {
  const { tasks, toggleTask, deleteTask, addTask, summary } = useStore();

  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [filterStatus, setFilterStatus] = useState<'todas' | 'pendentes' | 'concluidas'>('pendentes');

  const filteredTasks = tasks.filter((t) => {
    const matchesCategory =
      filterCategory === 'todas' || t.category === filterCategory;

    const matchesStatus =
      filterStatus === 'todas' ||
      (filterStatus === 'pendentes' ? !t.completed : t.completed);

    return matchesCategory && matchesStatus;
  });

  const handleAddQuick = (task: typeof suggestedQuickTasks[0]) => {
    addTask({
      title: task.title,
      category: task.category,
      priority: task.priority,
      notes: 'Sugestão rápida para rotina de gestão da loja',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Tarefas & Checklist da Loja
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
              {summary.tarefasPendentesCount} pendentes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize fotografia de produtos, anúncios em marketplaces, divulgação no Instagram e reposições.
          </p>
        </div>

        <button
          onClick={() => onOpenNewTask()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Sugestões Rápidas de Rotina de Lojista */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-500/20 space-y-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <h3 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
            Rotina Essencial da Loja (Adicione com 1 clique)
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQuickTasks.map((q) => (
            <button
              key={q.title}
              onClick={() => handleAddQuick(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-purple-500" />
              <span>{q.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('pendentes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'pendentes'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Pendentes ({tasks.filter((t) => !t.completed).length})
          </button>
          <button
            onClick={() => setFilterStatus('concluidas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'concluidas'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Concluídas ({tasks.filter((t) => t.completed).length})
          </button>
          <button
            onClick={() => setFilterStatus('todas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'todas'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Todas ({tasks.length})
          </button>
        </div>

        {/* Categoria Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
          >
            <option value="todas">Todas as categorias</option>
            <option value="fotografar">📸 Fotografar</option>
            <option value="anunciar">📢 Anúncios</option>
            <option value="instagram">📷 Instagram</option>
            <option value="marketplace">🛒 Marketplace</option>
            <option value="contas">🔑 Contas</option>
            <option value="fornecedores">📦 Fornecedores</option>
            <option value="estoque">📋 Estoque</option>
            <option value="geral">📌 Geral</option>
          </select>
        </div>
      </div>

      {/* Lista de Tarefas */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3">
          <CheckSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Nenhuma tarefa encontrada
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            {filterStatus === 'pendentes'
              ? 'Todas as tarefas pendentes foram realizadas! Que tal adicionar novos objetivos?'
              : 'Nenhuma tarefa corresponde aos filtros selecionados.'}
          </p>
          <button
            onClick={() => onOpenNewTask()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Tarefa</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const priorityBadge = getPriorityBadge(task.priority);
            const categoryLabel = getTaskCategoryLabel(task.category);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  task.completed
                    ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800/80 shadow-xs'
                }`}
              >
                {/* Checkbox e Conteúdo */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5 text-purple-600 dark:text-purple-400 hover:scale-110 transition shrink-0 cursor-pointer"
                    title={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 hover:border-purple-500 transition" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <h4
                      className={`text-sm font-semibold leading-snug ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {task.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {categoryLabel}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge.bg}`}
                      >
                        {priorityBadge.label}
                      </span>

                      <span className="text-[11px] text-slate-400">
                        {formatDate(task.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botão de Excluir */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0 cursor-pointer"
                  title="Excluir Tarefa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
