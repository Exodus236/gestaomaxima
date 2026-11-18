import { PaymentMethod, ProductCategory, ProductStatus, SalesChannel, TaskCategory, TaskPriority, TransactionType } from '../types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0,0%';
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStatusBadge(status: ProductStatus) {
  switch (status) {
    case 'disponivel':
      return { label: 'Disponível', bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
    case 'reservado':
      return { label: 'Reservado', bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    case 'vendido':
      return { label: 'Vendido', bg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' };
    case 'esgotado':
      return { label: 'Esgotado', bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' };
    default:
      return { label: status, bg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30' };
  }
}

export function getPriorityBadge(priority: TaskPriority) {
  switch (priority) {
    case 'alta':
      return { label: 'Alta prioridade', bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' };
    case 'media':
      return { label: 'Média prioridade', bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    case 'baixa':
      return { label: 'Baixa prioridade', bg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30' };
  }
}

export function getTaskCategoryLabel(category: TaskCategory): string {
  switch (category) {
    case 'fotografar':
      return '📸 Fotografar';
    case 'anunciar':
      return '📢 Criar Anúncio';
    case 'instagram':
      return '📷 Instagram';
    case 'marketplace':
      return '🛒 Marketplace';
    case 'contas':
      return '🔑 Criar Contas';
    case 'fornecedores':
      return '📦 Fornecedores';
    case 'estoque':
      return '📋 Conferir Estoque';
    case 'geral':
    default:
      return '📌 Geral';
  }
}

export function getChannelLabel(channel: SalesChannel): string {
  switch (channel) {
    case 'instagram':
      return 'Instagram';
    case 'mercado_livre':
      return 'Mercado Livre';
    case 'olx':
      return 'OLX';
    case 'whatsapp':
      return 'WhatsApp';
    case 'balcao':
      return 'Venda Presencial / Balcão';
    case 'loja_virtual':
      return 'Loja Virtual';
    case 'outro':
    default:
      return 'Outro Canal';
  }
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'pix':
      return 'Pix';
    case 'cartao_credito':
      return 'Cartão de Crédito';
    case 'cartao_debito':
      return 'Cartão de Débito';
    case 'dinheiro':
      return 'Dinheiro em Espécie';
    case 'transferencia':
      return 'Transferência Bancária';
    case 'outro':
    default:
      return 'Outro';
  }
}

export function getTransactionTypeLabel(type: TransactionType) {
  switch (type) {
    case 'venda':
      return { label: 'Venda de Produto', isPositive: true, color: 'text-emerald-600 dark:text-emerald-400' };
    case 'aporte_capital':
      return { label: 'Aporte de Capital', isPositive: true, color: 'text-blue-600 dark:text-blue-400' };
    case 'compra_estoque':
      return { label: 'Compra de Mercadoria', isPositive: false, color: 'text-amber-600 dark:text-amber-400' };
    case 'despesa_operacional':
      return { label: 'Despesa Operacional', isPositive: false, color: 'text-rose-600 dark:text-rose-400' };
    case 'retirada':
      return { label: 'Retirada / Pró-labore', isPositive: false, color: 'text-purple-600 dark:text-purple-400' };
    case 'reembolso_compra':
      return { label: 'Reembolso de Compra', isPositive: true, color: 'text-teal-600 dark:text-teal-400' };
  }
}
