import ListarProdutosDisponiveis from "../../application/usecase/ListarProdutos";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import Logger from "../logger/Logger";
import { HttpResponse } from "../http/HttpResponse";

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
			} catch (error) {
				Logger.getInstance().debug("Erro ao listar produtos", error);
				return HttpResponse.internalServerError("Erro ao listar produtos", error instanceof Error ? error.message : error);
			}
		});
	}
}
