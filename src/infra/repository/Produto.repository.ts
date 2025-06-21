import Produto from "../../domain/entity/Produto.entity";
import { inject } from "../di/DI";
import DatabaseConnection from "../database/DatabaseConnection";
import Logger from "../logger/logger";

export default interface ProdutoRepository {
  salvarProduto(produto: Produto): Promise<void>;
  buscarProdutos(): Promise<Produto[]>;
  buscarProdutosPorNome(nome: string): Promise<Produto[]>;
  buscarProdutosPorDisponibilidade(disponivel: boolean): Promise<Produto[]>;
  buscarProdutosPorOrdemExibicao(ordem_exibicao: number): Promise<Produto[]>;
  alterarProduto(produto: Produto): Promise<void>;
}

export class ProdutoRepositoryDatabase implements ProdutoRepository {
  @inject("databaseConnection")
  connection?: DatabaseConnection;

  async salvarProduto(produto: Produto): Promise<void> {
    const query =
      "INSERT INTO produtos (categoria_id, nome, descricao, disponivel, ordem_exibicao) VALUES ($1, $2, $3, $4, $5)";
    const params = [
      produto.getNome(),
      produto.getDescricao(),
      produto.getDisponivel(),
      produto.getOrdemExibicao(),
    ];
    Logger.getInstance().debug("SQL Query", { query, params });
    await this.connection?.query(query, params);
  }

  async buscarProdutos(): Promise<Produto[]> {
    const query = `select p.nome, p.descricao, p.disponivel, p.ordem_exibicao, v.tamanho_ml, v.nome_tamanho, v.preco_centavos from produtos p  inner join variacoes_produto v  on p.id = v.produto_id order by p.ordem_exibicao`;
    Logger.getInstance().debug("SQL Query", { query });
    const produtosData = await this.connection?.query(query, []);
    if (!produtosData) throw new Error("Não foi possível buscar os produtos");
    return produtosData.map((produtoData: any) => new Produto(produtoData.id, produtoData.nome, produtoData.descricao, produtoData.disponivel, produtoData.ordem_exibicao, produtoData.tamanho_ml, produtoData.nome_tamanho, produtoData.preco_centavos)
    );
  }

  buscarProdutosPorNome(nome: string): Promise<Produto[]> {
    throw new Error("Method not implemented.");
  }
  buscarProdutosPorDisponibilidade(disponivel: boolean): Promise<Produto[]> {
    throw new Error("Method not implemented.");
  }
  buscarProdutosPorOrdemExibicao(ordem_exibicao: number): Promise<Produto[]> {
    throw new Error("Method not implemented.");
  }

  alterarProduto(produto: Produto): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
