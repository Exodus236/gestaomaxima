import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { Header } from './components/layout/Header';
import { Navigation, ActiveTab } from './components/layout/Navigation';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductsView } from './components/products/ProductsView';
import { FinanceView } from './components/finance/FinanceView';
import { SalesView } from './components/sales/SalesView';
import { TasksView } from './components/tasks/TasksView';
import { ReportsView } from './components/reports/ReportsView';

import { NewSaleModal } from './components/modals/NewSaleModal';
import { ProductModal } from './components/modals/ProductModal';
import { TransactionModal } from './components/modals/TransactionModal';
import { TaskModal } from './components/modals/TaskModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { SaleReceiptModal } from './components/modals/SaleReceiptModal';
import { AdCopyModal } from './components/modals/AdCopyModal';
import { GoalModal } from './components/modals/GoalModal';
import { RankModal } from './components/modals/RankModal';
import { LevelUpModal } from './components/modals/LevelUpModal';
import { useStore } from './context/StoreContext';

import { Product, Sale, TaskCategory } from './types';
import { Store } from 'lucide-react';

interface MainAppProps {
  onShowAuth: () => void;
}

function MainApp({ onShowAuth }: MainAppProps) {
  const { levelUpRank, dismissLevelUp } = useStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modais de Entrada
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedProductIdForSale, setSelectedProductIdForSale] = useState<string | undefined>(undefined);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionDefaultType, setTransactionDefaultType] = useState<'aporte' | 'despesa' | 'retirada'>('aporte');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskCategoryPreset, setTaskCategoryPreset] = useState<TaskCategory | undefined>(undefined);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);

  // Novos Modais: Comprovante WhatsApp e Copywriting
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<Sale | null>(null);

  const [isAdCopyModalOpen, setIsAdCopyModalOpen] = useState(false);
  const [selectedProductForAd, setSelectedProductForAd] = useState<Product | null>(null);

  // Ações de abertura
  const handleOpenSaleModal = (productId?: string) => {
    setSelectedProductIdForSale(productId);
    setIsSaleModalOpen(true);
  };

  const handleOpenNewProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleOpenTransaction = (type: 'aporte' | 'despesa' | 'retirada' = 'aporte') => {
    setTransactionDefaultType(type);
    setIsTransactionModalOpen(true);
  };

  const handleOpenTask = (category?: TaskCategory) => {
    setTaskCategoryPreset(category);
    setIsTaskModalOpen(true);
  };

  const handleOpenReceipt = (sale: Sale) => {
    setSelectedSaleForReceipt(sale);
    setIsReceiptModalOpen(true);
  };

  const handleOpenAdCopy = (product: Product) => {
    setSelectedProductForAd(product);
    setIsAdCopyModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header */}
      <Header
        onOpenNewSale={() => handleOpenSaleModal()}
        onOpenNewProduct={handleOpenNewProduct}
        onOpenTransaction={() => handleOpenTransaction('aporte')}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAuth={onShowAuth}
        onOpenRankModal={() => setIsRankModalOpen(true)}
      />

      {/* Navegação Principal */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={setActiveTab}
            onOpenNewSale={handleOpenSaleModal}
            onOpenNewProduct={handleOpenNewProduct}
            onOpenTransaction={() => handleOpenTransaction('aporte')}
            onOpenTask={() => handleOpenTask()}
            onOpenGoalModal={() => setIsGoalModalOpen(true)}
            onOpenRankModal={() => setIsRankModalOpen(true)}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            onOpenNewProduct={handleOpenNewProduct}
            onEditProduct={handleEditProduct}
            onQuickSale={handleOpenSaleModal}
            onGenerateAd={handleOpenAdCopy}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceView onOpenTransaction={handleOpenTransaction} />
        )}

        {activeTab === 'sales' && (
          <SalesView
            onOpenNewSale={() => handleOpenSaleModal()}
            onOpenReceipt={handleOpenReceipt}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView onOpenNewTask={handleOpenTask} />
        )}

        {activeTab === 'reports' && <ReportsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 bg-white dark:bg-slate-900 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>RL Market — Sistema de Gestão Integrado</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Dados sincronizados em tempo real no dispositivo
          </span>
        </div>
      </footer>

      {/* Modais Globais */}
      <NewSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        preselectedProductId={selectedProductIdForSale}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
      />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        defaultType={transactionDefaultType}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        preselectedCategory={taskCategoryPreset}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Modal de Comprovante de Venda / WhatsApp */}
      <SaleReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        sale={selectedSaleForReceipt}
      />

      {/* Modal de Anúncio / Copywriting */}
      <AdCopyModal
        isOpen={isAdCopyModalOpen}
        onClose={() => setIsAdCopyModalOpen(false)}
        product={selectedProductForAd}
      />

      {/* Modais de Gamificação: Metas e Patentes */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />

      <RankModal
        isOpen={isRankModalOpen}
        onClose={() => setIsRankModalOpen(false)}
      />

      <LevelUpModal
        rank={levelUpRank}
        onClose={dismissLevelUp}
      />
    </div>
  );
}

function RootApp() {
  const { user, loading, isGuest } = useAuth();
  const [forceShowAuth, setForceShowAuth] = useState(false);

  // Splash Screen de Carregamento da Sessão
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce mb-3">
          <Store className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Carregando RL Market...</span>
        </div>
      </div>
    );
  }

  // Se não estiver logado e não for convidado (ou se clicou em 'Fazer Login' voluntariamente)
  if ((!user && !isGuest) || forceShowAuth) {
    return <AuthScreen onDismiss={() => setForceShowAuth(false)} />;
  }

  return <MainApp onShowAuth={() => setForceShowAuth(true)} />;
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <RootApp />
      </StoreProvider>
    </AuthProvider>
  );
}
