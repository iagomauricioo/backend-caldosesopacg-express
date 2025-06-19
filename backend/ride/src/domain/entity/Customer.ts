import Cpf from "../vo/Cpf";
import Email from "../vo/Email";
import Name from "../vo/Name";
import Phone from "../vo/Phone";
import UUID from "../vo/UUID";

export default class Customer {
	private accountId: UUID;
	private name: Name;
	private email: Email;
	private cpf: Cpf;
	private phone: Phone;

	constructor (accountId: string, name: string, email: string, cpf: string, phone: string) {
		this.accountId = new UUID(accountId);
		this.name = new Name(name);
		this.email = new Email(email);
		this.cpf = new Cpf(cpf);
		this.phone = new Phone(phone);
	}

	// static factory method
	static create (name: string, email: string, cpf: string, phone: string) {
		const accountId = UUID.create();
		return new Customer(accountId.getValue(), name, email, cpf, phone);
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

	getPhone () {
		return this.phone.getValue();
	}
}
