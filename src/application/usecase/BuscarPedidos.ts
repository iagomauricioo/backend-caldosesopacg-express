import { inject } from "../../infra/di/DI";
import { NotFoundError } from "../../infra/http/ApiError";
import PedidoRepository from "../../infra/repository/Pedido.repository";

export default class BuscarPedidos {
	@inject("pedidoRepository")
	pedidoRepository?: PedidoRepository;

	async execute () {
		const pedidos = await this.pedidoRepository?.buscarTodosPedidos();
		if (!pedidos || pedidos.length === 0) throw new NotFoundError("Pedidos não encontrados");
		return {
			pedidos: pedidos,
		};
	}
}
