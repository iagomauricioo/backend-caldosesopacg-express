import Senha from "../../src/domain/vo/Senha"

test("Deve criar uma senha válida", function () {
	const senha = new Senha("123456");
	expect(senha.getValue()).toBe("123456");
});

test("Não criar uma senha inválida", function () {
	expect(() => new Senha("1234")).toThrow(new Error("Senha inválida"));
});
