import Produto, { VariacaoProduto } from "../../domain/entity/Produto.entity";
import { inject } from "../di/DI";
import DatabaseConnection from "../database/DatabaseConnection";
import Logger from "../logger/Logger";

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
    const query = `SELECT  p.id, p.nome, p.descricao, p.disponivel, p.ordem_exibicao, json_agg(json_build_object( 'tamanho_ml', v.tamanho_ml, 'nome_tamanho', v.nome_tamanho, 'preco_centavos', v.preco_centavos )) AS variacoes, p.imagem_url FROM produtos p JOIN variacoes_produto v ON v.produto_id = p.id GROUP BY p.id ORDER BY p.ordem_exibicao`;
    Logger.getInstance().debug("SQL Query", { query });
    const produtosData = await this.connection?.query(query, []);
    if (!produtosData) throw new Error("Não foi possível buscar os produtos");
    return produtosData.map((produtoData: any) => {
      const variacoes: VariacaoProduto[] = produtoData.variacoes || [];
      return new Produto(produtoData.id, produtoData.nome, produtoData.descricao, produtoData.disponivel, produtoData.ordem_exibicao, variacoes, produtoData.imagem_url);
    });
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
