-- Schema para sistema de caldinhos e sopas
-- São Miguel dos Campos, AL
-- Preços em centavos, estoque em mililitros

-- Categorias dos produtos
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    ordem_exibicao INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true
);

-- Produtos base (caldo de camarão, sopa de feijão, etc.)
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER REFERENCES categorias(id),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    disponivel BOOLEAN DEFAULT true,
    ordem_exibicao INTEGER DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Variações de tamanho e preço por produto
CREATE TABLE variacoes_produto (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    tamanho_ml INTEGER NOT NULL, -- 350, 500, 700, 900
    nome_tamanho VARCHAR(20) NOT NULL, -- "350ml", "700ml"
    preco_centavos INTEGER NOT NULL, -- 1700 = R$ 17,00
    ativo BOOLEAN DEFAULT true
);

-- Controle de estoque diário
CREATE TABLE estoque_diario (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    data_estoque DATE DEFAULT CURRENT_DATE,
    quantidade_inicial_ml INTEGER NOT NULL DEFAULT 0,
    quantidade_atual_ml INTEGER NOT NULL DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Garante um registro por produto por dia
    UNIQUE(produto_id, data_estoque)
);

-- Clientes (identificados por telefone)
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telefone VARCHAR(15) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultimo_pedido TIMESTAMP
);

-- Endereços dos clientes
CREATE TABLE enderecos_cliente (
    id SERIAL PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    rua VARCHAR(200) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    ponto_referencia TEXT,
    endereco_principal BOOLEAN DEFAULT false,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id),
    endereco_id INTEGER REFERENCES enderecos_cliente(id),
    
    -- Dados do pedido
    subtotal_centavos INTEGER NOT NULL,
    taxa_entrega_centavos INTEGER NOT NULL DEFAULT 0,
    total_centavos INTEGER NOT NULL,
    
    -- Forma de pagamento
    forma_pagamento VARCHAR(20) NOT NULL CHECK (forma_pagamento IN ('dinheiro', 'pix', 'cartao_credito', 'cartao_debito')),
    troco_para_centavos INTEGER, -- Se pagamento for dinheiro
    
    -- Status e controle
    status VARCHAR(20) DEFAULT 'recebido' CHECK (status IN ('recebido', 'preparando', 'saiu_entrega', 'entregue', 'cancelado')),
    observacoes TEXT,
    
    -- Datas
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_entrega TIMESTAMP,
    
    -- Dados do pagamento (se integrado)
    pagamento_id VARCHAR(100), -- ID do gateway de pagamento
    pagamento_status VARCHAR(20) DEFAULT 'pendente' CHECK (pagamento_status IN ('pendente', 'aprovado', 'rejeitado', 'cancelado'))
);

-- Itens do pedido
CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id),
    variacao_id INTEGER REFERENCES variacoes_produto(id),
    
    -- Dados do item no momento do pedido
    nome_produto VARCHAR(100) NOT NULL,
    tamanho_ml INTEGER NOT NULL,
    preco_unitario_centavos INTEGER NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    
    -- Subtotal do item
    subtotal_centavos INTEGER NOT NULL,
    
    observacoes TEXT
);

-- Acompanhamentos extras
CREATE TABLE acompanhamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    preco_centavos INTEGER NOT NULL,
    disponivel BOOLEAN DEFAULT true,
    ordem_exibicao INTEGER DEFAULT 0
);

-- Acompanhamentos selecionados nos itens
CREATE TABLE itens_acompanhamentos (
    id SERIAL PRIMARY KEY,
    item_pedido_id INTEGER REFERENCES itens_pedido(id) ON DELETE CASCADE,
    acompanhamento_id INTEGER REFERENCES acompanhamentos(id),
    nome_acompanhamento VARCHAR(50) NOT NULL,
    preco_centavos INTEGER NOT NULL,
    quantidade INTEGER DEFAULT 1
);

