import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Product,
  Sale,
  FinancialTransaction,
  StoreTask,
  StoreSummary,
  PaymentStatus,
  StoreRank,
  StoreRankProgress,
  StoreGoalInfo,
} from '../types';
import { useAuth } from './AuthContext';
import { calculateStoreRank, calculateStoreGoalInfo } from '../utils/ranks';
import confetti from 'canvas-confetti';
import {
  fetchAllSupabaseData,
  syncProductToSupabase,
  deleteProductFromSupabase,
  syncSaleToSupabase,
  deleteSaleFromSupabase,
  syncTransactionToSupabase,
  syncTaskToSupabase,
  deleteTaskFromSupabase,
  syncSettingsToSupabase,
} from '../services/supabase';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  transactions: FinancialTransaction[];
  tasks: StoreTask[];
  capital: number;
  pixKey: string;
  setPixKey: (key: string) => void;
  monthlyGoal: number;
  setMonthlyGoal: (goal: number) => void;
  rankProgress: StoreRankProgress;
  goalInfo: StoreGoalInfo;
  levelUpRank: StoreRank | null;
  dismissLevelUp: () => void;
  summary: StoreSummary;
  darkMode: boolean;
  toggleDarkMode: () => void;
  // Status de sincronização Supabase
  supabaseConnected: boolean;
  supabaseLoading: boolean;
  refreshFromSupabase: () => Promise<void>;
  // Produtos
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, debitFromCapital?: boolean) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, quantityChange: number, reason?: string) => void;
  // Vendas
  registerSale: (saleData: {
    productId: string;
    quantity: number;
    unitFinalPrice: number;
    feeAmount?: number;
    paymentMethod: Sale['paymentMethod'];
    channel: Sale['channel'];
    paymentStatus?: PaymentStatus;
    amountPaid?: number;
    customerName?: string;
    customerPhone?: string;
    warrantyDays?: number;
    notes?: string;
  }) => { success: boolean; error?: string };
  cancelSale: (saleId: string) => void;
  receivePendingPayment: (saleId: string, amount: number) => void;
  // Financeiro
  addCapitalEntry: (amount: number, description: string) => void;
  addExpense: (amount: number, description: string, category: string) => void;
  addWithdrawal: (amount: number, description: string) => void;
  // Tarefas
  addTask: (task: Omit<StoreTask, 'id' | 'createdAt' | 'completed' | 'userId'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<StoreTask>) => void;
  // Gerenciamento
  resetToDemoData: () => void;
  clearAllData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
}

const DARK_MODE_KEY = 'rl_market_theme_dark';

const initialDemoProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Parafusadeira Furadeira Bateria 12V Bivolt',
    category: 'Ferramentas',
    photoUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
    costPrice: 80.0,
    salePrice: 160.0,
    minPrice: 120.0,
    quantity: 5,
    status: 'disponivel',
    warrantyDays: 90,
    description: 'Acompanha maleta, 2 baterias e kit com 10 bits. Ótimo giro em marketplaces.',
    supplier: 'Distribuidora Ferramentas Brasil',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Fone Bluetooth TWS com Cancelamento de Ruído',
    category: 'Eletrônicos',
    photoUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    costPrice: 45.0,
    salePrice: 99.9,
    minPrice: 85.0,
    quantity: 8,
    status: 'disponivel',
    warrantyDays: 90,
    description: 'Autonomia de 6 horas, case com display digital de bateria.',
    supplier: 'Importadora Tech Global',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest, loading: authLoading } = useAuth();
  const isHydratedRef = useRef<boolean>(false);

  // Chave de armazenamento dinamicamente isolada por usuário
  const getStorageKey = useCallback(() => {
    if (user?.id) {
      return `rl_market_data_${user.id}`;
    }
    return 'rl_market_data_guest';
  }, [user?.id]);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved !== null) return saved === 'true';
    return true;
  });

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Status Supabase
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [supabaseLoading, setSupabaseLoading] = useState<boolean>(true);

  // Estados principais da loja
  const [capital, setCapital] = useState<number>(0);
  const [pixKey, setPixKeyState] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [tasks, setTasks] = useState<StoreTask[]>([]);
  const [monthlyGoal, setMonthlyGoalState] = useState<number>(1000);
  const [levelUpRank, setLevelUpRank] = useState<StoreRank | null>(null);

  const dismissLevelUp = () => setLevelUpRank(null);

  const setMonthlyGoal = (goal: number) => {
    const validGoal = Math.max(100, goal);
    setMonthlyGoalState(validGoal);
    syncSettingsToSupabase(capital, pixKey, user?.id);
  };

  // Carregar dados locais correspondentes ao usuário atual
  const loadLocalUserData = useCallback(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Se for usuário autenticado e tiver resquícios do mock padrão inicial de demonstração,
        // limpa para garantir que a conta inicie 100% zerada
        const isLegacyDemoLeak =
          !!user &&
          (parsed.capital === 1778.35 || parsed.capital === 1640.0) &&
          Array.isArray(parsed.products) &&
          parsed.products.length <= 2 &&
          parsed.products.every((p: any) => p.id === 'prod-1' || p.id === 'prod-2');

        if (isLegacyDemoLeak) {
          localStorage.removeItem(key);
          setCapital(0);
          setPixKeyState('');
          setProducts([]);
          setSales([]);
          setTransactions([]);
          setTasks([]);
          setMonthlyGoalState(1000);
          return false;
        }

        setCapital(typeof parsed.capital === 'number' ? parsed.capital : 0);
        setPixKeyState(parsed.pixKey || '');
        setProducts(Array.isArray(parsed.products) ? parsed.products : []);
        setSales(Array.isArray(parsed.sales) ? parsed.sales : []);
        setTransactions(Array.isArray(parsed.transactions) ? parsed.transactions : []);
        setTasks(Array.isArray(parsed.tasks) ? parsed.tasks : []);
        setMonthlyGoalState(typeof parsed.monthlyGoal === 'number' && parsed.monthlyGoal > 0 ? parsed.monthlyGoal : 1000);
        return true;
      } catch (e) {
        console.error('Erro ao ler dados locais:', e);
      }
    } else if (isGuest && !user) {
      // Se for convidado e não tiver nada salvo, coloca demonstração
      setCapital(1640.0);
      setPixKeyState('contato@rlmarket.com.br');
      setProducts(initialDemoProducts);
      setSales([]);
      setTransactions([]);
      setTasks([]);
      setMonthlyGoalState(1000);
      return true;
    } else {
      // Usuário autenticado novo: COMEÇA 100% ZERADO
      setCapital(0);
      setPixKeyState('');
      setProducts([]);
      setSales([]);
      setTransactions([]);
      setTasks([]);
      setMonthlyGoalState(1000);
      return false;
    }
    return false;
  }, [getStorageKey, isGuest, user]);

  // Salvar no localStorage SOMENTE quando a hidratação estiver concluída e a auth resolvida
  useEffect(() => {
    if (!isHydratedRef.current || authLoading) {
      return;
    }
    const key = getStorageKey();
    const payload = {
      capital,
      pixKey,
      products,
      sales,
      transactions,
      tasks,
      monthlyGoal,
      userId: user?.id || null,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
  }, [capital, pixKey, products, sales, transactions, tasks, monthlyGoal, getStorageKey, user?.id, authLoading]);

  // CARREGAR DADOS DO SUPABASE AO MUDAR USUÁRIO
  const refreshFromSupabase = useCallback(async () => {
    const userId = user?.id;
    if (!userId) {
      setSupabaseConnected(false);
      setSupabaseLoading(false);
      return;
    }

    setSupabaseLoading(true);
    const result = await fetchAllSupabaseData(userId);

    if (result.success) {
      setSupabaseConnected(true);

      // 1. Produtos: se Supabase tem produtos, atualiza; senão, mantém os locais e sincroniza para a nuvem
      if (result.products && result.products.length > 0) {
        setProducts(result.products);
      } else {
        setProducts((currentProds) => {
          if (currentProds.length > 0) {
            currentProds.forEach((p) => syncProductToSupabase(p, userId));
            return currentProds;
          }
          return [];
        });
      }

      // 2. Vendas
      if (result.sales && result.sales.length > 0) {
        setSales(result.sales);
      } else {
        setSales((currentSales) => {
          if (currentSales.length > 0) {
            currentSales.forEach((s) => syncSaleToSupabase(s, userId));
            return currentSales;
          }
          return [];
        });
      }

      // 3. Transações financeiras
      if (result.transactions && result.transactions.length > 0) {
        setTransactions(result.transactions);
      } else {
        setTransactions((currentTx) => {
          if (currentTx.length > 0) {
            currentTx.forEach((t) => syncTransactionToSupabase(t, userId));
            return currentTx;
          }
          return [];
        });
      }

      // 4. Tarefas
      if (result.tasks && result.tasks.length > 0) {
        setTasks(result.tasks);
      } else {
        setTasks((currentTasks) => {
          if (currentTasks.length > 0) {
            currentTasks.forEach((t) => syncTaskToSupabase(t, userId));
            return currentTasks;
          }
          return [];
        });
      }

      // 5. Capital
      if (typeof result.capital === 'number') {
        setCapital(result.capital);
      } else {
        setCapital((currentCap) => {
          if (currentCap > 0) {
            syncSettingsToSupabase(currentCap, pixKey, userId);
            return currentCap;
          }
          return 0;
        });
      }

      if (result.pixKey !== undefined) {
        setPixKeyState(result.pixKey);
      }
    } else {
      // Se deu erro ao buscar dados remotos (ex: schema pendente ou offline), preserva tudo que já foi lido localmente!
      setSupabaseConnected(false);
      console.warn('Supabase não conectado ou schema pendente:', result.error);
    }
    setSupabaseLoading(false);
  }, [user?.id, pixKey]);

  // Ciclo de hidratação: primeiro carrega do dispositivo imediatamente, depois tenta sincronizar com nuvem
  useEffect(() => {
    if (authLoading) return;

    // 1. Carrega imediatamente os dados locais do usuário atual
    loadLocalUserData();
    isHydratedRef.current = true;

    // 2. Se for usuário autenticado, tenta sincronizar com o Supabase
    if (user?.id) {
      refreshFromSupabase();
    } else {
      setSupabaseConnected(false);
      setSupabaseLoading(false);
    }
  }, [authLoading, user?.id, isGuest, loadLocalUserData, refreshFromSupabase]);

  const setPixKey = (key: string) => {
    setPixKeyState(key);
    syncSettingsToSupabase(capital, key, user?.id);
  };

  // AÇÕES: PRODUTOS
  const addProduct = (
    newProdData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'userId'>,
    debitFromCapital: boolean = false
  ) => {
    const newId = `prod-${Date.now()}`;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...newProdData,
      id: newId,
      userId: user?.id,
      createdAt: now,
      updatedAt: now,
    };

    setProducts((prev) => [newProduct, ...prev]);
    syncProductToSupabase(newProduct, user?.id);

    if (debitFromCapital && newProduct.quantity > 0 && newProduct.costPrice > 0) {
      const totalCost = newProduct.costPrice * newProduct.quantity;
      const newCapital = capital - totalCost;
      setCapital(newCapital);
      syncSettingsToSupabase(newCapital, pixKey, user?.id);

      const tx: FinancialTransaction = {
        id: `tx-${Date.now()}`,
        userId: user?.id,
        type: 'compra_estoque',
        amount: -totalCost,
        description: `Compra de estoque: ${newProduct.quantity}x ${newProduct.name}`,
        relatedProductId: newId,
        date: now,
      };
      setTransactions((prev) => [tx, ...prev]);
      syncTransactionToSupabase(tx, user?.id);
    }

    if (!newProduct.photoUrl || newProduct.photoUrl.trim() === '') {
      addTask({
        title: `Fotografar ${newProduct.name}`,
        category: 'fotografar',
        priority: 'alta',
        relatedProductId: newId,
        notes: 'Produto cadastrado sem foto de capa.',
      });
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
        if (updated.quantity <= 0 && updated.status === 'disponivel') {
          updated.status = 'esgotado';
        } else if (updated.quantity > 0 && updated.status === 'esgotado') {
          updated.status = 'disponivel';
        }
        syncProductToSupabase(updated, user?.id);
        return updated;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteProductFromSupabase(id);
  };

  const adjustStock = (id: string, quantityChange: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newQty = Math.max(0, p.quantity + quantityChange);
        let newStatus = p.status;
        if (newQty <= 0) newStatus = 'esgotado';
        else if (p.status === 'esgotado') newStatus = 'disponivel';

        const updated = {
          ...p,
          quantity: newQty,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
        syncProductToSupabase(updated, user?.id);
        return updated;
      })
    );
  };

  // AÇÕES: VENDAS
  const registerSale = (saleData: {
    productId: string;
    quantity: number;
    unitFinalPrice: number;
    feeAmount?: number;
    paymentMethod: Sale['paymentMethod'];
    channel: Sale['channel'];
    paymentStatus?: PaymentStatus;
    amountPaid?: number;
    customerName?: string;
    customerPhone?: string;
    warrantyDays?: number;
    notes?: string;
  }): { success: boolean; error?: string } => {
    const product = products.find((p) => p.id === saleData.productId);
    if (!product) return { success: false, error: 'Produto não encontrado.' };

    if (product.quantity < saleData.quantity) {
      return {
        success: false,
        error: `Estoque insuficiente! Disponível: ${product.quantity} unidades.`,
      };
    }

    const saleQuantity = Number(saleData.quantity);
    const unitFinalPrice = Number(saleData.unitFinalPrice);
    const unitCostPrice = product.costPrice;
    const unitSalePrice = product.salePrice;

    const totalCost = unitCostPrice * saleQuantity;
    const totalReceived = unitFinalPrice * saleQuantity;
    const feeAmount = Number(saleData.feeAmount || 0);
    const netReceived = Math.max(0, totalReceived - feeAmount);

    const grossProfit = totalReceived - totalCost;
    const netProfit = netReceived - totalCost;
    const profitMarginPct = totalReceived > 0 ? (netProfit / totalReceived) * 100 : 0;

    const paymentStatus: PaymentStatus = saleData.paymentStatus || 'pago';
    let amountPaid = Number(saleData.amountPaid ?? totalReceived);
    if (paymentStatus === 'pago') {
      amountPaid = totalReceived;
    } else if (paymentStatus === 'pendente') {
      amountPaid = 0;
    }
    const amountPending = Math.max(0, totalReceived - amountPaid);

    const saleId = `sale-${Date.now()}`;
    const code = `VND-${String(sales.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newSale: Sale = {
      id: saleId,
      userId: user?.id,
      code,
      productId: product.id,
      productName: product.name,
      productPhoto: product.photoUrl,
      quantity: saleQuantity,
      unitCostPrice,
      unitSalePrice,
      unitFinalPrice,
      totalCost,
      totalReceived,
      feeAmount,
      netReceived,
      grossProfit,
      netProfit,
      profitMarginPct,
      paymentMethod: saleData.paymentMethod,
      channel: saleData.channel,
      paymentStatus,
      amountPaid,
      amountPending,
      customerName: saleData.customerName,
      customerPhone: saleData.customerPhone,
      warrantyDays: saleData.warrantyDays ?? product.warrantyDays ?? 90,
      notes: saleData.notes,
      soldAt: now,
    };

    setSales((prev) => [newSale, ...prev]);
    syncSaleToSupabase(newSale, user?.id);

    // Diminui estoque
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== product.id) return p;
        const newQty = p.quantity - saleQuantity;
        const updated = {
          ...p,
          quantity: newQty,
          status: newQty <= 0 ? 'esgotado' : p.status,
          updatedAt: now,
        };
        syncProductToSupabase(updated, user?.id);
        return updated;
      })
    );

    // Atualiza caixa
    const actualCashIn = paymentStatus === 'pago' ? netReceived : Math.max(0, amountPaid - feeAmount);
    if (actualCashIn > 0) {
      const newCapital = capital + actualCashIn;
      setCapital(newCapital);
      syncSettingsToSupabase(newCapital, pixKey, user?.id);

      const tx: FinancialTransaction = {
        id: `tx-${Date.now()}`,
        userId: user?.id,
        type: 'venda',
        amount: actualCashIn,
        description: `Venda #${code} - ${saleQuantity}x ${product.name}${feeAmount > 0 ? ` (Desc. Taxa: -R$ ${feeAmount.toFixed(2)})` : ''}`,
        relatedSaleId: saleId,
        relatedProductId: product.id,
        date: now,
      };
      setTransactions((prev) => [tx, ...prev]);
      syncTransactionToSupabase(tx, user?.id);
    }

    if (amountPending > 0) {
      addTask({
        title: `Cobrar valor pendente de ${saleData.customerName || 'Cliente'} (R$ ${amountPending.toFixed(2)})`,
        category: 'geral',
        priority: 'alta',
        relatedProductId: product.id,
        notes: `Referente à venda #${code} de ${product.name}.`,
      });
    }

    // Verifica Level Up de Patente e Meta do Mês
    const prevHistoricalRev = sales.reduce((acc, s) => acc + s.totalReceived, 0);
    const newHistoricalRev = prevHistoricalRev + totalReceived;
    const prevRank = calculateStoreRank(prevHistoricalRev).currentRank;
    const newRank = calculateStoreRank(newHistoricalRev).currentRank;

    if (newRank.id !== prevRank.id) {
      setLevelUpRank(newRank);
    } else {
      const nowD = new Date();
      const currentYear = nowD.getFullYear();
      const currentMonth = nowD.getMonth();
      const prevMonthSales = sales.filter((s) => {
        const d = new Date(s.soldAt);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      });
      const prevMonthRev = prevMonthSales.reduce((acc, s) => acc + s.totalReceived, 0);
      const newMonthRev = prevMonthRev + totalReceived;
      if (prevMonthRev < monthlyGoal && newMonthRev >= monthlyGoal) {
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    return { success: true };
  };

  const cancelSale = (saleId: string) => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale) return;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== sale.productId) return p;
        const newQty = p.quantity + sale.quantity;
        const updated = {
          ...p,
          quantity: newQty,
          status: p.status === 'esgotado' ? 'disponivel' : p.status,
          updatedAt: new Date().toISOString(),
        };
        syncProductToSupabase(updated, user?.id);
        return updated;
      })
    );

    const actualCashPaid = sale.paymentStatus === 'pago' ? sale.netReceived : Math.max(0, sale.amountPaid - sale.feeAmount);
    if (actualCashPaid > 0) {
      const newCapital = capital - actualCashPaid;
      setCapital(newCapital);
      syncSettingsToSupabase(newCapital, pixKey, user?.id);

      const tx: FinancialTransaction = {
        id: `tx-${Date.now()}`,
        userId: user?.id,
        type: 'retirada',
        amount: -actualCashPaid,
        description: `Estorno de Venda #${sale.code} (${sale.productName})`,
        relatedSaleId: sale.id,
        date: new Date().toISOString(),
      };
      setTransactions((prev) => [tx, ...prev]);
      syncTransactionToSupabase(tx, user?.id);
    }

    setSales((prev) => prev.filter((s) => s.id !== saleId));
    deleteSaleFromSupabase(saleId);
  };

  const receivePendingPayment = (saleId: string, amount: number) => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale || sale.amountPending <= 0) return;

    const paymentAmount = Math.min(amount, sale.amountPending);
    const newAmountPaid = sale.amountPaid + paymentAmount;
    const newAmountPending = Math.max(0, sale.amountPending - paymentAmount);
    const newStatus: PaymentStatus = newAmountPending === 0 ? 'pago' : 'parcial';

    const updatedSale: Sale = {
      ...sale,
      amountPaid: newAmountPaid,
      amountPending: newAmountPending,
      paymentStatus: newStatus,
    };

    setSales((prev) => prev.map((s) => (s.id === saleId ? updatedSale : s)));
    syncSaleToSupabase(updatedSale, user?.id);

    const newCapital = capital + paymentAmount;
    setCapital(newCapital);
    syncSettingsToSupabase(newCapital, pixKey, user?.id);

    const tx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      userId: user?.id,
      type: 'recebimento_fiado',
      amount: paymentAmount,
      description: `Recebimento pendente: #${sale.code} (${sale.customerName || sale.productName})`,
      relatedSaleId: sale.id,
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);
    syncTransactionToSupabase(tx, user?.id);
  };

  // FINANCEIRO
  const addCapitalEntry = (amount: number, description: string) => {
    const now = new Date().toISOString();
    const newCapital = capital + amount;
    setCapital(newCapital);
    syncSettingsToSupabase(newCapital, pixKey, user?.id);

    const tx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      userId: user?.id,
      type: 'aporte_capital',
      amount: amount,
      description: description || 'Aporte de Capital',
      date: now,
    };
    setTransactions((prev) => [tx, ...prev]);
    syncTransactionToSupabase(tx, user?.id);
  };

  const addExpense = (amount: number, description: string, category: string) => {
    const now = new Date().toISOString();
    const finalAmount = Math.abs(amount);
    const newCapital = capital - finalAmount;
    setCapital(newCapital);
    syncSettingsToSupabase(newCapital, pixKey, user?.id);

    const tx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      userId: user?.id,
      type: 'despesa_operacional',
      amount: -finalAmount,
      description: description || 'Despesa Operacional',
      category: category || 'Geral',
      date: now,
    };
    setTransactions((prev) => [tx, ...prev]);
    syncTransactionToSupabase(tx, user?.id);
  };

  const addWithdrawal = (amount: number, description: string) => {
    const now = new Date().toISOString();
    const finalAmount = Math.abs(amount);
    const newCapital = capital - finalAmount;
    setCapital(newCapital);
    syncSettingsToSupabase(newCapital, pixKey, user?.id);

    const tx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      userId: user?.id,
      type: 'retirada',
      amount: -finalAmount,
      description: description || 'Retirada / Pró-labore',
      date: now,
    };
    setTransactions((prev) => [tx, ...prev]);
    syncTransactionToSupabase(tx, user?.id);
  };

  // TAREFAS
  const addTask = (taskData: Omit<StoreTask, 'id' | 'createdAt' | 'completed' | 'userId'>) => {
    const newTask: StoreTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      userId: user?.id,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    syncTaskToSupabase(newTask, user?.id);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const willComplete = !t.completed;
        const updated: StoreTask = {
          ...t,
          completed: willComplete,
          completedAt: willComplete ? new Date().toISOString() : undefined,
        };
        syncTaskToSupabase(updated, user?.id);
        return updated;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    deleteTaskFromSupabase(id);
  };

  const updateTask = (id: string, updates: Partial<StoreTask>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, ...updates };
        syncTaskToSupabase(updated, user?.id);
        return updated;
      })
    );
  };

  const resetToDemoData = () => {
    const demoProds = initialDemoProducts.map((p) => ({ ...p, userId: user?.id }));
    setCapital(1640.0);
    setProducts(demoProds);
    setSales([]);
    setTransactions([]);
    setTasks([]);
    setPixKey('contato@rlmarket.com.br');
    demoProds.forEach((p) => syncProductToSupabase(p, user?.id));
    syncSettingsToSupabase(1640.0, 'contato@rlmarket.com.br', user?.id);
  };

  const clearAllData = async () => {
    const currentProds = [...products];
    const currentSales = [...sales];
    const currentTasks = [...tasks];

    setCapital(0);
    setProducts([]);
    setSales([]);
    setTransactions([]);
    setTasks([]);
    setPixKeyState('');

    const key = getStorageKey();
    localStorage.removeItem(key);
    // Remove também chaves antigas de teste se existirem
    localStorage.removeItem('rl_market_store_data');

    if (user?.id) {
      await syncSettingsToSupabase(0, '', user.id);
      currentProds.forEach((p) => deleteProductFromSupabase(p.id));
      currentSales.forEach((s) => deleteSaleFromSupabase(s.id));
      currentTasks.forEach((t) => deleteTaskFromSupabase(t.id));
    }
  };

  const exportDataJson = () => {
    const data = {
      capital,
      pixKey,
      products,
      sales,
      transactions,
      tasks,
      userId: user?.id || null,
      exportedAt: new Date().toISOString(),
      version: '3.0',
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed.capital === 'number' && Array.isArray(parsed.products)) {
        setCapital(parsed.capital);
        setProducts(parsed.products);
        if (parsed.pixKey) setPixKey(parsed.pixKey);
        if (Array.isArray(parsed.sales)) setSales(parsed.sales);
        if (Array.isArray(parsed.transactions)) setTransactions(parsed.transactions);
        if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // CÁLCULOS
  const totalInvestidoEstoque = products.reduce((acc, p) => acc + p.costPrice * p.quantity, 0);
  const valorPotencialEstoque = products.reduce((acc, p) => acc + p.salePrice * p.quantity, 0);
  const lucroPotencialEstoque = valorPotencialEstoque - totalInvestidoEstoque;

  const lucroBrutoAcumulado = sales.reduce((acc, s) => acc + s.grossProfit, 0);
  const totalTaxasPlataformas = sales.reduce((acc, s) => acc + (s.feeAmount || 0), 0);
  const totalFaturamento = sales.reduce((acc, s) => acc + s.totalReceived, 0);
  const totalContasAReceber = sales.reduce((acc, s) => acc + (s.amountPending || 0), 0);

  const totalDespesasOperacionais = Math.abs(
    transactions
      .filter((t) => t.type === 'despesa_operacional')
      .reduce((acc, t) => acc + t.amount, 0)
  );

  const lucroLiquidoAcumulado = lucroBrutoAcumulado - totalTaxasPlataformas - totalDespesasOperacionais;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const salesThisMonth = sales.filter((s) => {
    const saleDate = new Date(s.soldAt);
    return saleDate.getFullYear() === currentYear && saleDate.getMonth() === currentMonth;
  });

  const summary: StoreSummary = {
    capitalDisponivel: capital,
    totalContasAReceber,
    totalInvestidoEstoque,
    valorPotencialEstoque,
    lucroPotencialEstoque,
    lucroBrutoAcumulado,
    lucroLiquidoAcumulado,
    totalTaxasPlataformas,
    totalDespesasOperacionais,
    totalFaturamento,
    totalVendasRealizadas: sales.length,
    vendasDoMesCount: salesThisMonth.length,
    vendasDoMesFaturamento: salesThisMonth.reduce((acc, s) => acc + s.totalReceived, 0),
    vendasDoMesLucro: salesThisMonth.reduce((acc, s) => acc + (s.netProfit || s.grossProfit), 0),
    totalProdutosCadastrados: products.length,
    totalItensEmEstoque: products.reduce((acc, p) => acc + p.quantity, 0),
    produtosEsgotadosCount: products.filter((p) => p.quantity === 0 || p.status === 'esgotado').length,
    tarefasPendentesCount: tasks.filter((t) => !t.completed).length,
    tarefasAltaPrioridadeCount: tasks.filter((t) => !t.completed && t.priority === 'alta').length,
  };

  // CÁLCULO DE GAMIFICAÇÃO & METAS
  const rankProgress = calculateStoreRank(summary.totalFaturamento);
  const goalInfo = calculateStoreGoalInfo(
    monthlyGoal,
    summary.vendasDoMesFaturamento,
    summary.vendasDoMesLucro,
    summary.vendasDoMesCount
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        transactions,
        tasks,
        capital,
        pixKey,
        setPixKey,
        monthlyGoal,
        setMonthlyGoal,
        rankProgress,
        goalInfo,
        levelUpRank,
        dismissLevelUp,
        summary,
        darkMode,
        toggleDarkMode,
        supabaseConnected,
        supabaseLoading,
        refreshFromSupabase,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        registerSale,
        cancelSale,
        receivePendingPayment,
        addCapitalEntry,
        addExpense,
        addWithdrawal,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        resetToDemoData,
        clearAllData,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore deve ser usado dentro de um StoreProvider');
  return context;
};
