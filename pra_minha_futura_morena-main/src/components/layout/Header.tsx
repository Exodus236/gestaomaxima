import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Sun,
  Moon,
  Plus,
  ShoppingCart,
  Wallet,
  Settings,
  Store,
  Layers,
  Cloud,
  CloudOff,
  RefreshCw,
  LogOut,
  User as UserIcon,
  LogIn,
} from 'lucide-react';

interface HeaderProps {
  onOpenNewSale: () => void;
  onOpenNewProduct: () => void;
  onOpenTransaction: () => void;
  onOpenSettings: () => void;
  onOpenAuth?: () => void;
  onOpenRankModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewSale,
  onOpenNewProduct,
  onOpenTransaction,
  onOpenSettings,
  onOpenAuth,
  onOpenRankModal,
}) => {
  const { summary, darkMode, toggleDarkMode, supabaseConnected, supabaseLoading, refreshFromSupabase, rankProgress } = useStore();
  const { user, isGuest, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Identidade Visual */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  RL Market
                </span>
                {/* Badge Status Supabase */}
                {supabaseLoading ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    <span>Conectando...</span>
                  </span>
                ) : supabaseConnected ? (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-pointer"
                    title="Banco de dados Supabase sincronizado em nuvem!"
                    onClick={() => refreshFromSupabase()}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Supabase Nuvem</span>
                  </span>
                ) : (
                  <button
                    onClick={() => refreshFromSupabase()}
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-300"
                    title="Clique para reconectar ao Supabase"
                  >
                    <CloudOff className="w-2.5 h-2.5" />
                    <span>Modo Local</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Sistema de Gestão • Painel de controle da loja
              </p>
            </div>
          </div>

          {/* Mini Indicadores Rápidos no Topo (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Capital Disponível */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Capital Livre
                </span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers">
                  {formatCurrency(summary.capitalDisponivel)}
                </span>
              </div>
            </div>

            {/* Valor em Estoque */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Estoque Ativo
                </span>
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono-numbers">
                  {formatCurrency(summary.totalInvestidoEstoque)}
                </span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas & Controles */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão Vender */}
            <button
              onClick={onOpenNewSale}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition cursor-pointer"
              title="Registrar Venda"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Venda</span>
            </button>

            {/* Botão Novo Produto */}
            <button
              onClick={onOpenNewProduct}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title="Cadastrar Produto"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Produto</span>
            </button>

            {/* Botão Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title={darkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
              )}
            </button>

            {/* Configurações / Backup */}
            <button
              onClick={onOpenSettings}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title="Configurações, Chave Pix e Backup"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Badge de Patente do Lojista */}
            <button
              onClick={onOpenRankModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 transition cursor-pointer shadow-2xs"
              title={`Patente da Loja: ${rankProgress.currentRank.name} (${rankProgress.currentRank.title}). Clique para ver conquistas!`}
            >
              <span className="text-base">{rankProgress.currentRank.badge}</span>
              <span className="text-xs font-black hidden sm:inline">{rankProgress.currentRank.name}</span>
            </button>

            {/* Usuário / Autenticação Supabase */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
                <div
                  className="hidden md:flex flex-col text-right leading-tight max-w-[120px]"
                  title={user.email}
                >
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Autenticado
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  title={`Sair da conta (${user.email})`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition cursor-pointer"
                title="Fazer Login com sua conta Supabase"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
