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
    imagem_url TEXT,
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
    cpf VARCHAR(11) UNIQUE,
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
    cep VARCHAR(10) NOT NULL,
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
    forma_pagamento VARCHAR(20) NOT NULL CHECK (forma_pagamento IN ('DINHEIRO', 'PIX', 'CREDIT_CARD')),
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
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- Tabela de pagamentos
CREATE TABLE pagamentos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    
    -- Dados da ASAAS
    asaas_payment_id VARCHAR(100) UNIQUE,
    asaas_customer_id VARCHAR(100), -- ID do cliente na ASAAS
    
    -- Dados do pagamento
    tipo_pagamento VARCHAR(20) NOT NULL CHECK (tipo_pagamento IN ('PIX', 'DINHEIRO', 'CREDIT_CARD')),
    valor_centavos INTEGER NOT NULL,
    
    -- Status do pagamento
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'cancelado', 'expirado')),
    
    -- Dados específicos do PIX
    pix_qr_code_imagem TEXT, -- Base64 da imagem
    pix_copia_e_cola TEXT, -- String PIX para copiar
    
    -- Controle de datas
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP,
    data_expiracao TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Dados extras
    observacoes TEXT,
    webhook_processado BOOLEAN DEFAULT false
);

CREATE INDEX idx_pagamentos_pedido ON pagamentos(pedido_id);
CREATE INDEX idx_pagamentos_asaas_id ON pagamentos(asaas_payment_id);
CREATE INDEX idx_pagamentos_status ON pagamentos(status);
CREATE INDEX idx_pagamentos_tipo ON pagamentos(tipo_pagamento);
CREATE INDEX idx_pagamentos_data_criacao ON pagamentos(data_criacao);

-- Inserindo dados iniciais

-- Categorias
INSERT INTO categorias (nome, ordem_exibicao) VALUES 
    ('Caldos', 1),
    ('Sopas', 2),
    ('Canjas', 3),
    ('Acompanhamentos', 4);

-- Produtos
INSERT INTO produtos (categoria_id, nome, descricao, ordem_exibicao, imagem_url) VALUES 
    (1, 'Caldo de Frango', 'Caldo tradicional de frango', 1, '/images/caldos/caldo-de-galinha.png'),
    (1, 'Caldo de Kenga', 'Caldo com frango, calabresa e bacon', 2, '/images/caldos/caldo-de-kenga.png'),
    (1, 'Caldo de Camarão', 'Caldo cremoso de camarão', 3, '/images/caldos/caldo-de-charque.jpeg'),
    (1, 'Caldo de Charque', 'Caldo saboroso de charque', 4, '/images/caldos/caldo-de-feijao.png'),
    (2, 'Sopa de Feijão com Carne', 'Sopa nutritiva de feijão com carne', 1, '/images/sopas/sopa-de-feijao-com-carne.png'),
    (3, 'Canja de Galinha', 'Canja tradicional de galinha', 1, '/images/canjas/canja-de-galinha.png');

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

-- INSERT na tabela pedidos com os IDs fornecidos
-- ========================================
-- INSERINDO DADOS DE TESTE COMPLETOS
-- ========================================

-- 1. Inserir cliente de teste
INSERT INTO clientes (
    id,
    telefone,
    nome,
    cpf,
    data_criacao
) VALUES (
    '6b0aa2c2-d561-4837-a696-eca127ab3e95',
    '82999999999',
    'João Silva Santos',
    '12345678901',
    CURRENT_TIMESTAMP
);

-- 2. Inserir endereço do cliente
INSERT INTO enderecos_cliente (
    id,
    cliente_id,
    rua,
    numero,
    complemento,
    bairro,
    ponto_referencia,
    endereco_principal,
    cep,
    data_criacao
) VALUES (
    1,
    '6b0aa2c2-d561-4837-a696-eca127ab3e95',
    'Rua das Flores',
    '123',
    'Apt 101',
    'Centro',
    'Próximo ao mercado São Jorge',
    true,
    '57240000',
    CURRENT_TIMESTAMP
);

-- ========================================
-- INSERINDO PEDIDOS DE TESTE
-- ========================================
-- 3. PEDIDO 1 - PIX
INSERT INTO pedidos (
    cliente_id,
    endereco_id,
    subtotal_centavos,
    taxa_entrega_centavos,
    total_centavos,
    forma_pagamento,
    troco_para_centavos,
    status,
    observacoes,
    data_pedido,
    pagamento_status
) VALUES (
    '6b0aa2c2-d561-4837-a696-eca127ab3e95',  -- cliente_id
    1,                                        -- endereco_id
    3400,                                     -- subtotal_centavos (R$ 34,00)
    300,                                      -- taxa_entrega_centavos (R$ 3,00)
    3700,                                     -- total_centavos (R$ 37,00)
    'pix',                                    -- forma_pagamento
    NULL,                                     -- troco_para_centavos (só para dinheiro)
    'recebido',                               -- status
    'Caldo bem quente, por favor',            -- observacoes
    CURRENT_TIMESTAMP,                        -- data_pedido
    'pendente'                                -- pagamento_status
);