-- Configurações do sistema
CREATE TABLE configuracoes (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(50) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descricao TEXT,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserindo dados iniciais

-- Categorias
INSERT INTO categorias (nome, ordem_exibicao) VALUES 
    ('Caldos', 1),
    ('Sopas', 2),
    ('Canjas', 3),
    ('Acompanhamentos', 4);

-- Produtos
INSERT INTO produtos (categoria_id, nome, descricao, ordem_exibicao) VALUES 
    (1, 'Caldo de Frango', 'Caldo tradicional de frango', 1),
    (1, 'Caldo de Kenga', 'Caldo com frango, calabresa e bacon', 2),
    (1, 'Caldo de Camarão', 'Caldo cremoso de camarão', 3),
    (1, 'Caldo de Charque', 'Caldo saboroso de charque', 4),
    (2, 'Sopa de Feijão com Carne', 'Sopa nutritiva de feijão com carne', 1),
    (3, 'Canja de Galinha', 'Canja tradicional de galinha', 1);

-- Variações de produtos (preços em centavos)
INSERT INTO variacoes_produto (produto_id, tamanho_ml, nome_tamanho, preco_centavos) VALUES 
    -- Caldo de Frango
    (1, 350, '350ml', 1400),
    (1, 500, '500ml', 1700),
    -- Caldo de Kenga
    (2, 350, '350ml', 1500),
    (2, 500, '500ml', 1800),
    -- Caldo de Camarão
    (3, 350, '350ml', 1700),
    (3, 500, '500ml', 2000),
    -- Caldo de Charque
    (4, 350, '350ml', 1700),
    (4, 500, '500ml', 2000),
    -- Sopa de Feijão com Carne
    (5, 700, '700ml', 1600),
    (5, 900, '900ml', 2000),
    -- Canja de Galinha
    (6, 700, '700ml', 1400),
    (6, 900, '900ml', 1800);

-- Acompanhamentos (preços fictícios)
INSERT INTO acompanhamentos (nome, preco_centavos, ordem_exibicao) VALUES 
    ('Torresmo', 300, 1),
    ('Ovo de Codorna', 150, 2),
    ('Queijo Coalho', 400, 3),
    ('Pão Francês', 200, 4);

-- Configurações iniciais
INSERT INTO configuracoes (chave, valor, descricao) VALUES 
    ('loja_aberta', 'false', 'Define se a loja está aberta para pedidos'),
    ('taxa_entrega_centavos', '300', 'Taxa de entrega em centavos (R$ 3,00)'),
    ('telefone_contato', '82999999999', 'Telefone para contato'),
    ('endereco_loja', 'São Miguel dos Campos, AL', 'Endereço da loja'),
    ('tempo_preparo_minutos', '30', 'Tempo estimado de preparo'),
    ('asaas_api_key', '', 'Chave da API do ASAAS para pagamentos');

-- Índices para performance
CREATE INDEX idx_estoque_produto_data ON estoque_diario(produto_id, data_estoque);
CREATE INDEX idx_clientes_telefone ON clientes(telefone);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_data ON pedidos(data_pedido);
CREATE INDEX idx_itens_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_variacoes_produto ON variacoes_produto(produto_id);

-- Triggers para atualizar estoque automaticamente
CREATE OR REPLACE FUNCTION atualizar_estoque_pedido() 
RETURNS TRIGGER AS $$
BEGIN
    -- Quando um item é adicionado ao pedido, desconta do estoque
    IF TG_OP = 'INSERT' THEN
        UPDATE estoque_diario 
        SET quantidade_atual_ml = quantidade_atual_ml - (NEW.tamanho_ml * NEW.quantidade),
            data_atualizacao = CURRENT_TIMESTAMP
        WHERE produto_id = NEW.produto_id 
        AND data_estoque = CURRENT_DATE;
        
        RETURN NEW;
    END IF;
    
    -- Se o pedido for cancelado, retorna o estoque
    IF TG_OP = 'DELETE' THEN
        UPDATE estoque_diario 
        SET quantidade_atual_ml = quantidade_atual_ml + (OLD.tamanho_ml * OLD.quantidade),
            data_atualizacao = CURRENT_TIMESTAMP
        WHERE produto_id = OLD.produto_id 
        AND data_estoque = CURRENT_DATE;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar estoque quando item é adicionado
CREATE TRIGGER trigger_atualizar_estoque
    AFTER INSERT OR DELETE ON itens_pedido
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_estoque_pedido();

-- Função para verificar se tem estoque disponível
CREATE OR REPLACE FUNCTION verificar_estoque(produto_id_param INTEGER, quantidade_ml_param INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    estoque_atual INTEGER;
BEGIN
    SELECT quantidade_atual_ml INTO estoque_atual
    FROM estoque_diario
    WHERE produto_id = produto_id_param 
    AND data_estoque = CURRENT_DATE;
    
    RETURN COALESCE(estoque_atual, 0) >= quantidade_ml_param;
END;
$$ LANGUAGE plpgsql;