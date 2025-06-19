import Customer from "../src/domain/entity/Customer"

test("Deve criar uma conta", function () {
	const account = Customer.create("John Doe", "john.doe@gmail.com", "97456321558", "82991021732");
	expect(account).toBeDefined();
});

test("Não deve criar uma conta com nome inválido", function () {
	expect(() => Customer.create("John", "john.doe@gmail.com", "97456321558", "82991021732")).toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta com email inválido", function () {
	expect(() => Customer.create("John Doe", "john.doe", "97456321558", "82991021732")).toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta com cpf inválido", function () {
	expect(() => Customer.create("John Doe", "john.doe@gmail.com", "9745632155", "82991021732")).toThrow(new Error("Invalid cpf"));
});

test("Não deve criar uma conta com telefone inválido", function () {
	expect(() => Customer.create("John Doe", "john.doe@gmail.com", "97456321558", "8299102173")).toThrow(new Error("Invalid phone number"));
});