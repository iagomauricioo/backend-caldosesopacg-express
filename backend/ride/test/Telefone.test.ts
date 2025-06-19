import Telefone from "../src/domain/vo/Telefone"

test("Deve criar um telefone válido", function () {
	const telefone = new Telefone("82991021732");
	expect(telefone.getValue()).toBe("82991021732");
});

test("Não criar um telefone inválido", function () {
	expect(() => new Telefone("1234")).toThrow(new Error("Número de telefone inválido"));
});
