import Cep from "./Cep";
import NumeroEndereco from "./NumeroEndereco";
import Estado from "./Estado";

export default class Endereco {
	private rua: string;
	private numero: NumeroEndereco;
	private complemento: string;
	private bairro: string;
	private cidade: string;
	private estado: Estado;
	private cep: Cep;

	constructor (rua: string, numero: string, complemento: string, bairro: string, cidade: string, estado: string, cep: string) {
		this.rua = rua;
		this.numero = new NumeroEndereco(numero);
		this.complemento = complemento;
		this.bairro = bairro;
		this.cidade = cidade;
		this.estado = new Estado(estado);
		this.cep = new Cep(cep);
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

	getCidade() {
		return this.cidade;
	}

	getEstado() {
		return this.estado;
	}

	getCep() {
		return this.cep;
	}

	toString() {
		return `${this.rua}, ${this.numero}${this.complemento ? ` - ${this.complemento}` : ""}, ${this.bairro}, ${this.cidade} - ${this.estado}, CEP: ${this.cep}`;
	}
} 