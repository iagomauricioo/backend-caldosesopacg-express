export default class Cep {
	CEP_VALID_LENGTH = 8;

	private value: string;

	constructor (value: string) {
		if (!value.match(/^\d{5}-?\d{3}$/)) throw new Error("CEP inválido");
		this.value = value;
	}

	getValue () {
		return this.value;
	}
}
