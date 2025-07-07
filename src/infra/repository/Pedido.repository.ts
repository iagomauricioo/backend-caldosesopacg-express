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
		const [pedidoData] = await this.connection?.query(query, [id]) as Pedido[];
		if (!pedidoData) throw new NotFoundError("Pedido não encontrado");
		return pedidoData;
	}

	async buscarStatusDePedidoPorId(id: number): Promise<{id: number, status: string}> {
		const query = "select id, status from pedidos where id = $1";
		Logger.getInstance().debug("SQL Query", { query, params: [id] });
		const [pedidoData] = await this.connection?.query(query, [id]) as any[];
		if (!pedidoData) throw new NotFoundError("Pedido não encontrado");
		return { id: pedidoData.id, status: pedidoData.status };
	}
}