import { inject } from "../di/DI";
import DatabaseConnection from "../database/DatabaseConnection";
import Logger from "../logger/Logger";
import Pedido from "../../domain/entity/Pedido.entity";
import { NotFoundError } from "../http/ApiError";

// Port
export default interface PedidoRepository {
	buscarTodosPedidos (): Promise<Pedido[]>;
	buscarPedidoPorId (id: number): Promise<Pedido>;
	buscarStatusDePedidoPorId (id: number): Promise<{id: number, status: string}>;
	atualizarStatusDePedidoPorId (id: number, status: string): Promise<void>;
}

// Adapter
export class PedidoRepositoryDatabase implements PedidoRepository {
	@inject("databaseConnection")
	connection?: DatabaseConnection;

	async buscarTodosPedidos (): Promise<Pedido[]> {
		const query = "select * from pedidos";
		Logger.getInstance().debug("SQL Query", { query });
		const pedidosData = await this.connection?.query(query, []) as Pedido[];
		if (!pedidosData || pedidosData.length === 0) throw new NotFoundError("Pedidos não encontrados");
		return pedidosData;
	}

	async buscarPedidoPorId (id: number): Promise<Pedido> {
		const query = "select * from pedidos where id = $1";
		Logger.getInstance().debug("SQL Query", { query, params: [id] });
		const [pedidoData] = await this.connection?.query(query, [id]) as any[];
		if (!pedidoData) throw new NotFoundError("Pedido não encontrado");
		// Instanciar Pedido com os dados do banco
		return new Pedido(
			pedidoData.id,
			pedidoData.cliente_id,
			pedidoData.endereco_id,
			pedidoData.sub_total_centavos,
			pedidoData.taxa_entrega_centavos,
			pedidoData.total_centavos,
			pedidoData.forma_pagamento,
			pedidoData.troco_para_centavos,
			pedidoData.status,
			pedidoData.observacoes,
			pedidoData.data_pedido,
			pedidoData.data_entrega,
			pedidoData.pagamento_id,
			pedidoData.pagamento_status
		);
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
}