import Nome from "../vo/Nome";
import Telefone from "../vo/Telefone";
import UUID from "../vo/UUID";

export default class Cliente {
	private clienteId: UUID;
	private nome: Nome;
	private telefone: Telefone;

	constructor (clienteId: string, nome: string, telefone: string) {
		this.clienteId = new UUID(clienteId);
		this.nome = new Nome(nome);
		this.telefone = new Telefone(telefone);
	}

	// static factory method
	static create (nome: string, telefone: string) {
		const clienteId = UUID.create();
		return new Cliente(clienteId.getValue(), nome, telefone);
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
}
