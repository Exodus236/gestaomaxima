export type ProductCategory =
  | 'Ferramentas'
  | 'Eletrônicos'
  | 'Acessórios'
  | 'Casa & Utilidades'
  | 'Moda & Vestuário'
  | 'Outros';

export type ProductStatus = 'disponivel' | 'reservado' | 'vendido' | 'esgotado' | 'quebrou';
export type CatalogItemKind = 'produto' | 'servico';

export interface ProductPriceSnapshot {
  costPrice: number;
  salePrice: number;
  minPrice: number;
  recordedAt: string;
}

export interface Product {
  id: string;
  userId?: string;
  kind?: CatalogItemKind;
  name: string;
  category: ProductCategory;
  photoUrl: string;
  costPrice: number;
  salePrice: number;
  minPrice: number;
  quantity: number;
  status: ProductStatus;
  description?: string;
  supplier?: string;
  priceHistory?: ProductPriceSnapshot[];
  warrantyDays?: number;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod =
  | 'pix'
  | 'cartao_credito'
  | 'cartao_debito'
  | 'dinheiro'
  | 'transferencia'
  | 'outro';

export type SalesChannel =
  | 'instagram'
  | 'mercado_livre'
  | 'olx'
  | 'whatsapp'
  | 'balcao'
  | 'loja_virtual'
  | 'outro';

export type PaymentStatus = 'pago' | 'pendente' | 'parcial';
export type AfterSaleStatus = 'open' | 'contacted' | 'returned' | 'resolved';

export interface Sale {
  id: string;
  userId?: string;
  itemKind?: CatalogItemKind;
  code: string;
  productId: string;
  productName: string;
  productPhoto?: string;
  quantity: number;
  unitCostPrice: number;
  unitSalePrice: number;
  unitFinalPrice: number;
  totalCost: number;
  totalReceived: number;
  feeAmount: number;
  netReceived: number;
  grossProfit: number;
  netProfit: number;
  profitMarginPct: number;
  paymentMethod: PaymentMethod;
  channel: SalesChannel;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  amountPending: number;
  customerName?: string;
  customerPhone?: string;
  warrantyDays?: number;
  afterSaleStatus?: AfterSaleStatus;
  followUpDate?: string;
  afterSaleNotes?: string;
  notes?: string;
  soldAt: string;
}

export type TransactionType =
  | 'venda'
  | 'recebimento_fiado'
  | 'aporte_capital'
  | 'compra_estoque'
  | 'despesa_operacional'    // Saída com frete, anúncio, embalagem (-)
  | 'retirada'               // Saída de pró-labore / saque (-)
  | 'reembolso_compra'       // Reembolso/estorno de compra: valor de custo volta ao caixa (+)
  | 'prejuizo_avaria';       // Prejuízo por perda, defeito sem garantia ou quebra (-)

export interface FinancialTransaction {
  id: string;
  userId?: string;
  type: TransactionType;
  amount: number;            // Positivo para entrada, negativo para saída
  description: string;
  category?: string;
  relatedSaleId?: string;
  relatedProductId?: string;
  date: string;
}

export type TaskCategory =
  | 'fotografar'
  | 'anunciar'
  | 'instagram'
  | 'marketplace'
  | 'contas'
  | 'fornecedores'
  | 'estoque'
  | 'geral';

export type TaskPriority = 'alta' | 'media' | 'baixa';

export interface StoreTask {
  id: string;
  userId?: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  dismissed?: boolean;
  dueDate?: string;
  relatedProductId?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface StoreSummary {
  // 1. Capital disponível (dinheiro em caixa real)
  capitalDisponivel: number;
  // Valores a receber de clientes (vendas fiado/pendentes)
  totalContasAReceber: number;
  // 2. Estoque (dinheiro investido em produtos ainda não vendidos)
  totalInvestidoEstoque: number;
  // Valor potencial de venda do estoque
  valorPotencialEstoque: number;
  // Lucro potencial preso no estoque
  lucroPotencialEstoque: number;
  // 3. Lucro acumulado realizado
  lucroBrutoAcumulado: number;
  lucroLiquidoAcumulado: number;
  totalPrejuizoAvarias: number;
  totalTaxasPlataformas: number;
  totalDespesasOperacionais: number;
  // Indicadores de vendas
  totalFaturamento: number;
  totalFaturamentoServicos: number;
  totalComprasEstoque: number;
  totalVendasRealizadas: number;
  vendasDoMesCount: number;
  vendasDoMesFaturamento: number;
  vendasDoMesLucro: number;
  // Produtos
  totalProdutosCadastrados: number;
  totalServicosCadastrados: number;
  totalItensEmEstoque: number;
  produtosEsgotadosCount: number;
  // Tarefas
  tarefasPendentesCount: number;
  tarefasAltaPrioridadeCount: number;
}

// ==========================================
// GAMIFICAÇÃO: PATENTES & METAS
// ==========================================

export type StoreRankId =
  | 'bronze'
  | 'prata'
  | 'ouro'
  | 'safira'
  | 'rubi'
  | 'platina'
  | 'diamante';

export interface StoreRank {
  id: StoreRankId;
  name: string;
  title: string;
  minRevenue: number;
  maxRevenue: number | null;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  cardBorderClass: string;
  description: string;
  perk: string;
}

export interface StoreRankProgress {
  currentRank: StoreRank;
  nextRank: StoreRank | null;
  totalRevenue: number;
  progressPct: number;
  remainingAmount: number;
}

export interface StoreGoalInfo {
  monthlyGoal: number;
  currentMonthRevenue: number;
  currentMonthProfit: number;
  progressPct: number;
  remainingAmount: number;
  isCompleted: boolean;
  daysRemainingInMonth: number;
  dailyPaceRequired: number;
  estimatedOrdersNeeded: number;
  averageTicket: number;
}

// ==========================================
// GAMIFICAÇÃO: NÍVEL & EXPERIÊNCIA (XP)
// ==========================================

export interface UserLevelInfo {
  level: number;
  currentXP: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  progressPct: number;
  levelTitle: string;
  starsCount: number; // 0 a 3 estrelas baseadas no nível
  levelBorderColor: string;
}

