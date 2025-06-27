import Nome from "../vo/Nome";
import Cpf from "../vo/Cpf";
import Telefone from "../vo/Telefone";
import UUID from "../vo/UUID";
import Endereco from "./Endereco.entity";

export default class Cliente {
	private clienteId: UUID;
	private nome: Nome;
	private cpf: Cpf;
	private telefone: Telefone;
	private endereco?: Endereco;

	constructor (clienteId: string, nome: string, cpf: string, telefone: string, endereco?: Endereco) {
		this.clienteId = new UUID(clienteId);
		this.nome = new Nome(nome);
		this.cpf = new Cpf(cpf);
		this.telefone = new Telefone(telefone);
		this.endereco = endereco;
	}

	// static factory method
	static create (nome: string, cpf: string, telefone: string, endereco?: Endereco) {
		const clienteId = UUID.create();
		return new Cliente(clienteId.getValue(), nome, cpf, telefone, endereco);
	}

	getClienteId () {
		return this.clienteId.getValue();
	}

	getNome () {
		return this.nome.getValue();
	}

	alterarNome (novoNome: string) {
		this.nome = new Nome(novoNome);
	}

	getCpf () {
		return this.cpf.getValue();
	}

	getTelefone () {
		return this.telefone.getValue();
	}

	getEndereco () {
		return this.endereco;
	}
}
