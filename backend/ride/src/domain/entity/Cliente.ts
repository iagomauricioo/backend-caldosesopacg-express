import Nome from "../vo/Nome";
import Telefone from "../vo/Telefone";
import UUID from "../vo/UUID";
import Endereco from "./Endereco";

export default class Cliente {
	private clienteId: UUID;
	private nome: Nome;
	private telefone: Telefone;
	private endereco?: Endereco;

	constructor (clienteId: string, nome: string, telefone: string, endereco?: Endereco) {
		this.clienteId = new UUID(clienteId);
		this.nome = new Nome(nome);
		this.telefone = new Telefone(telefone);
		this.endereco = endereco;
	}

	// static factory method
	static create (nome: string, telefone: string, endereco?: Endereco) {
		const clienteId = UUID.create();
		return new Cliente(clienteId.getValue(), nome, telefone, endereco);
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

	getTelefone () {
		return this.telefone.getValue();
	}

	getEndereco () {
		return this.endereco;
	}
}
