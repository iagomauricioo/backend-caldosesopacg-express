import Cpf from "../../src/domain/vo/Cpf";

test.each([
	"97456321558",
	"71428793860",
	"87748248800"
])("Deve validar um cpf válido %s", function (value: string) {
	const cpf = new Cpf(value);
	expect(cpf.getValue()).toBe(value);
});

test.each([
	"9745632155",
	"11111111111",
	"97a56321558"
])("Não deve validar um cpf inválido %s", function (value: string) {
	expect(() => new Cpf(value)).toThrow(new Error("CPF inválido"));
});