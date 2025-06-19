import Endereco from "../src/domain/vo/Endereco";

test("Deve criar um endereço válido", function () {
	const endereco = new Endereco(
		"Rua das Flores",
		"123",
		"Apto 45",
		"Centro",
		"São Paulo",
		"SP",
		"57055-100"
	);
	expect(endereco).toBeDefined();
});

test("Não deve criar um endereço com CEP inválido", function () {
	expect(() => new Endereco(
		"Rua das Flores",
		"123",
		"Apto 45",
		"Centro",
		"São Paulo",
		"SP",
		"123" // CEP inválido
	)).toThrow(new Error("CEP inválido"));
});
