import { inject } from "../di/DI";
import DatabaseConnection from "../database/DatabaseConnection";
import Endereco from "../../domain/entity/Endereco";
import Logger from "../logger/logger";

// Port
export default interface EnderecoRepository {
	buscarEnderecoPorClienteId (clienteId: string): Promise<Endereco | undefined>;
	buscarEnderecoPorTelefoneDoCliente (telefone: string): Promise<Endereco | undefined>;
	salvarEndereco (endereco: Endereco): Promise<void>;
}

// Adapter
export class EnderecoRepositoryDatabase implements EnderecoRepository {
	@inject("databaseConnection")
	connection?: DatabaseConnection;

	async buscarEnderecoPorClienteId (clienteId: string) {
		const query = "select * from enderecos_cliente where cliente_id = $1";
		const params = [clienteId];
		Logger.getInstance().debug("SQL Query", { query, params });
		const [enderecoData] = await this.connection?.query(query, params);
		if (!enderecoData) return;
        return new Endereco(enderecoData.id, enderecoData.cliente_id, enderecoData.rua, enderecoData.numero, enderecoData.complemento, enderecoData.bairro, enderecoData.cep, enderecoData.ponto_referencia, enderecoData.endereco_principal);
	}

	async buscarEnderecoPorTelefoneDoCliente(telefone: string) {
		const query = "select * from enderecos_cliente where cliente_id = (select id from clientes where telefone = $1)";
		const params = [telefone];
		Logger.getInstance().debug("SQL Query", { query, params });
		const [enderecoData] = await this.connection?.query(query, params);
		if (!enderecoData) return;
        return new Endereco(enderecoData.id, enderecoData.cliente_id, enderecoData.rua, enderecoData.numero, enderecoData.complemento, enderecoData.bairro, enderecoData.cep, enderecoData.ponto_referencia, enderecoData.endereco_principal);
	}
	
	async salvarEndereco (endereco: Endereco) {
        const query = "insert into enderecos_cliente (cliente_id, rua, numero, complemento, bairro, cep, ponto_referencia, endereco_principal) values ($1, $2, $3, $4, $5, $6, $7, $8)";
        const params = [endereco.getClienteId(), endereco.getRua(), endereco.getNumero().getValue(), endereco.getComplemento(), endereco.getBairro(), endereco.getCep().getValue(), endereco.getPontoReferencia(), endereco.getEnderecoPrincipal()];
        Logger.getInstance().debug("SQL Query", { query, params });
        await this.connection?.query(query, params);
	}
}