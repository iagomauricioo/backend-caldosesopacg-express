import ListarProdutosDisponiveis from "../../application/usecase/ListarProdutos";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";

export default class ProdutoController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("listarProdutosDisponiveis")
	listarProdutosDisponiveis?: ListarProdutosDisponiveis;

	constructor () {
		this.httpServer?.register("get", "/produtos", async (params: any, body: any) => {
			const output = await this.listarProdutosDisponiveis?.execute();
			return output;
		});
	}
}
