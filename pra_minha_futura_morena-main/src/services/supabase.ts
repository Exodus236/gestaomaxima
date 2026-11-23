import { createClient } from '@supabase/supabase-js';
import { Product, Sale, FinancialTransaction, StoreTask } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rwpkewcudhettryafbzp.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_CFmR3go6rYYbZ0AdngwvGw_XoZr_McR';

export const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// MAPPERS: CamelCase (JS) <-> SnakeCase (DB)
// ==========================================

export function mapProductFromDb(row: any): Product {
  return {
    id: row.id,
    userId: row.user_id,
    kind: row.kind || 'produto',
    name: row.name,
    category: row.category,
    photoUrl: row.photo_url || '',
    costPrice: Number(row.cost_price || 0),
    salePrice: Number(row.sale_price || 0),
    minPrice: Number(row.min_price || 0),
    quantity: Number(row.quantity || 0),
    status: row.status,
    warrantyDays: row.warranty_days ? Number(row.warranty_days) : 90,
    description: row.description || '',
    supplier: row.supplier || '',
    priceHistory: Array.isArray(row.price_history) ? row.price_history : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapProductToDb(p: Product, currentUserId?: string): any {
  return {
    id: p.id,
    user_id: p.userId || currentUserId || null,
    kind: p.kind || 'produto',
    name: p.name,
    category: p.category,
    photo_url: p.photoUrl,
    cost_price: p.costPrice,
    sale_price: p.salePrice,
    min_price: p.minPrice,
    quantity: p.quantity,
    status: p.status,
    warranty_days: p.warrantyDays || 90,
    description: p.description,
    supplier: p.supplier,
    price_history: p.priceHistory || [],
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

export function mapSaleFromDb(row: any): Sale {
  return {
    id: row.id,
    userId: row.user_id,
    itemKind: row.item_kind || 'produto',
    code: row.code,
    productId: row.product_id,
    productName: row.product_name,
    productPhoto: row.product_photo || '',
    quantity: Number(row.quantity || 1),
    unitCostPrice: Number(row.unit_cost_price || 0),
    unitSalePrice: Number(row.unit_sale_price || 0),
    unitFinalPrice: Number(row.unit_final_price || 0),
    totalCost: Number(row.total_cost || 0),
    totalReceived: Number(row.total_received || 0),
    feeAmount: Number(row.fee_amount || 0),
    netReceived: Number(row.net_received || 0),
    grossProfit: Number(row.gross_profit || 0),
    netProfit: Number(row.net_profit || 0),
    profitMarginPct: Number(row.profit_margin_pct || 0),
    paymentMethod: row.payment_method,
    channel: row.channel,
    paymentStatus: row.payment_status || 'pago',
    amountPaid: Number(row.amount_paid || 0),
    amountPending: Number(row.amount_pending || 0),
    customerName: row.customer_name || '',
    customerPhone: row.customer_phone || '',
    afterSaleStatus: row.after_sale_status || 'open',
    followUpDate: row.follow_up_date || undefined,
    afterSaleNotes: row.after_sale_notes || undefined,
    warrantyDays: row.warranty_days ? Number(row.warranty_days) : 90,
    notes: row.notes || '',
    soldAt: row.sold_at,
  };
}

export function mapSaleToDb(s: Sale, currentUserId?: string): any {
  return {
    id: s.id,
    user_id: s.userId || currentUserId || null,
    item_kind: s.itemKind || 'produto',
    code: s.code,
    product_id: s.productId,
    product_name: s.productName,
    product_photo: s.productPhoto,
    quantity: s.quantity,
    unit_cost_price: s.unitCostPrice,
    unit_sale_price: s.unitSalePrice,
    unit_final_price: s.unitFinalPrice,
    total_cost: s.totalCost,
    total_received: s.totalReceived,
    fee_amount: s.feeAmount,
    net_received: s.netReceived,
    gross_profit: s.grossProfit,
    net_profit: s.netProfit,
    profit_margin_pct: s.profitMarginPct,
    payment_method: s.paymentMethod,
    channel: s.channel,
    payment_status: s.paymentStatus,
    amount_paid: s.amountPaid,
    amount_pending: s.amountPending,
    customer_name: s.customerName,
    customer_phone: s.customerPhone,
    after_sale_status: s.afterSaleStatus || 'open',
    follow_up_date: s.followUpDate || null,
    after_sale_notes: s.afterSaleNotes || null,
    warranty_days: s.warrantyDays || 90,
    notes: s.notes,
    sold_at: s.soldAt,
  };
}

export function mapTransactionFromDb(row: any): FinancialTransaction {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    amount: Number(row.amount || 0),
    description: row.description,
    category: row.category || '',
    relatedSaleId: row.related_sale_id,
    relatedProductId: row.related_product_id,
    date: row.date,
  };
}

export function mapTransactionToDb(t: FinancialTransaction, currentUserId?: string): any {
  return {
    id: t.id,
    user_id: t.userId || currentUserId || null,
    type: t.type,
    amount: t.amount,
    description: t.description,
    category: t.category,
    related_sale_id: t.relatedSaleId || null,
    related_product_id: t.relatedProductId || null,
    date: t.date,
  };
}

export function mapTaskFromDb(row: any): StoreTask {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    category: row.category,
    priority: row.priority,
    completed: Boolean(row.completed),
    dismissed: Boolean(row.dismissed),
    dueDate: row.due_date || undefined,
    relatedProductId: row.related_product_id || undefined,
    notes: row.notes || undefined,
    createdAt: row.created_at,
    completedAt: row.completed_at || undefined,
  };
}

export function mapTaskToDb(t: StoreTask, currentUserId?: string): any {
  return {
    id: t.id,
    user_id: t.userId || currentUserId || null,
    title: t.title,
    category: t.category,
    priority: t.priority,
    completed: t.completed,
    dismissed: t.dismissed || false,
    due_date: t.dueDate || null,
    related_product_id: t.relatedProductId || null,
    notes: t.notes || null,
    created_at: t.createdAt,
    completed_at: t.completedAt || null,
  };
}

// ==========================================
// OPERAÇÕES COMPLETAS COM O SUPABASE (ISOLADAS POR USUÁRIO)
// ==========================================

export async function fetchAllSupabaseData(userId?: string): Promise<{
  success: boolean;
  products?: Product[];
  sales?: Sale[];
  transactions?: FinancialTransaction[];
  tasks?: StoreTask[];
  capital?: number;
  pixKey?: string;
  storeName?: string;
  error?: string;
  needsSchemaUpdate?: boolean;
}> {
  try {
    let prodQuery = supabase.from('products').select('*').order('created_at', { ascending: false });
    let saleQuery = supabase.from('sales').select('*').order('sold_at', { ascending: false });
    let txQuery = supabase.from('financial_transactions').select('*').order('date', { ascending: false });
    let taskQuery = supabase.from('store_tasks').select('*').order('created_at', { ascending: false });
    let settingQuery = supabase.from('store_settings').select('*');

    // Se houver userId, isola a busca estritamente para os dados desse usuário
    if (userId) {
      prodQuery = prodQuery.eq('user_id', userId);
      saleQuery = saleQuery.eq('user_id', userId);
      txQuery = txQuery.eq('user_id', userId);
      taskQuery = taskQuery.eq('user_id', userId);
      settingQuery = settingQuery.eq('user_id', userId);
    } else {
      settingQuery = settingQuery.eq('id', 'primary_store');
    }

    const [prodRes, saleRes, txRes, taskRes, settingRes] = await Promise.all([
      prodQuery,
      saleQuery,
      txQuery,
      taskQuery,
      settingQuery.maybeSingle(),
    ]);

    // Se a coluna user_id não existe no banco (usuário ainda não rodou o script SQL),
    // faz o fallback automático para buscar os registros globais da loja sem o filtro user_id
    if (prodRes.error && (prodRes.error.code === '42703' || prodRes.error.message?.includes('user_id'))) {
      const [pFallback, sFallback, tFallback, tkFallback, stFallback] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('sales').select('*').order('sold_at', { ascending: false }),
        supabase.from('financial_transactions').select('*').order('date', { ascending: false }),
        supabase.from('store_tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('store_settings').select('*').eq('id', 'primary_store').maybeSingle(),
      ]);

      if (pFallback.error) throw pFallback.error;

      return {
        success: true,
        products: (pFallback.data || []).map(mapProductFromDb),
        sales: (sFallback.data || []).map(mapSaleFromDb),
        transactions: (tFallback.data || []).map(mapTransactionFromDb),
        tasks: (tkFallback.data || []).map(mapTaskFromDb),
        capital: stFallback.data?.capital_balance !== undefined ? Number(stFallback.data.capital_balance) : undefined,
        pixKey: stFallback.data?.pix_key || undefined,
        storeName: stFallback.data?.store_name || undefined,
      };
    }

    if (prodRes.error) throw prodRes.error;

    return {
      success: true,
      products: (prodRes.data || []).map(mapProductFromDb),
      sales: (saleRes.data || []).map(mapSaleFromDb),
      transactions: (txRes.data || []).map(mapTransactionFromDb),
      tasks: (taskRes.data || []).map(mapTaskFromDb),
      capital: settingRes.data?.capital_balance !== undefined ? Number(settingRes.data.capital_balance) : undefined,
      pixKey: settingRes.data?.pix_key || undefined,
      storeName: settingRes.data?.store_name || undefined,
    };
  } catch (err: any) {
    console.error('Erro ao buscar dados do Supabase:', err);
    return { success: false, error: err.message || 'Erro de conexão' };
  }
}

export async function syncProductToSupabase(product: Product, userId?: string) {
  try {
    const payload = mapProductToDb(product, userId);
    const { error } = await supabase.from('products').upsert(payload);
    if (error) {
      // Se user_id não existe no banco, faz fallback para salvar sem user_id e não perder dados
      if (error.message?.includes('user_id') || error.code === 'PGRST204' || error.code === '42703') {
        const fallback = { ...payload };
        delete fallback.user_id;
        await supabase.from('products').upsert(fallback);
      } else {
        console.error('Erro ao sincronizar produto com Supabase:', error);
      }
    }
  } catch (err) {
    console.error('Erro ao sincronizar produto com Supabase:', err);
  }
}

export async function deleteProductFromSupabase(id: string) {
  try {
    await supabase.from('products').delete().eq('id', id);
  } catch (err) {
    console.error('Erro ao excluir produto do Supabase:', err);
  }
}

export async function syncSaleToSupabase(sale: Sale, userId?: string) {
  try {
    const payload = mapSaleToDb(sale, userId);
    const { error } = await supabase.from('sales').upsert(payload);
    if (error) {
      if (error.message?.includes('user_id') || error.code === 'PGRST204' || error.code === '42703') {
        const fallback = { ...payload };
        delete fallback.user_id;
        await supabase.from('sales').upsert(fallback);
      } else {
        console.error('Erro ao sincronizar venda com Supabase:', error);
      }
    }
  } catch (err) {
    console.error('Erro ao sincronizar venda com Supabase:', err);
  }
}

export async function deleteSaleFromSupabase(id: string) {
  try {
    await supabase.from('sales').delete().eq('id', id);
  } catch (err) {
    console.error('Erro ao excluir venda do Supabase:', err);
  }
}

export async function syncTransactionToSupabase(tx: FinancialTransaction, userId?: string) {
  try {
    const payload = mapTransactionToDb(tx, userId);
    const { error } = await supabase.from('financial_transactions').upsert(payload);
    if (error) {
      if (error.message?.includes('user_id') || error.code === 'PGRST204' || error.code === '42703') {
        const fallback = { ...payload };
        delete fallback.user_id;
        await supabase.from('financial_transactions').upsert(fallback);
      } else {
        console.error('Erro ao sincronizar transação com Supabase:', error);
      }
    }
  } catch (err) {
    console.error('Erro ao sincronizar transação com Supabase:', err);
  }
}

export async function syncTaskToSupabase(task: StoreTask, userId?: string) {
  try {
    const payload = mapTaskToDb(task, userId);
    const { error } = await supabase.from('store_tasks').upsert(payload);
    if (error) {
      if (error.message?.includes('user_id') || error.code === 'PGRST204' || error.code === '42703') {
        const fallback = { ...payload };
        delete fallback.user_id;
        await supabase.from('store_tasks').upsert(fallback);
      } else {
        console.error('Erro ao sincronizar tarefa com Supabase:', error);
      }
    }
  } catch (err) {
    console.error('Erro ao sincronizar tarefa com Supabase:', err);
  }
}

export async function deleteTaskFromSupabase(id: string) {
  try {
    await supabase.from('store_tasks').delete().eq('id', id);
  } catch (err) {
    console.error('Erro ao excluir tarefa do Supabase:', err);
  }
}

export async function syncSettingsToSupabase(capital: number, pixKey: string, userId?: string, nickname?: string) {
  try {
    const settingId = userId ? `store_${userId}` : 'primary_store';
    const storeName = nickname?.trim() || 'RL Market';
    const payload = {
      id: settingId,
      user_id: userId || null,
      store_name: storeName,
      pix_key: pixKey,
      capital_balance: capital,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('store_settings').upsert(payload);
    if (error) {
      if (error.message?.includes('user_id') || error.code === 'PGRST204' || error.code === '42703') {
        await supabase.from('store_settings').upsert({
          id: 'primary_store',
          store_name: storeName,
          pix_key: pixKey,
          capital_balance: capital,
          updated_at: new Date().toISOString(),
        });
      } else {
        console.error('Erro ao sincronizar configurações com Supabase:', error);
      }
    }
  } catch (err) {
    console.error('Erro ao sincronizar configurações com Supabase:', err);
  }
}
