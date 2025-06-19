export default class Phone {
	private value: string;

	constructor (value: string) {
		if (value.length < 11) throw new Error("Invalid phone number");
		this.value = value;
	}

	getValue () {
		return this.value;
	}
}