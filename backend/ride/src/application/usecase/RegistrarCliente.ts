import ClienteRepository from "../../infra/repository/ClienteRepository";
import Cliente from "../../domain/entity/Cliente";
import { inject } from "../../infra/di/DI";

export default class RegistrarCliente {
	@inject("clienteRepository")
	clienteRepository?: ClienteRepository;

	async execute (input: any) {
		const cliente = Cliente.create(input.nome, input.telefone);
		const clienteData = await this.clienteRepository?.buscarClientePorTelefone(input.telefone);
		if (clienteData) throw new Error("Cliente já cadastrado");
		await this.clienteRepository?.salvarCliente(cliente);
		return {
			clienteId: cliente.getClienteId()
		};
	}
}