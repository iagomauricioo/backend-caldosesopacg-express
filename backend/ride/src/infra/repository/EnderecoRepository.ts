import { inject } from "../di/DI";
import DatabaseConnection from "../database/DatabaseConnection";
import Endereco from "../../domain/entity/Endereco";

// Port
export default interface EnderecoRepository {
	buscarEnderecoPorClienteId (clienteId: string): Promise<Endereco | undefined>;
	salvarEndereco (endereco: Endereco): Promise<void>;
}

// Adapter
export class EnderecoRepositoryDatabase implements EnderecoRepository {
	@inject("databaseConnection")
	connection?: DatabaseConnection;

	async buscarEnderecoPorClienteId (clienteId: string) {
		const [enderecoData] = await this.connection?.query("select * from enderecos where cliente_id = $1", [clienteId]);
		if (!enderecoData) return;
        return new Endereco(enderecoData.id, enderecoData.cliente_id, enderecoData.rua, enderecoData.numero, enderecoData.complemento, enderecoData.bairro, enderecoData.cidade, enderecoData.estado, enderecoData.cep, enderecoData.ponto_referencia, enderecoData.endereco_principal);
	}
	
	async salvarEndereco (endereco: Endereco) {
        await this.connection?.query("insert into enderecos (cliente_id, rua, numero, complemento, bairro, cidade, estado, cep, ponto_referencia, endereco_principal) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [endereco.getClienteId(), endereco.getRua(), endereco.getNumero(), endereco.getComplemento(), endereco.getBairro(), endereco.getCidade(), endereco.getEstado(), endereco.getCep(), endereco.getPontoReferencia(), endereco.getEnderecoPrincipal()]);
	}
}