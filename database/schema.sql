-- ============================================================
-- SUBLIME INTELLIGENCE — Schema PostgreSQL
-- Gestão Financeira para Marcenaria / Angola
-- ============================================================

-- Empresas
CREATE TABLE IF NOT EXISTS empresas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cidade VARCHAR(100),
  pais VARCHAR(100) DEFAULT 'Angola',
  exercicio INT DEFAULT EXTRACT(YEAR FROM NOW()),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Categorias de Receita
CREATE TABLE IF NOT EXISTS categorias_receita (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  icone VARCHAR(10),
  ativo BOOLEAN DEFAULT true
);

-- Categorias de Custo
CREATE TABLE IF NOT EXISTS categorias_custo (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  icone VARCHAR(10),
  tipo VARCHAR(20) DEFAULT 'OPEX', -- CMV ou OPEX
  ativo BOOLEAN DEFAULT true
);

-- Entradas (Receitas mensais)
CREATE TABLE IF NOT EXISTS entradas (
  id SERIAL PRIMARY KEY,
  empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
  categoria_id INT REFERENCES categorias_receita(id),
  ano INT NOT NULL,
  mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
  valor DECIMAL(15,2) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  UNIQUE(empresa_id, categoria_id, ano, mes)
);

-- Saídas (Custos mensais)
CREATE TABLE IF NOT EXISTS saidas (
  id SERIAL PRIMARY KEY,
  empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
  categoria_id INT REFERENCES categorias_custo(id),
  ano INT NOT NULL,
  mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
  valor DECIMAL(15,2) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  UNIQUE(empresa_id, categoria_id, ano, mes)
);

-- Faturas
CREATE TABLE IF NOT EXISTS faturas (
  id SERIAL PRIMARY KEY,
  empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
  data_fatura DATE NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  numero_fatura VARCHAR(50),
  descricao TEXT,
  valor_base DECIMAL(15,2) NOT NULL DEFAULT 0,
  iva_percentagem DECIMAL(5,2) DEFAULT 14,
  iva_valor DECIMAL(15,2) GENERATED ALWAYS AS (valor_base * iva_percentagem / 100) STORED,
  valor_total DECIMAL(15,2) GENERATED ALWAYS AS (valor_base + valor_base * iva_percentagem / 100) STORED,
  pago DECIMAL(15,2) DEFAULT 0,
  pendente DECIMAL(15,2) GENERATED ALWAYS AS (valor_base + valor_base * iva_percentagem / 100 - pago) STORED,
  status VARCHAR(20) DEFAULT 'pendente',
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Metas anuais
CREATE TABLE IF NOT EXISTS metas (
  id SERIAL PRIMARY KEY,
  empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
  ano INT NOT NULL,
  meta_receita DECIMAL(15,2),
  UNIQUE(empresa_id, ano)
);

-- ============================================================
-- DADOS INICIAIS — Silva Moveleira (baseados no Excel)
-- ============================================================

INSERT INTO empresas (nome, cidade, pais, exercicio)
VALUES ('Silva Moveleira', 'Luanda', 'Angola', 2025)
ON CONFLICT DO NOTHING;

-- Categorias de Receita
INSERT INTO categorias_receita (nome, icone) VALUES
  ('Móveis para Sala', '🛋️'),
  ('Cozinhas Planejadas', '🍳'),
  ('Closets e Roupeiros', '👗'),
  ('Móveis para Quarto', '🛏️'),
  ('Móveis Corporativos', '🏢'),
  ('Portas e Divisórias', '🚪'),
  ('Reparações e Manutenção', '🔧'),
  ('Consultoria / Design', '📐'),
  ('Personalização/Acabamentos', '🎨'),
  ('Taxa de Transporte/Montagem', '🚚'),
  ('Outros Serviços', '📦'),
  ('Projectos Grandes (Obra)', '🏗️'),
  ('Decoração e Arte', '🖼️'),
  ('Móveis de Jardim/Exterior', '🪑'),
  ('Móveis de Casa de Banho', '🛁'),
  ('Montras e Expositores', '🏬'),
  ('Móveis para Escritório', '📺'),
  ('Adegas / Bar Personalizados', '🍷'),
  ('Estantes e Bibliotecas', '📚'),
  ('Quarto Infantil', '🧸'),
  ('Venda de Acessórios/Peças', '🔩'),
  ('Serviço Pós-Venda', '🛎️'),
  ('Orçamentos Aprovados', '📋'),
  ('Parcerias Comerciais', '💼'),
  ('Projectos Premium', '🏆'),
  ('Exportação / Encomendas', '🌍'),
  ('Remodelações Completas', '🏠')
ON CONFLICT DO NOTHING;

-- Categorias de Custo
INSERT INTO categorias_custo (nome, icone, tipo) VALUES
  ('Compra de Mercadoria/Mat.Prima', '🪵', 'CMV'),
  ('Salários e Encargos Sociais', '👷', 'OPEX'),
  ('Electricidade', '⚡', 'OPEX'),
  ('Combustíveis', '⛽', 'OPEX'),
  ('Manutenção e Reparação', '🔧', 'OPEX'),
  ('Renda / Aluguer', '🏠', 'OPEX'),
  ('Cursos e Formação', '📚', 'OPEX'),
  ('Marketing e Publicidade', '📣', 'OPEX'),
  ('Design de Interiores', '🎨', 'OPEX'),
  ('Transporte', '🚚', 'OPEX'),
  ('Hospedagem', '🏨', 'OPEX'),
  ('Impostos e Taxas', '🏛️', 'OPEX'),
  ('Seguros', '🛡️', 'OPEX'),
  ('Comunicação (Internet/Tel.)', '📱', 'OPEX'),
  ('Outros Custos', '📦', 'OPEX'),
  ('Alimentação', '🍽️', 'OPEX'),
  ('Gasosa / Micha', '🥤', 'OPEX'),
  ('Multas de Trânsito', '🚦', 'OPEX'),
  ('Saúde / Medicina Trabalho', '💊', 'OPEX'),
  ('Consumíveis Escritório', '🖨️', 'OPEX'),
  ('Equipamentos e Ferramentas', '🔌', 'OPEX'),
  ('Software / Licenças', '💻', 'OPEX'),
  ('Subcontratação de Serviços', '🏗️', 'OPEX'),
  ('Ofertas / Brindes Clientes', '🎁', 'OPEX'),
  ('Contabilidade / Auditoria', '📊', 'OPEX'),
  ('Encargos Bancários', '🏦', 'OPEX'),
  ('Amortização de Viaturas', '🚗', 'OPEX')
ON CONFLICT DO NOTHING;
