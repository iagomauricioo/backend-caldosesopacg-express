export default class Nome {
	private value: string;

	constructor (value: string) {
		if (!value.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Nome inválido");
		this.value = value;
	}

	getValue () {
		return this.value;
	}
}