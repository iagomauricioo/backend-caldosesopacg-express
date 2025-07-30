import { inject } from "../di/DI";
import DatabaseConnection from "../database/DatabaseConnection";
import Logger from "../logger/Logger";
import Pedido from "../../domain/entity/Pedido.entity";
import { NotFoundError } from "../http/ApiError";

// Port
export default interface PedidoRepository {
	buscarTodosPedidos (): Promise<PedidoCompleto[]>;
	buscarPedidoPorId (id: number): Promise<PedidoCompleto>;
	buscarPedidoPorPagamentoId (pagamentoId: string): Promise<PedidoCompleto>;
	buscarStatusDePedidoPorId (id: number): Promise<{id: number, status: string}>;
	atualizarStatusDePedidoPorId (id: number, status: string): Promise<void>;
	atualizarStatusPagamentoPorId (id: number, statusPagamento: string): Promise<void>;
	salvarPedido (pedido: any): Promise<any>;
}

// Adapter
export class PedidoRepositoryDatabase implements PedidoRepository {
	@inject("databaseConnection")
	connection?: DatabaseConnection;

	async buscarTodosPedidos(): Promise<PedidoCompleto[]> {
		const query = `
			SELECT 
				-- Dados do pedido
				p.id,
				p.cliente_id,
				p.endereco_id,
				p.subtotal_centavos,
				p.taxa_entrega_centavos,
				p.total_centavos,
				p.forma_pagamento,
				p.troco_para_centavos,
				p.status,
				p.observacoes,
				p.data_pedido,
				p.data_entrega,
				p.pagamento_id,
				p.pagamento_status,
				
				-- Dados do cliente
				c.nome as cliente_nome,
				c.telefone as cliente_telefone,
				c.cpf as cliente_cpf,
				
				-- Dados do endereço
				e.rua as endereco_rua,
				e.numero as endereco_numero,
				e.complemento as endereco_complemento,
				e.bairro as endereco_bairro,
				e.cep as endereco_cep,
				e.ponto_referencia as endereco_ponto_referencia,
				
				-- Dados dos itens (JSON agregado)
				COALESCE(
					JSON_AGG(
						DISTINCT JSONB_BUILD_OBJECT(
							'id', ip.id,
							'nome_produto', ip.nome_produto,
							'tamanho_ml', ip.tamanho_ml,
							'preco_unitario_centavos', ip.preco_unitario_centavos,
							'quantidade', ip.quantidade,
							'subtotal_centavos', ip.subtotal_centavos,
							'observacoes', ip.observacoes,
							'acompanhamentos', COALESCE(acomp_agg.acompanhamentos, '[]'::json)
						)
					) FILTER (WHERE ip.id IS NOT NULL), '[]'::json
				) as itens
				
			FROM pedidos p
			LEFT JOIN clientes c ON p.cliente_id = c.id
			LEFT JOIN enderecos_cliente e ON p.endereco_id = e.id
			LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id
			LEFT JOIN (
				-- Subquery para agregar acompanhamentos por item
				SELECT 
					ia.item_pedido_id,
					JSON_AGG(
						JSONB_BUILD_OBJECT(
							'id', ia.id,
							'nome_acompanhamento', ia.nome_acompanhamento,
							'preco_centavos', ia.preco_centavos,
							'quantidade', ia.quantidade
						)
					) as acompanhamentos
				FROM itens_acompanhamentos ia
				GROUP BY ia.item_pedido_id
			) acomp_agg ON ip.id = acomp_agg.item_pedido_id
			
			GROUP BY 
				p.id, p.cliente_id, p.endereco_id, p.subtotal_centavos,
				p.taxa_entrega_centavos, p.total_centavos, p.forma_pagamento,
				p.troco_para_centavos, p.status, p.observacoes, p.data_pedido,
				p.data_entrega, p.pagamento_id, p.pagamento_status,
				c.nome, c.telefone, c.cpf,
				e.rua, e.numero, e.complemento, e.bairro, e.cep, e.ponto_referencia
				
			ORDER BY p.data_pedido DESC
		`;
		
		Logger.getInstance().debug("SQL Query", { query });
		const pedidosData = await this.connection?.query(query, []) as any[];
		
		if (!pedidosData || pedidosData.length === 0) {
			throw new NotFoundError("Pedidos não encontrados");
		}

		// Transformar o resultado em um formato mais limpo
		return pedidosData.map(row => ({
			id: row.id,
			cliente_id: row.cliente_id,
			endereco_id: row.endereco_id,
			cliente: {
				nome: row.cliente_nome,
				telefone: row.cliente_telefone,
				cpf: row.cliente_cpf
			},
			endereco: {
				rua: row.endereco_rua,
				numero: row.endereco_numero,
				complemento: row.endereco_complemento,
				bairro: row.endereco_bairro,
				cep: row.endereco_cep,
				ponto_referencia: row.endereco_ponto_referencia
			},
			itens: row.itens || [],
			subtotal_centavos: row.subtotal_centavos,
			taxa_entrega_centavos: row.taxa_entrega_centavos,
			total_centavos: row.total_centavos,
			forma_pagamento: row.forma_pagamento,
			troco_para_centavos: row.troco_para_centavos,
			status: row.status,
			observacoes: row.observacoes,
			data_pedido: row.data_pedido,
			data_entrega: row.data_entrega,
			pagamento_id: row.pagamento_id,
			pagamento_status: row.pagamento_status
		}));
	}

