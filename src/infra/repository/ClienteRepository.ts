import Cliente from "../../domain/entity/Cliente";
import { inject } from "../di/DI";
import DatabaseConnection from "../database/DatabaseConnection";

// Port
export default interface ClienteRepository {
	buscarClientePorTelefone (telefone: string): Promise<Cliente | undefined>;
	buscarClientePorId (clienteId: string): Promise<Cliente>;
	salvarCliente (cliente: Cliente): Promise<{ id: string }>;
}

// Adapter
export class ClienteRepositoryDatabase implements ClienteRepository {
	@inject("databaseConnection")
	connection?: DatabaseConnection;

	async buscarClientePorTelefone (telefone: string) {
		const [clienteData] = await this.connection?.query("select * from clientes where telefone = $1", [telefone]);
		if (!clienteData) return;
		return new Cliente(clienteData.id, clienteData.nome, clienteData.telefone, clienteData.endereco);
	}
	
	async salvarCliente (cliente: Cliente) {
		const [result] = await this.connection?.query("insert into clientes (id, nome, telefone) values ($1, $2, $3) returning id", [cliente.getClienteId(), cliente.getNome(), cliente.getTelefone()]);
		return { id: result.id };
	}
	
	async buscarClientePorId (clienteId: string) {
		const [clienteData] = await this.connection?.query("select * from clientes where id = $1", [clienteId]);
		return new Cliente(clienteData.id, clienteData.nome, clienteData.telefone, clienteData.endereco);
	}
}