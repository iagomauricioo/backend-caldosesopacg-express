import { inject } from "../../infra/di/DI";
import { NotFoundError } from "../../infra/http/ApiError";
import ClienteRepository from "../../infra/repository/Cliente.repository";

export default class BuscarCliente {
	@inject("clienteRepository")
	clienteRepository?: ClienteRepository;

	async execute (telefone: string) {
		const cliente = await this.clienteRepository?.buscarClientePorTelefone(telefone);
		if (!cliente) throw new NotFoundError("Cliente não encontrado");
		return {
			clienteId: cliente.getClienteId(),
			nome: cliente.getNome(),
			telefone: cliente.getTelefone(),
			cpf: cliente.getCpf() || null,
		};
	}
}
