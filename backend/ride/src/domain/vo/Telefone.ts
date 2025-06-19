export default class Telefone {
	private value: string;

	constructor (value: string) {
		if (value.length < 11) throw new Error("Número de telefone inválido");
		this.value = value;
	}

	getValue () {
		return this.value;
	}
}