	// Método para buscar pedido por ID com a mesma estrutura
	async buscarPedidoPorId(id: number): Promise<PedidoCompleto> {
		const query = `
			SELECT 
				-- Dados do pedido
				p.id,
				p.cliente_id,
				p.endereco_id,
				p.subtotal_centavos,
				p.taxa_entrega_centavos,
				p.total_centavos,
				p.forma_pagamento,
				p.troco_para_centavos,
				p.status,
				p.observacoes,
				p.data_pedido,
				p.data_entrega,
				p.pagamento_id,
				p.pagamento_status,
				
				-- Dados do cliente
				c.nome as cliente_nome,
				c.telefone as cliente_telefone,
				c.cpf as cliente_cpf,
				
				-- Dados do endereço
				e.rua as endereco_rua,
				e.numero as endereco_numero,
				e.complemento as endereco_complemento,
				e.bairro as endereco_bairro,
				e.cep as endereco_cep,
				e.ponto_referencia as endereco_ponto_referencia,
				
				-- Dados dos itens (JSON agregado)
				COALESCE(
					JSON_AGG(
						DISTINCT JSONB_BUILD_OBJECT(
							'id', ip.id,
							'nome_produto', ip.nome_produto,
							'tamanho_ml', ip.tamanho_ml,
							'preco_unitario_centavos', ip.preco_unitario_centavos,
							'quantidade', ip.quantidade,
							'subtotal_centavos', ip.subtotal_centavos,
							'observacoes', ip.observacoes,
							'acompanhamentos', COALESCE(acomp_agg.acompanhamentos, '[]'::json)
						)
					) FILTER (WHERE ip.id IS NOT NULL), '[]'::json
				) as itens
				
			FROM pedidos p
			LEFT JOIN clientes c ON p.cliente_id = c.id
			LEFT JOIN enderecos_cliente e ON p.endereco_id = e.id
			LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id
			LEFT JOIN (
				-- Subquery para agregar acompanhamentos por item
				SELECT 
					ia.item_pedido_id,
					JSON_AGG(
						JSONB_BUILD_OBJECT(
							'id', ia.id,
							'nome_acompanhamento', ia.nome_acompanhamento,
							'preco_centavos', ia.preco_centavos,
							'quantidade', ia.quantidade
						)
					) as acompanhamentos
				FROM itens_acompanhamentos ia
				GROUP BY ia.item_pedido_id
			) acomp_agg ON ip.id = acomp_agg.item_pedido_id
			
			WHERE p.id = $1
			
			GROUP BY 
				p.id, p.cliente_id, p.endereco_id, p.subtotal_centavos,
				p.taxa_entrega_centavos, p.total_centavos, p.forma_pagamento,
				p.troco_para_centavos, p.status, p.observacoes, p.data_pedido,
				p.data_entrega, p.pagamento_id, p.pagamento_status,
				c.nome, c.telefone, c.cpf,
				e.rua, e.numero, e.complemento, e.bairro, e.cep, e.ponto_referencia
		`;
		
		Logger.getInstance().debug("SQL Query", { query, params: [id] });
		const [pedidoData] = await this.connection?.query(query, [id]) as any[];
		
		if (!pedidoData) throw new NotFoundError("Pedido não encontrado");

		// Retornar no mesmo formato limpo
		return {
			id: pedidoData.id,
			cliente_id: pedidoData.cliente_id,
			endereco_id: pedidoData.endereco_id,
			cliente: {
				nome: pedidoData.cliente_nome,
				telefone: pedidoData.cliente_telefone,
				cpf: pedidoData.cliente_cpf
			},
			endereco: {
				rua: pedidoData.endereco_rua,
				numero: pedidoData.endereco_numero,
				complemento: pedidoData.endereco_complemento,
				bairro: pedidoData.endereco_bairro,
				cep: pedidoData.endereco_cep,
				ponto_referencia: pedidoData.endereco_ponto_referencia
			},
			itens: pedidoData.itens || [],
			subtotal_centavos: pedidoData.subtotal_centavos,
			taxa_entrega_centavos: pedidoData.taxa_entrega_centavos,
			total_centavos: pedidoData.total_centavos,
			forma_pagamento: pedidoData.forma_pagamento,
			troco_para_centavos: pedidoData.troco_para_centavos,
			status: pedidoData.status,
			observacoes: pedidoData.observacoes,
			data_pedido: pedidoData.data_pedido,
			data_entrega: pedidoData.data_entrega,
			pagamento_id: pedidoData.pagamento_id,
			pagamento_status: pedidoData.pagamento_status
		};
	}

