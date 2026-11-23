import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  Wallet,
  ShoppingCart,
  CheckSquare,
  BarChart3,
  HeartHandshake,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'products'
  | 'finance'
  | 'sales'
  | 'tasks'
  | 'reports'
  | 'after-sales';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { summary } = useStore();

  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'products' as ActiveTab,
      label: 'Produtos e serviços',
      icon: Package,
      badge: summary.totalProdutosCadastrados + summary.totalServicosCadastrados > 0
        ? summary.totalProdutosCadastrados + summary.totalServicosCadastrados
        : null,
    },
    {
      id: 'finance' as ActiveTab,
      label: 'Financeiro',
      icon: Wallet,
      badge: null,
    },
    {
      id: 'sales' as ActiveTab,
      label: 'Vendas',
      icon: ShoppingCart,
      badge: summary.totalVendasRealizadas > 0 ? summary.totalVendasRealizadas : null,
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Tarefas',
      icon: CheckSquare,
      badge: summary.tarefasPendentesCount > 0 ? summary.tarefasPendentesCount : null,
      badgeColor: summary.tarefasAltaPrioridadeCount > 0 ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Relatórios',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'after-sales' as ActiveTab,
      label: 'Pós-venda',
      icon: HeartHandshake,
      badge: null,
    },
  ];

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 dark:text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-emerald-500 text-white'
                        : tab.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
