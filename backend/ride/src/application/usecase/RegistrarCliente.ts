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
	
	async execute (input: RegistrarClienteInput) {
		const clienteData = await this.clienteRepository?.buscarClientePorTelefone(input.telefone);
		if (clienteData) throw new Error("Cliente já cadastrado");
		
		// Cria o cliente sem endereço inicialmente
		const cliente = Cliente.create(input.nome, input.telefone);
		await this.clienteRepository?.salvarCliente(cliente);
		
		if (input.endereco) {
			const endereco = new Endereco(
				0,
				cliente.getClienteId(),
				input.endereco.getRua(),
				input.endereco.getNumero().getValue(),
				input.endereco.getComplemento() || "",
				input.endereco.getBairro(),
				input.endereco.getCep().getValue(),
				input.endereco.getPontoReferencia() || "",
				input.endereco.getEnderecoPrincipal()
			);
			await this.enderecoRepository?.salvarEndereco(endereco);
		}
		
		return {
			clienteId: cliente.getClienteId()
		};
	}
}

type RegistrarClienteInput = {
	nome: string;
	telefone: string;
	endereco: Endereco;
}