	async buscarPedidoPorPagamentoId(pagamentoId: string): Promise<PedidoCompleto> {
		const query = `
			SELECT 
				-- Dados do pedido
				p.id,
				p.cliente_id,
				p.endereco_id,
				p.subtotal_centavos,
				p.taxa_entrega_centavos,
				p.total_centavos,
				p.forma_pagamento,
				p.troco_para_centavos,
				p.status,
				p.observacoes,
				p.data_pedido,
				p.data_entrega,
				p.pagamento_id,
				p.pagamento_status,
				
				-- Dados do cliente
				c.nome as cliente_nome,
				c.telefone as cliente_telefone,
				c.cpf as cliente_cpf,
				
				-- Dados do endereço
				e.rua as endereco_rua,
				e.numero as endereco_numero,
				e.complemento as endereco_complemento,
				e.bairro as endereco_bairro,
				e.cep as endereco_cep,
				e.ponto_referencia as endereco_ponto_referencia,
				
				-- Dados dos itens (JSON agregado)
				COALESCE(
					JSON_AGG(
						DISTINCT JSONB_BUILD_OBJECT(
							'id', ip.id,
							'nome_produto', ip.nome_produto,
							'tamanho_ml', ip.tamanho_ml,
							'preco_unitario_centavos', ip.preco_unitario_centavos,
							'quantidade', ip.quantidade,
							'subtotal_centavos', ip.subtotal_centavos,
							'observacoes', ip.observacoes,
							'acompanhamentos', COALESCE(acomp_agg.acompanhamentos, '[]'::json)
						)
					) FILTER (WHERE ip.id IS NOT NULL), '[]'::json
				) as itens
				
			FROM pedidos p
			LEFT JOIN clientes c ON p.cliente_id = c.id
			LEFT JOIN enderecos_cliente e ON p.endereco_id = e.id
			LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id
			LEFT JOIN (
				-- Subquery para agregar acompanhamentos por item
				SELECT 
					ia.item_pedido_id,
					JSON_AGG(
						JSONB_BUILD_OBJECT(
							'id', ia.id,
							'nome_acompanhamento', ia.nome_acompanhamento,
							'preco_centavos', ia.preco_centavos,
							'quantidade', ia.quantidade
						)
					) as acompanhamentos
				FROM itens_acompanhamentos ia
				GROUP BY ia.item_pedido_id
			) acomp_agg ON ip.id = acomp_agg.item_pedido_id
			
			WHERE p.pagamento_id = $1
			
			GROUP BY 
				p.id, p.cliente_id, p.endereco_id, p.subtotal_centavos,
				p.taxa_entrega_centavos, p.total_centavos, p.forma_pagamento,
				p.troco_para_centavos, p.status, p.observacoes, p.data_pedido,
				p.data_entrega, p.pagamento_id, p.pagamento_status,
				c.nome, c.telefone, c.cpf,
				e.rua, e.numero, e.complemento, e.bairro, e.cep, e.ponto_referencia
		`;
		
		Logger.getInstance().debug("SQL Query", { query, params: [pagamentoId] });
		const [pedidoData] = await this.connection?.query(query, [pagamentoId]) as any[];
		
		if (!pedidoData) throw new NotFoundError("Pedido não encontrado");

		// Retornar no mesmo formato limpo
		return {
			id: pedidoData.id,
			cliente_id: pedidoData.cliente_id,
			endereco_id: pedidoData.endereco_id,
			cliente: {
				nome: pedidoData.cliente_nome,
				telefone: pedidoData.cliente_telefone,
				cpf: pedidoData.cliente_cpf
			},
			endereco: {
				rua: pedidoData.endereco_rua,
				numero: pedidoData.endereco_numero,
				complemento: pedidoData.endereco_complemento,
				bairro: pedidoData.endereco_bairro,
				cep: pedidoData.endereco_cep,
				ponto_referencia: pedidoData.endereco_ponto_referencia
			},
			itens: pedidoData.itens || [],
			subtotal_centavos: pedidoData.subtotal_centavos,
			taxa_entrega_centavos: pedidoData.taxa_entrega_centavos,
			total_centavos: pedidoData.total_centavos,
			forma_pagamento: pedidoData.forma_pagamento,
			troco_para_centavos: pedidoData.troco_para_centavos,
			status: pedidoData.status,
			observacoes: pedidoData.observacoes,
			data_pedido: pedidoData.data_pedido,
			data_entrega: pedidoData.data_entrega,
			pagamento_id: pedidoData.pagamento_id,
			pagamento_status: pedidoData.pagamento_status
		};
	}

