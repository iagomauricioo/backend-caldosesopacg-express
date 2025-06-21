import Endereco from "../../src/domain/entity/Endereco.entity";
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

test("Deve converter endereço para JSON", function () {
	const clienteId = UUID.create().getValue();
	const endereco = new Endereco(42, clienteId, "Rua das Flores", "123", "Apto 403", "Centro", "12345-678", "uninassau", true);
	
	const json = endereco.toJSON();
	
	expect(json).toEqual({
		id: 42,
		clienteId: clienteId,
		rua: "Rua das Flores",
		numero: "123",
		complemento: "Apto 403",
		bairro: "Centro",
		cep: "12345-678",
		pontoReferencia: "uninassau",
		enderecoPrincipal: true
	});
});

test("Deve converter endereço para JSON sem complemento", function () {
	const clienteId = UUID.create().getValue();
	const endereco = new Endereco(42, clienteId, "Rua das Flores", "123", "", "Centro", "12345-678", "uninassau", false);
	
	const json = endereco.toJSON();
	
	expect(json).toEqual({
		id: 42,
		clienteId: clienteId,
		rua: "Rua das Flores",
		numero: "123",
		complemento: "",
		bairro: "Centro",
		cep: "12345-678",
		pontoReferencia: "uninassau",
		enderecoPrincipal: false
	});
});