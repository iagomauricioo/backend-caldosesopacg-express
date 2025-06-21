import { inject } from "../../infra/di/DI";
import ProdutoRepository from "../../infra/repository/Produto.repository";

export default class ListarProdutosDisponiveis {
	@inject("produtoRepository")
	produtoRepository?: ProdutoRepository;

	async execute () {
		const produtos = await this.produtoRepository?.buscarProdutos();
		if (!produtos) throw new Error("Não foi possível buscar os produtos");
		return produtos;
	}
}
