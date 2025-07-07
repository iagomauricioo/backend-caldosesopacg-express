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
		this.httpServer?.register("get", "/produtos", async (params: any, body: any) => {
			try {
				const output = await this.listarProdutosDisponiveis?.execute();
				return HttpResponse.success(output, "Produtos listados com sucesso");
			} catch (error: any) {
				Logger.getInstance().debug("Erro ao listar produtos", error);
				if (error instanceof ApiError) {
					return {
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						details: error.details,
						timestamp: new Date().toISOString()
					};
				}
				return HttpResponse.internalServerError("Erro ao listar produtos", error instanceof Error ? error.message : error);
			}
		});
	}
}
