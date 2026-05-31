-- Schema JR Agente — Supabase
-- Execute este arquivo no SQL Editor do Supabase

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'aberto',
  total NUMERIC(10,2) DEFAULT 0,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  finalizado_em TIMESTAMPTZ
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto TEXT NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  preco NUMERIC(10,2) NOT NULL DEFAULT 0,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de produtos consultados (cache de buscas)
CREATE TABLE IF NOT EXISTS produtos_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  termo TEXT NOT NULL,
  resultado JSONB,
  consultado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_itens_pedido_id ON itens_pedido(pedido_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos_cache ENABLE ROW LEVEL SECURITY;

-- Políticas: service_role tem acesso total (usado pela API)
CREATE POLICY "service_role_pedidos" ON pedidos
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_itens" ON itens_pedido
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_cache" ON produtos_cache
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Política anon para leitura (para o agente)
CREATE POLICY "anon_read_pedidos" ON pedidos
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_itens" ON itens_pedido
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_cache" ON produtos_cache
  FOR ALL TO anon USING (true) WITH CHECK (true);
