-- ==============================================================================
-- RL MARKET — ESQUEMA DE BANCO DE DADOS SUPABASE (MULTI-USUÁRIO / MULTI-TENANT)
-- 
-- Cada usuário/lojista possui seus próprios produtos, vendas, tarefas e caixa.
-- Nenhuma conta vê ou altera os dados de outro lojista.
--
-- ⚠️ Execute este script no SQL Editor do seu projeto Supabase:
-- Certifique-se de NÃO deixar nenhuma linha grifada antes de clicar em "RUN".
-- ==============================================================================

SET search_path TO public;

-- 1. TABELA DE PRODUTOS E ESTOQUE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Geral',
    photo_url TEXT,
    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    min_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    quantity INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'disponivel',
    warranty_days INTEGER DEFAULT 90,
    description TEXT,
    supplier TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir coluna user_id caso a tabela já tenha sido criada antes
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

-- 2. TABELA DE VENDAS
CREATE TABLE IF NOT EXISTS public.sales (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    code TEXT NOT NULL,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_photo TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    unit_sale_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    unit_final_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_received NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    net_received NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    gross_profit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    net_profit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    profit_margin_pct NUMERIC(5, 2) DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'pix',
    channel TEXT NOT NULL DEFAULT 'olx',
    payment_status TEXT NOT NULL DEFAULT 'pago',
    amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    amount_pending NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    customer_name TEXT,
    customer_phone TEXT,
    warranty_days INTEGER DEFAULT 90,
    notes TEXT,
    sold_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

-- 3. TABELA DE MOVIMENTAÇÕES FINANCEIRAS (LIVRO CAIXA)
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    type TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    related_sale_id TEXT REFERENCES public.sales(id) ON DELETE SET NULL,
    related_product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    date TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

-- 4. TABELA DE TAREFAS E CHECKLIST DA LOJA
CREATE TABLE IF NOT EXISTS public.store_tasks (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'geral',
    priority TEXT NOT NULL DEFAULT 'media',
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    due_date TIMESTAMPTZ,
    related_product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

ALTER TABLE public.store_tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

-- 5. TABELA DE CONFIGURAÇÕES GERAIS DA LOJA
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    store_name TEXT NOT NULL DEFAULT 'RL Market',
    pix_key TEXT DEFAULT '',
    capital_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

-- ==============================================================================
-- LIMPAR DADOS GENÉRICOS ANTIGOS DE TESTE QUE NÃO POSSUEM DONO (user_id IS NULL)
-- ==============================================================================
DELETE FROM public.sales WHERE user_id IS NULL;
DELETE FROM public.products WHERE user_id IS NULL;
DELETE FROM public.financial_transactions WHERE user_id IS NULL;
DELETE FROM public.store_tasks WHERE user_id IS NULL;
DELETE FROM public.store_settings WHERE user_id IS NULL;

-- ==============================================================================
-- ÍNDICES PARA ALTA PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_user ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_user ON public.sales(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.financial_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON public.store_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_settings_user ON public.store_settings(user_id);

-- ==============================================================================
-- SEGURANÇA E POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- Cada usuário autenticado só pode ver, inserir, alterar e excluir seus PRÓPRIOS dados.
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura pública" ON public.products;
DROP POLICY IF EXISTS "Permitir escrita pública" ON public.products;
DROP POLICY IF EXISTS "Permitir leitura de vendas" ON public.sales;
DROP POLICY IF EXISTS "Permitir escrita de vendas" ON public.sales;
DROP POLICY IF EXISTS "Permitir leitura de finanças" ON public.financial_transactions;
DROP POLICY IF EXISTS "Permitir escrita de finanças" ON public.financial_transactions;
DROP POLICY IF EXISTS "Permitir leitura de tarefas" ON public.store_tasks;
DROP POLICY IF EXISTS "Permitir escrita de tarefas" ON public.store_tasks;
DROP POLICY IF EXISTS "Permitir leitura de configurações" ON public.store_settings;
DROP POLICY IF EXISTS "Permitir escrita de configurações" ON public.store_settings;

DROP POLICY IF EXISTS "Usuário gerencia seus produtos" ON public.products;
DROP POLICY IF EXISTS "Usuário gerencia suas vendas" ON public.sales;
DROP POLICY IF EXISTS "Usuário gerencia suas finanças" ON public.financial_transactions;
DROP POLICY IF EXISTS "Usuário gerencia suas tarefas" ON public.store_tasks;
DROP POLICY IF EXISTS "Usuário gerencia suas configurações" ON public.store_settings;

CREATE POLICY "Usuário gerencia seus produtos" ON public.products
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário gerencia suas vendas" ON public.sales
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário gerencia suas finanças" ON public.financial_transactions
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário gerencia suas tarefas" ON public.store_tasks
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário gerencia suas configurações" ON public.store_settings
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
