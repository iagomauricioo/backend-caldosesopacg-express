import NumeroEndereco from "../../src/domain/vo/NumeroEndereco"

test("Deve criar um número de endereço válido", function () {
	const numeroEndereco = new NumeroEndereco("123");
	expect(numeroEndereco.getValue()).toBe("123");
});

test("Não criar um número de endereço inválido", function () {
	expect(() => new NumeroEndereco("---")).toThrow(new Error("Número inválido"));
});