-- 4. PEDIDO 2 - DINHEIRO (com troco)
INSERT INTO pedidos (
    cliente_id,
    endereco_id,
    subtotal_centavos,
    taxa_entrega_centavos,
    total_centavos,
    forma_pagamento,
    troco_para_centavos,
    status,
    observacoes,
    pagamento_status
) VALUES (
    '6b0aa2c2-d561-4837-a696-eca127ab3e95',
    1,
    3400,     -- R$ 34,00
    300,      -- R$ 3,00  
    3700,     -- R$ 37,00
    'dinheiro',
    5000,     -- Troco para R$ 50,00
    'recebido',
    'Cliente vai pagar com R$ 50,00',
    'pendente'
);

-- 5. PEDIDO 3 - CARTÃO DE CRÉDITO
INSERT INTO pedidos (
    cliente_id,
    endereco_id,
    subtotal_centavos,
    taxa_entrega_centavos,
    total_centavos,
    forma_pagamento,
    status,
    observacoes,
    pagamento_id,
    pagamento_status
) VALUES (
    '6b0aa2c2-d561-4837-a696-eca127ab3e95',
    1,
    3400,
    300,
    3700,
    'cartao_credito',
    'recebido',
    'Pagamento no cartão de crédito',
    'asaas_pay_123456789',  -- ID do gateway
    'aprovado'              -- Já aprovado pelo gateway
);

-- ========================================
-- INSERINDO ITENS DOS PEDIDOS
-- ========================================

-- Itens do PEDIDO 1 (PIX) - 2x Caldo de Kenga 500ml
INSERT INTO itens_pedido (
    pedido_id,
    produto_id,
    variacao_id,
    nome_produto,
    tamanho_ml,
    preco_unitario_centavos,
    quantidade,
    subtotal_centavos,
    observacoes
) VALUES (
    (SELECT id FROM pedidos WHERE cliente_id = '6b0aa2c2-d561-4837-a696-eca127ab3e95' AND forma_pagamento = 'pix' LIMIT 1),
    2,  -- Caldo de Kenga
    4,  -- Variação 500ml 
    'Caldo de Kenga',
    500,
    1700,  -- R$ 17,00
    2,     -- quantidade
    3400,  -- 2 x R$ 17,00
    'Bem temperado'
);

-- Itens do PEDIDO 2 (DINHEIRO) - 1x Caldo de Camarão 500ml + 1x Caldo de Frango 500ml  
INSERT INTO itens_pedido (
    pedido_id,
    produto_id,
    variacao_id,
    nome_produto,
    tamanho_ml,
    preco_unitario_centavos,
    quantidade,
    subtotal_centavos
) VALUES 
-- Caldo de Camarão
(
    (SELECT id FROM pedidos WHERE cliente_id = '6b0aa2c2-d561-4837-a696-eca127ab3e95' AND forma_pagamento = 'dinheiro' LIMIT 1),
    3,  -- Caldo de Camarão
    6,  -- Variação 500ml
    'Caldo de Camarão',
    500,
    2000,  -- R$ 20,00
    1,
    2000
),
-- Caldo de Frango  
(
    (SELECT id FROM pedidos WHERE cliente_id = '6b0aa2c2-d561-4837-a696-eca127ab3e95' AND forma_pagamento = 'dinheiro' LIMIT 1),
    1,  -- Caldo de Frango
    2,  -- Variação 500ml
    'Caldo de Frango',
    500,
    1400,  -- R$ 14,00
    1,
    1400
);

-- Itens do PEDIDO 3 (CARTÃO) - 2x Caldo de Kenga 500ml
INSERT INTO itens_pedido (
    pedido_id,
    produto_id,
    variacao_id,
    nome_produto,
    tamanho_ml,
    preco_unitario_centavos,
    quantidade,
    subtotal_centavos
) VALUES (
    (SELECT id FROM pedidos WHERE cliente_id = '6b0aa2c2-d561-4837-a696-eca127ab3e95' AND forma_pagamento = 'cartao_credito' LIMIT 1),
    2,  -- Caldo de Kenga
    4,  -- Variação 500ml
    'Caldo de Kenga',
    500,
    1700,  -- R$ 17,00
    2,
    3400
);

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