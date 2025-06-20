import Cep from "../vo/Cep";
import NumeroEndereco from "../vo/NumeroEndereco";
import UUID from "../vo/UUID";

export default class Endereco {
	private id: number;
	private clienteId: UUID;
	private rua: string;
	private numero: NumeroEndereco;
	private complemento: string;
	private bairro: string;
	private cep: Cep;
	private pontoReferencia: string;
	private enderecoPrincipal: boolean;

	constructor (id: number, clienteId: string, rua: string, numero: string, complemento: string, bairro: string, cep: string, pontoReferencia: string, enderecoPrincipal: boolean) {
		this.id = id;
		this.clienteId = new UUID(clienteId);
		this.rua = rua;
		this.numero = new NumeroEndereco(numero);
		this.complemento = complemento;
		this.bairro = bairro;
		this.cep = new Cep(cep);
		this.pontoReferencia = pontoReferencia;
		this.enderecoPrincipal = enderecoPrincipal;
	}

	static create (clienteId: string, rua: string, numero: string, complemento: string, bairro: string, cep: string, pontoReferencia: string, enderecoPrincipal: boolean) {
		return new Endereco(0, clienteId, rua, numero, complemento, bairro, cep, pontoReferencia, enderecoPrincipal);
	}

	getId() {
		return this.id;
	}

	getClienteId () {
		return this.clienteId.getValue();
	}

	getRua() {
		return this.rua;
	}

	getNumero() {
		return this.numero;
	}

	getComplemento() {
		return this.complemento;
	}

	getBairro() {
		return this.bairro;
	}

	getCep() {
		return this.cep;
	}

	getPontoReferencia() {
		return this.pontoReferencia;
	}

	getEnderecoPrincipal() {
		return this.enderecoPrincipal;
	}

	toString() {
		return `${this.rua}, ${this.numero.getValue()}${this.complemento ? ` - ${this.complemento}` : ""}, ${this.bairro}, CEP: ${this.cep.getValue()}, Ponto de referência: ${this.pontoReferencia}`;
	}

	toJSON() {
		return {
			id: this.id,
			clienteId: this.clienteId.getValue(),
			rua: this.rua,
			numero: this.numero.getValue(),
			complemento: this.complemento,
			bairro: this.bairro,
			cep: this.cep.getValue(),
			pontoReferencia: this.pontoReferencia,
			enderecoPrincipal: this.enderecoPrincipal
		};
	}
} 