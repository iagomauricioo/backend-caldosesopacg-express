import Estado from "../../src/domain/vo/Estado"

test("Deve criar um estado válido", function () {
	const estado = new Estado("SP");
	expect(estado.getValue()).toBe("SP");
});

test("Não criar um estado inválido", function () {
	expect(() => new Estado("1234")).toThrow(new Error("Estado inválido"));
});