import Cpf from "../vo/Cpf";
import Email from "../vo/Email";
import Nome from "../vo/Nome";
import Telefone from "../vo/Telefone";
import UUID from "../vo/UUID";
import Endereco from "../vo/Endereco";

export default class Cliente {
	private accountId: UUID;
	private nome: Nome;
	private email: Email;
	private cpf: Cpf;
	private telefone: Telefone;

	constructor (accountId: string, nome: string, email: string, cpf: string, telefone: string) {
		this.accountId = new UUID(accountId);
		this.nome = new Nome(nome);
		this.email = new Email(email);
		this.cpf = new Cpf(cpf);
		this.telefone = new Telefone(telefone);
	}

	// static factory method
	static create (nome: string, email: string, cpf: string, telefone: string) {
		const accountId = UUID.create();
		return new Cliente(accountId.getValue(), nome, email, cpf, telefone);
	}

	getAccountId () {
		return this.accountId.getValue();
	}

	getNome () {
		return this.nome.getValue();
	}

	getEmail () {
		return this.email.getValue();
	}

	getCpf () {
		return this.cpf.getValue();
	}

	alterarNome (novoNome: string) {
		this.nome = new Nome(novoNome);
	}

	getTelefone () {
		return this.telefone.getValue();
	}
}
