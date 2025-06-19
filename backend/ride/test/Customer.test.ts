import Cliente from "../src/domain/entity/Cliente"

test("Deve criar uma conta", function () {
	const account = Cliente.create("John Doe", "john.doe@gmail.com", "97456321558", "82991021732");
	expect(account).toBeDefined();
});

test("Não deve criar uma conta com nome inválido", function () {
	expect(() => Cliente.create("John", "john.doe@gmail.com", "97456321558", "82991021732")).toThrow(new Error("Nome inválido"));
});

test("Não deve criar uma conta com email inválido", function () {
	expect(() => Cliente.create("John Doe", "john.doe", "97456321558", "82991021732")).toThrow(new Error("Email inválido"));
});

test("Não deve criar uma conta com cpf inválido", function () {
	expect(() => Cliente.create("John Doe", "john.doe@gmail.com", "9745632155", "82991021732")).toThrow(new Error("CPF inválido"));
});

test("Não deve criar uma conta com telefone inválido", function () {
	expect(() => Cliente.create("John Doe", "john.doe@gmail.com", "97456321558", "8299102173")).toThrow(new Error("Número de telefone inválido"));
});