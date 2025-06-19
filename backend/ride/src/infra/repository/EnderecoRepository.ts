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
		const [enderecoData] = await this.connection?.query("select * from enderecos_cliente where cliente_id = $1", [clienteId]);
		if (!enderecoData) return;
        return new Endereco(enderecoData.id, enderecoData.cliente_id, enderecoData.rua, enderecoData.numero, enderecoData.complemento, enderecoData.bairro, enderecoData.cep, enderecoData.ponto_referencia, enderecoData.endereco_principal);
	}
	
	async salvarEndereco (endereco: Endereco) {
        await this.connection?.query("insert into enderecos_cliente (cliente_id, rua, numero, complemento, bairro, cep, ponto_referencia, endereco_principal) values ($1, $2, $3, $4, $5, $6, $7, $8)", [endereco.getClienteId(), endereco.getRua(), endereco.getNumero().getValue(), endereco.getComplemento(), endereco.getBairro(), endereco.getCep().getValue(), endereco.getPontoReferencia(), endereco.getEnderecoPrincipal()]);
	}
}