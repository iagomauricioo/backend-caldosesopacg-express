export default class Senha {
	private value: string;

	constructor (value: string) {
		if (value.length < 6) throw new Error("Senha inválida");
		this.value = value;
	}

	getValue () {
		return this.value;
	}
}