export default class Endereco {
	private rua: string;
	private numero: string;
	private complemento: string;
	private bairro: string;
	private cidade: string;
	private estado: string;
	private cep: string;

	constructor (rua: string, numero: string, complemento: string, bairro: string, cidade: string, estado: string, cep: string) {
		if (!this.validarCep(cep)) throw new Error("CEP inválido");
		this.rua = rua;
		this.numero = numero;
		this.complemento = complemento;
		this.bairro = bairro;
		this.cidade = cidade;
		this.estado = estado;
		this.cep = cep;
	}

	validarCep(cep: string): boolean {
		return cep.replace(/\D/g, "").length === 8;
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