import Endereco from "../../src/domain/entity/Endereco";
import UUID from "../../src/domain/vo/UUID";

test("Deve criar um endereço válido", function () {
	const endereco = new Endereco(
		0,
		UUID.create().getValue(),
		"Rua das Flores",
		"123",
		"Apto 45",
		"Centro",
		"57055-100",
		"",
		false
	);
	expect(endereco).toBeDefined();
});

test("Não deve criar um endereço com CEP inválido", function () {
	expect(() => new Endereco(
		0,
		UUID.create().getValue(),
		"Rua das Flores",
		"123",
		"Apto 45",
		"Centro",
		"123",
		"",
		false
	)).toThrow(new Error("CEP inválido"));
});

test("Deve testar o toString", function () {
	const endereco = new Endereco(
		0,
		UUID.create().getValue(),
		"Rua das Flores",
		"123",
		"Apto 45",
		"Centro",
		"57055-100",
		"",
		false
	);
	expect(endereco.toString()).toBe("Rua das Flores, 123 - Apto 45, Centro, CEP: 57055-100, Ponto de referência: ");
});
