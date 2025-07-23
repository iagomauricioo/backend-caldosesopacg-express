import Produto, { VariacaoProduto } from "../../domain/entity/Produto.entity";
import { inject } from "../di/DI";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface ConfigRepository {
  buscarStatusRestaurante(produto: Produto): Promise<void>;
  alterarStatusRestauranteParaAberto(): Promise<void>;
  alterarStatusRestauranteParaFechado(): Promise<void>;
}

export class ConfigRepositoryDatabase implements ConfigRepository {
  @inject("databaseConnection")
  connection?: DatabaseConnection;

  async buscarStatusRestaurante(produto: Produto): Promise<void> {
    const query = `
      SELECT valor FROM configuracoes
      WHERE chave = 'loja_aberta'
    `;

    const result = await this.connection?.query(query, []);
    return result;
  }

  async alterarStatusRestauranteParaAberto(): Promise<void> {
    const query = `
      UPDATE configuracoes
      SET valor = 'true'
      WHERE chave = 'loja_aberta'
    `;
    await this.connection?.query(query, []);
  }

  async alterarStatusRestauranteParaFechado(): Promise<void> {
    const query = `
      UPDATE configuracoes
      SET valor = 'false'
      WHERE chave = 'loja_aberta'
    `;
    await this.connection?.query(query, []);
  }
}