	async buscarStatusDePedidoPorId(id: number): Promise<{id: number, status: string}> {
		const query = "select id, pagamento_status from pedidos where id = $1";
		Logger.getInstance().debug("SQL Query", { query, params: [id] });
		const [pedidoData] = await this.connection?.query(query, [id]) as any[];
		if (!pedidoData) throw new NotFoundError("Pedido não encontrado");
		return { id: pedidoData.id, status: pedidoData.pagamento_status };
	}

	async atualizarStatusDePedidoPorId(id: number, status: string): Promise<void> {
		const query = "update pedidos set pagamento_status = $1 where id = $2";
		Logger.getInstance().debug("SQL Query", { query, params: [status, id] });
		await this.connection?.query(query, [status, id]);
	}

	async atualizarStatusPagamentoPorId(id: number, statusPagamento: string): Promise<void> {
		const query = "update pedidos set pagamento_status = $1 where id = $2";
		Logger.getInstance().debug("SQL Query", { query, params: [statusPagamento, id] });
		await this.connection?.query(query, [statusPagamento, id]);
	}

	async salvarPedido(pedido: any): Promise<any> {
		const query = `
			INSERT INTO pedidos (
				cliente_id, endereco_id, subtotal_centavos, taxa_entrega_centavos,
				total_centavos, forma_pagamento, troco_para_centavos, status,
				observacoes, data_pedido, data_entrega, pagamento_id, pagamento_status
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
			RETURNING *
		`;
		
		const params = [
			pedido.getClienteId(),
			pedido.getEnderecoId(),
			pedido.getSubTotalCentavos(),
			pedido.getTaxaEntregaCentavos(),
			pedido.getTotalCentavos(),
			pedido.getFormaPagamento(),
			pedido.getTrocoParaCentavos(),
			pedido.getStatus(),
			pedido.getObservacoes(),
			pedido.getDataPedido(),
			pedido.getDataEntrega(),
			pedido.getPagamentoId(),
			pedido.getPagamentoStatus()
		];
		
		Logger.getInstance().debug("SQL Query", { query, params });
		const [result] = await this.connection?.query(query, params) as any[];
		
		if (!result) throw new Error("Erro ao salvar pedido");
		
		// Retornar o pedido salvo com os dados do banco
		return {
			id: result.id,
			clienteId: result.cliente_id,
			enderecoId: result.endereco_id,
			subTotalCentavos: result.subtotal_centavos,
			taxaEntregaCentavos: result.taxa_entrega_centavos,
			totalCentavos: result.total_centavos,
			formaPagamento: result.forma_pagamento,
			trocoParaCentavos: result.troco_para_centavos,
			status: result.status,
			observacoes: result.observacoes,
			dataPedido: result.data_pedido,
			dataEntrega: result.data_entrega,
			pagamentoId: result.pagamento_id,
			pagamentoStatus: result.pagamento_status
		};
	}
}

export interface PedidoCompleto {
	id: number;
	cliente_id: string;
	endereco_id: number;
	cliente: {
		nome: string;
		telefone: string;
		cpf: string;
	};
	endereco: {
		rua: string;
		numero: string;
		complemento: string | null;
		bairro: string;
		cep: string;
		ponto_referencia: string | null;
	};
	itens: ItemPedidoCompleto[];
	subtotal_centavos: number;
	taxa_entrega_centavos: number;
	total_centavos: number;
	forma_pagamento: string;
	troco_para_centavos: number | null;
	status: string;
	observacoes: string | null;
	data_pedido: Date;
	data_entrega: Date | null;
	pagamento_id: string | null;
	pagamento_status: string;
}

export interface ItemPedidoCompleto {
	id: number;
	nome_produto: string;
	tamanho_ml: number;
	preco_unitario_centavos: number;
	quantidade: number;
	subtotal_centavos: number;
	observacoes: string | null;
	acompanhamentos: AcompanhamentoCompleto[];
}

export interface AcompanhamentoCompleto {
	id: number;
	nome_acompanhamento: string;
	preco_centavos: number;
	quantidade: number;
}