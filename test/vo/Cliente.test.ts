import Cliente from "../../src/domain/entity/Cliente"
import Endereco from "../../src/domain/entity/Endereco";
import UUID from "../../src/domain/vo/UUID";

let endereco: Endereco;

beforeEach(function () {
	endereco = new Endereco(0, UUID.create().getValue(), "Rua das Flores", "123", "Apto 101", "Jardim", "57055-100", "Próximo ao shopping", true);
});

test("Deve criar uma conta", function () {
	const account = Cliente.create("John Doe", "82991021732", endereco);
	expect(account).toBeDefined();
});

test("Não deve criar uma conta com nome inválido", function () {
	expect(() => Cliente.create("John", "82991021732", endereco)).toThrow(new Error("Nome inválido"));
});

test("Não deve criar uma conta com telefone inválido", function () {
	expect(() => Cliente.create("John Doe", "8299102173", endereco)).toThrow(new Error("Número de telefone inválido"));
});