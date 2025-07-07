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
				const output = await this.pedidoRepository?.buscarPedidoPorId(params.id);
				return HttpResponse.success(output, "Pedido encontrado com sucesso");
			} catch (error: any) {
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
				const output = await this.pedidoRepository?.buscarStatusDePedidoPorId(params.id);
				return HttpResponse.success(output, "Status do pedido encontrado com sucesso");
			} catch (error: any) {
				if (error instanceof NotFoundError) {
					return HttpResponse.notFound("Status do pedido não encontrado");
				}
				return HttpResponse.internalServerError("Erro ao buscar status do pedido", error instanceof Error ? error.message : error);
			}
		});
	}
}
