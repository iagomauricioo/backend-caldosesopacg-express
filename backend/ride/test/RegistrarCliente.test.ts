import { ClienteRepositoryDatabase } from "../src/infra/repository/ClienteRepository";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { Registry } from "../src/infra/di/DI";
import BuscarCliente from "../src/application/usecase/BuscarCliente";
import RegistrarCliente from "../src/application/usecase/RegistrarCliente";

let registrarCliente: RegistrarCliente;
let buscarCliente: BuscarCliente;

beforeEach(() => {
	Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
	Registry.getInstance().provide("clienteRepository", new ClienteRepositoryDatabase());
	registrarCliente = new RegistrarCliente();
	buscarCliente = new BuscarCliente();
});

test("Deve criar um cliente", async function () {
	const telefone = Math.floor(Math.random() * 90000000000) + 10000000000; // Gera telefone de 11 dígitos
	const input = {
		nome: "John Doe",
		telefone: telefone.toString()
	};
	const outputRegistrarCliente = await registrarCliente.execute(input);
	expect(outputRegistrarCliente.clienteId).toBeDefined();
	const outputBuscarCliente = await buscarCliente.execute(input.telefone);
	expect(outputBuscarCliente.nome).toBe(input.nome);
	expect(outputBuscarCliente.telefone).toBe(input.telefone);
});

test("Não deve criar um cliente duplicado", async function () {
	const telefone = Math.floor(Math.random() * 90000000000) + 10000000000; // Gera telefone de 11 dígitos
	const input = {
		nome: "John Doe",
		telefone: telefone.toString()
	};
	await registrarCliente.execute(input);
	await expect(() => registrarCliente.execute(input)).rejects.toThrow(new Error("Cliente já cadastrado"));
});