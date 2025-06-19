import Cpf from "../vo/Cpf";
import Email from "../vo/Email";
import Name from "../vo/Name";
import UUID from "../vo/UUID";

export default class Account {
	private accountId: UUID;
	private name: Name;
	private email: Email;
	private cpf: Cpf;

	constructor (accountId: string, name: string, email: string, cpf: string) {
		this.accountId = new UUID(accountId);
		this.name = new Name(name);
		this.email = new Email(email);
		this.cpf = new Cpf(cpf);
	}

	// static factory method
	static create (name: string, email: string, cpf: string) {
		const accountId = UUID.create();
		return new Account(accountId.getValue(), name, email, cpf);
	}

	getAccountId () {
		return this.accountId.getValue();
	}

	getName () {
		return this.name.getValue();
	}

	getEmail () {
		return this.email.getValue();
	}

	getCpf () {
		return this.cpf.getValue();
	}

	changeName (newName: string) {
		this.name = new Name(newName);
	}
}
