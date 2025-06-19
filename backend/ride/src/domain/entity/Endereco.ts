import Cep from "../vo/Cep";
import NumeroEndereco from "../vo/NumeroEndereco";
import Estado from "../vo/Estado";
import UUID from "../vo/UUID";

export default class Endereco {
	private id: number;
	private clienteId: UUID;
	private rua: string;
	private numero: NumeroEndereco;
	private complemento: string;
	private bairro: string;
	private cidade: string;
	private estado: Estado;
	private cep: Cep;
	private pontoReferencia: string;
	private enderecoPrincipal: boolean;

	constructor (id: number, clienteId: string, rua: string, numero: string, complemento: string, bairro: string, cidade: string, estado: string, cep: string, pontoReferencia: string, enderecoPrincipal: boolean) {
		this.id = id;
		this.clienteId = new UUID(clienteId);
		this.rua = rua;
		this.numero = new NumeroEndereco(numero);
		this.complemento = complemento;
		this.bairro = bairro;
		this.cidade = cidade;
		this.estado = new Estado(estado);
		this.cep = new Cep(cep);
		this.pontoReferencia = pontoReferencia;
		this.enderecoPrincipal = enderecoPrincipal;
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

	getCidade() {
		return this.cidade;
	}

	getEstado() {
		return this.estado;
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
		return `${this.rua}, ${this.numero.getValue()}${this.complemento ? ` - ${this.complemento}` : ""}, ${this.bairro}, ${this.cidade} - ${this.estado.getValue()}, CEP: ${this.cep.getValue()}, Ponto de referência: ${this.pontoReferencia}`;
	}
} 