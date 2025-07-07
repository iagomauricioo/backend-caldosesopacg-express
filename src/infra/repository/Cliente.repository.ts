import Cliente from "../../domain/entity/Cliente.entity";
import { inject } from "../di/DI";
import DatabaseConnection from "../database/DatabaseConnection";
import Logger from "../logger/Logger";

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
		const query = "select * from clientes where telefone = $1";
		const params = [telefone];
		Logger.getInstance().debug("SQL Query", { query, params });
		const [clienteData] = await this.connection?.query(query, params);
		if (!clienteData) return;
		
		if (!clienteData.nome || !clienteData.telefone) {
			Logger.getInstance().debug("Dados do cliente incompletos", { clienteData });
			return;
		}
		return new Cliente(clienteData.id, clienteData.nome, clienteData.cpf, clienteData.telefone);
	}
	
	async salvarCliente (cliente: Cliente) {
		const query = "insert into clientes (id, nome, cpf, telefone) values ($1, $2, $3, $4) returning id, nome, cpf, telefone";
		const params = [cliente.getClienteId(), cliente.getNome(), cliente.getCpf(), cliente.getTelefone()];
		Logger.getInstance().debug("SQL Query", { query, params });
		const [result] = await this.connection?.query(query, params);
		return { id: result.id };
	}
	
	async buscarClientePorId (clienteId: string) {
		const [clienteData] = await this.connection?.query("select * from clientes where id = $1", [clienteId]);
		
		// Validar se os campos obrigatórios existem
		if (!clienteData.nome || !clienteData.cpf || !clienteData.telefone) {
			throw new Error("Dados do cliente incompletos");
		}
		
		return new Cliente(clienteData.id, clienteData.nome, clienteData.cpf, clienteData.telefone);
	}
}

export class ClienteRepositoryMemory implements ClienteRepository {
	private clientes: Cliente[] = [];

	buscarClientePorTelefone(telefone: string): Promise<Cliente | undefined> {
		return Promise.resolve(this.clientes.find(cliente => cliente.getTelefone() === telefone));
	}
	buscarClientePorId(clienteId: string): Promise<Cliente> {
		const cliente = this.clientes.find(cliente => cliente.getClienteId() === clienteId);
		if (!cliente) throw new Error("Cliente não encontrado");
		return Promise.resolve(cliente);
	}
	salvarCliente(cliente: Cliente): Promise<{ id: string; }> {
		this.clientes.push(cliente);
		return Promise.resolve({ id: cliente.getClienteId() });
	}
	
}