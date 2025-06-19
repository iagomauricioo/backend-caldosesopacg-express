import Cliente from "../src/domain/entity/Cliente"

test("Deve criar uma conta", function () {
	const account = Cliente.create("John Doe", "82991021732");
	expect(account).toBeDefined();
});

test("Não deve criar uma conta com nome inválido", function () {
	expect(() => Cliente.create("John", "82991021732")).toThrow(new Error("Nome inválido"));
});

test("Não deve criar uma conta com telefone inválido", function () {
	expect(() => Cliente.create("John Doe", "8299102173")).toThrow(new Error("Número de telefone inválido"));
});