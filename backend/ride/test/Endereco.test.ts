import Endereco from "../src/domain/entity/Endereco";
import UUID from "../src/domain/vo/UUID";

/* 
	private id: number;
	private clienteId: UUID;
	private rua: string;
	private numero: NumeroEndereco;
	private complemento: string;
	private bairro: string;
	private cidade: string;
	private estado: Estado;
	private cep: Cep;
	private pontoReferencia: string;
	private enderecoPrincipal: boolean;
*/

test("Deve criar um endereço válido", function () {
	const endereco = new Endereco(
		0,
		UUID.create().getValue(),
		"Rua das Flores",
		"123",
		"Apto 45",
		"Centro",
		"São Paulo",
		"SP",
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
		"São Paulo",
		"SP",
		"123",
		"",
		false
	)).toThrow(new Error("CEP inválido"));
});
