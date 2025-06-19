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
		const cliente = Cliente.create(input.nome, input.telefone);
		const clienteSalvo = await this.clienteRepository?.salvarCliente(cliente);
		if (!clienteSalvo) throw new Error("Erro ao salvar cliente");
		if (input.endereco) {
			const endereco = new Endereco(
				0,
				clienteSalvo.id,
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
			clienteId: clienteSalvo.id,
			nome: cliente.getNome(),
			telefone: cliente.getTelefone(),
			enderecoCadastrado: !!input.endereco
		};
	}
}

type RegistrarClienteInput = {
	nome: string;
	telefone: string;
	endereco?: Endereco; // Endereço opcional
}