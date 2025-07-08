import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import { HttpResponse } from "../http/HttpResponse";
import Logger from "../logger/Logger";
import { ApiError, NotFoundError, ValidationError, ExternalServiceError } from "../http/ApiError";
import BuscarPedidos from "../../application/usecase/BuscarPedidos";
import PedidoRepository from "../repository/Pedido.repository";

export default class PedidoController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("buscarPedidos")
	buscarPedidos?: BuscarPedidos;
	@inject("pedidoRepository")
	pedidoRepository?: PedidoRepository;

	constructor () {
		this.rotaBuscarPedidos();
		this.rotaBuscarPedidoPorId();
		this.rotaBuscarStatusDePedidoPorId();
	}

	private rotaBuscarPedidos(): void {
		this.httpServer?.register("get", "/pedidos", async (params: any, body: any) => {
			try {
				const output = await this.buscarPedidos?.execute();
				return HttpResponse.success(output, "Pedidos encontrados com sucesso");
			} catch (error: any) {
				Logger.getInstance().error("Erro ao buscar pedidos", { error });
				if (error instanceof NotFoundError) {
					return HttpResponse.notFound("Pedidos não encontrados");
				}
				return HttpResponse.internalServerError("Erro ao buscar pedidos", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaBuscarPedidoPorId(): void {
		this.httpServer?.register("get", "/pedidos/:id", async (params: any, body: any) => {
			try {
				const pedidoId = parseInt(params.id);
				if (isNaN(pedidoId)) {
					return HttpResponse.badRequest("ID do pedido deve ser um número válido");
				}
				const pedido = await this.pedidoRepository?.buscarPedidoPorId(pedidoId);
				return HttpResponse.success(pedido, "Pedido encontrado com sucesso");
			} catch (error: any) {
				Logger.getInstance().error("Erro ao buscar pedido", { error });
				if (error instanceof NotFoundError) {
					return HttpResponse.notFound("Pedido não encontrado");
				}
				return HttpResponse.internalServerError("Erro ao buscar pedido", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaBuscarStatusDePedidoPorId(): void {
		this.httpServer?.register("get", "/pedidos/:id/status", async (params: any, body: any) => {
			try {
				const pedidoId = parseInt(params.id);
				if (isNaN(pedidoId)) {
					return HttpResponse.badRequest("ID do pedido deve ser um número válido");
				}
				const pedido = await this.pedidoRepository?.buscarStatusDePedidoPorId(pedidoId);
				return HttpResponse.success(pedido, "Status do pedido encontrado com sucesso");
			} catch (error: any) {
				Logger.getInstance().error("Erro ao buscar status do pedido", { error });
				if (error instanceof NotFoundError) {
					return HttpResponse.notFound("Status do pedido não encontrado");
				}
				return HttpResponse.internalServerError("Erro ao buscar status do pedido", error instanceof Error ? error.message : error);
			}
		});
	}
}
