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
		this.httpServer?.register("get", "/pedidos", async (params: any, body: any, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				logger.audit("BUSCAR_PEDIDOS", "pedido", {});
				
				const output = await this.buscarPedidos?.execute();
				if (!output || !output.pedidos || output.pedidos.length === 0) {
					logger.info("Nenhum pedido encontrado");
					return HttpResponse.success([], "Nenhum pedido encontrado");
				}
				
				logger.info("Pedidos encontrados", { total: output.pedidos.length });
				return HttpResponse.success(output.pedidos, "Pedidos encontrados com sucesso");
			} catch (error: any) {
				if (error instanceof NotFoundError) {
					logger.warn("Pedidos não encontrados", {}, error);
					return HttpResponse.notFound("Pedidos não encontrados");
				}
				logger.error("Erro interno ao buscar pedidos", {}, error);
				return HttpResponse.internalServerError("Erro ao buscar pedidos", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaBuscarPedidoPorId(): void {
		this.httpServer?.register("get", "/pedidos/:id", async (params: any, body: any, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				const pedidoId = parseInt(params.id);
				if (isNaN(pedidoId)) {
					logger.warn("ID de pedido inválido", { id: params.id });
					return HttpResponse.badRequest("ID do pedido deve ser um número válido");
				}
				
				logger.audit("BUSCAR_PEDIDO_POR_ID", "pedido", { pedidoId });
				
				const pedido = await this.pedidoRepository?.buscarPedidoPorId(pedidoId);
				logger.info("Pedido encontrado", { pedidoId, status: pedido?.status });
				return HttpResponse.success(pedido, "Pedido encontrado com sucesso");
			} catch (error: any) {
				if (error instanceof NotFoundError) {
					logger.warn("Pedido não encontrado", { pedidoId: parseInt(params.id) }, error);
					return HttpResponse.notFound("Pedido não encontrado");
				}
				logger.error("Erro interno ao buscar pedido", { pedidoId: parseInt(params.id) }, error);
				return HttpResponse.internalServerError("Erro ao buscar pedido", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaBuscarStatusDePedidoPorId(): void {
		this.httpServer?.register("get", "/pedidos/:id/status", async (params: any, body: any, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				const pedidoId = parseInt(params.id);
				if (isNaN(pedidoId)) {
					logger.warn("ID de pedido inválido para buscar status", { id: params.id });
					return HttpResponse.badRequest("ID do pedido deve ser um número válido");
				}
				
				logger.audit("BUSCAR_STATUS_PEDIDO", "pedido", { pedidoId });
				
				const pedido = await this.pedidoRepository?.buscarStatusDePedidoPorId(pedidoId);
				logger.info("Status do pedido encontrado", { pedidoId, status: pedido?.status });
				return HttpResponse.success(pedido, "Status do pedido encontrado com sucesso");
			} catch (error: any) {
				if (error instanceof NotFoundError) {
					logger.warn("Status do pedido não encontrado", { pedidoId: parseInt(params.id) }, error);
					return HttpResponse.notFound("Status do pedido não encontrado");
				}
				logger.error("Erro interno ao buscar status do pedido", { pedidoId: parseInt(params.id) }, error);
				return HttpResponse.internalServerError("Erro ao buscar status do pedido", error instanceof Error ? error.message : error);
			}
		});
	}
}
