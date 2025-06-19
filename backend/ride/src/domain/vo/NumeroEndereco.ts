export default class NumeroEndereco {
	private readonly value: string;

	constructor(value: string) {
		if (!value.match(/^\d+[A-Za-z]?$/) && value.toLowerCase() !== 's/n') {
			throw new Error("Número inválido");
		}
		this.value = value;
	}

	getValue() {
		return this.value;
	}
}
