export type ProductCategory =
  | 'Ferramentas'
  | 'Eletrônicos'
  | 'Acessórios'
  | 'Casa & Utilidades'
  | 'Moda & Vestuário'
  | 'Outros';

export type ProductStatus = 'disponivel' | 'reservado' | 'vendido' | 'esgotado';

export interface Product {
  id: string;
  userId?: string;
  name: string;
  category: ProductCategory;
  photoUrl: string;
  costPrice: number;        // Preço de compra / custo unitário
  salePrice: number;        // Preço anunciado / sugerido
  minPrice: number;         // Preço mínimo de venda
  quantity: number;         // Quantidade atual em estoque
  status: ProductStatus;
  description?: string;
  supplier?: string;
  warrantyDays?: number;    // Dias de garantia (ex: 90)
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

export interface Sale {
  id: string;
  userId?: string;
  code: string;             // Ex: VND-001
  productId: string;
  productName: string;
  productPhoto?: string;
  quantity: number;
  unitCostPrice: number;    // Custo unitário no momento da venda
  unitSalePrice: number;    // Preço anunciado
  unitFinalPrice: number;   // Preço negociado
  totalCost: number;        // unitCostPrice * quantity (CMV)
  totalReceived: number;    // unitFinalPrice * quantity (Bruto)
  feeAmount: number;        // Taxa do canal / maquininha
  netReceived: number;      // totalReceived - feeAmount (Líquido que entra no caixa)
  grossProfit: number;      // totalReceived - totalCost
  netProfit: number;        // netReceived - totalCost (Lucro Líquido Real)
  profitMarginPct: number;  // (netProfit / totalReceived) * 100
  paymentMethod: PaymentMethod;
  channel: SalesChannel;
  paymentStatus: PaymentStatus;
  amountPaid: number;       // Valor já pago pelo cliente
  amountPending: number;    // Valor pendente (fiado / a receber)
  customerName?: string;
  customerPhone?: string;   // WhatsApp do cliente
  warrantyDays?: number;    // Dias de garantia oferecidos
  notes?: string;
  soldAt: string;           // ISO date string
}

export type TransactionType =
  | 'venda'                  // Entrada por venda (+)
  | 'recebimento_fiado'      // Recebimento de valor que estava pendente (+)
  | 'aporte_capital'         // Entrada manual de capital no caixa (+)
  | 'compra_estoque'         // Saída para compra de mercadoria (-)
  | 'despesa_operacional'    // Saída com frete, anúncio, embalagem (-)
  | 'retirada'               // Saída de pró-labore / saque (-)
  | 'reembolso_compra';      // Reembolso/estorno de compra: valor de custo volta ao caixa (+)

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
  totalTaxasPlataformas: number;
  totalDespesasOperacionais: number;
  // Indicadores de vendas
  totalFaturamento: number;
  totalVendasRealizadas: number;
  vendasDoMesCount: number;
  vendasDoMesFaturamento: number;
  vendasDoMesLucro: number;
  // Produtos
  totalProdutosCadastrados: number;
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

