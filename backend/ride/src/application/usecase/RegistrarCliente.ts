import ClienteRepository from "../../infra/repository/ClienteRepository";
import Cliente from "../../domain/entity/Cliente";
import { inject } from "../../infra/di/DI";
import EnderecoRepository from "../../infra/repository/EnderecoRepository";
import Endereco from "../../domain/entity/Endereco";

export default class RegistrarCliente {
	@inject("clienteRepository")
	clienteRepository?: ClienteRepository;
	@inject("enderecoRepository")
	enderecoRepository?: EnderecoRepository;
	
	async execute (input: any) {
		const clienteData = await this.clienteRepository?.buscarClientePorTelefone(input.telefone);
		if (clienteData) throw new Error("Cliente já cadastrado");
		
		// Cria o cliente sem endereço inicialmente
		const cliente = Cliente.create(input.nome, input.telefone);
		await this.clienteRepository?.salvarCliente(cliente);
		
		// Se houver endereço no input, cria e salva o endereço
		if (input.endereco) {
			const endereco = new Endereco(
				0, // ID será gerado pelo banco
				cliente.getClienteId(),
				input.endereco.rua,
				input.endereco.numero,
				input.endereco.complemento || "",
				input.endereco.bairro,
				input.endereco.cep,
				input.endereco.pontoReferencia || "",
				input.endereco.enderecoPrincipal || true
			);
			await this.enderecoRepository?.salvarEndereco(endereco);
		}
		
		return {
			clienteId: cliente.getClienteId()
		};
	}
}