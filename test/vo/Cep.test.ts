import Cep from "../../src/domain/vo/Cep"

test("Deve criar um cep válido", function () {
	const cep = new Cep("57055-100");
	expect(cep.getValue()).toBe("57055-100");
});

test("Não criar um cep inválido", function () {
	expect(() => new Cep("1234")).toThrow(new Error("CEP inválido"));
});