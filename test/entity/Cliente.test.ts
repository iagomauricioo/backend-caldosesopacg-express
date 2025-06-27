import Cliente from "../../src/domain/entity/Cliente.entity"
import Endereco from "../../src/domain/entity/Endereco.entity";
import UUID from "../../src/domain/vo/UUID";

let endereco: Endereco;

beforeEach(function () {
	endereco = new Endereco(0, UUID.create().getValue(), "Rua das Flores", "123", "Apto 101", "Jardim", "57055-100", "Próximo ao shopping", true);
});

test("Deve criar uma conta", function () {
	const account = Cliente.create("John Doe", "13299111485", "82991021732", endereco);
	expect(account).toBeDefined();
});

test("Não deve criar uma conta com nome inválido", function () {
	expect(() => Cliente.create("John", "13299111485", "82991021732", endereco)).toThrow(new Error("Nome inválido"));
});

test("Não deve criar uma conta com telefone inválido", function () {
	expect(() => Cliente.create("John Doe", "13299111485", "1234", endereco)).toThrow(new Error("Número de telefone inválido"));
});

test("Não deve criar uma conta com cpf inválido", function () {
	expect(() => Cliente.create("John Doe", "1234567890", "82991021732", endereco)).toThrow(new Error("CPF inválido"));
});