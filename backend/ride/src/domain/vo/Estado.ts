export default class Estado {
	private readonly value: string;
	private readonly VALID_UF = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
		'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

	constructor(value: string) {
		const upper = value.toUpperCase();
		if (!this.VALID_UF.includes(upper)) throw new Error("Estado inválido");
		this.value = upper;
	}

	getValue() {
		return this.value;
	}
}
