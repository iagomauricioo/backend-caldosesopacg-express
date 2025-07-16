import ListarProdutosDisponiveis from "../../application/usecase/ListarProdutos";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import Logger from "../logger/Logger";
import { HttpResponse } from "../http/HttpResponse";
import { ApiError } from "../http/ApiError";

export default class ProdutoController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("listarProdutosDisponiveis")
	listarProdutosDisponiveis?: ListarProdutosDisponiveis;

	constructor () {
		this.httpServer?.register("get", "/produtos", async (params: any, body: any, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				logger.audit("LISTAR_PRODUTOS", "produto", {});
				
				const output = await this.listarProdutosDisponiveis?.execute();
				if (!output || output.length === 0) {
					logger.info("Nenhum produto disponível");
					return HttpResponse.success([], "Nenhum produto disponível");
				}
				
				logger.info("Produtos listados", { total: output.length });
				return HttpResponse.success(output, "Produtos listados com sucesso");
			} catch (error: any) {
				if (error instanceof ApiError) {
					logger.error("Erro de API ao listar produtos", {}, error);
					return {
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						details: error.details,
						timestamp: new Date().toISOString()
					};
				}
				logger.error("Erro interno ao listar produtos", {}, error);
				return HttpResponse.internalServerError("Erro ao listar produtos", error instanceof Error ? error.message : error);
			}
		});
	}
}
