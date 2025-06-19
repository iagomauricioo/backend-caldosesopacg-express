import { ClienteRepositoryDatabase } from "../../src/infra/repository/ClienteRepository";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { Registry } from "../../src/infra/di/DI";
import BuscarCliente from "../../src/application/usecase/BuscarCliente";
import RegistrarCliente from "../../src/application/usecase/RegistrarCliente";
import sinon from "sinon";
import Cliente from "../../src/domain/entity/Cliente";
import UUID from "../../src/domain/vo/UUID";

let registrarCliente: RegistrarCliente;
let buscarCliente: BuscarCliente;

beforeEach(() => {
	Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
	Registry.getInstance().provide("clienteRepository", new ClienteRepositoryDatabase());
	registrarCliente = new RegistrarCliente();
	buscarCliente = new BuscarCliente();
});

/* test("Deve criar um cliente e buscar por telefone", async function () {
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
}); */

test("Deve criar um cliente com stub e buscar por telefone", async function () {
	const clienteRepositoryStub = sinon.createStubInstance(ClienteRepositoryDatabase);

	// Primeiro, simula que o cliente não existe
	clienteRepositoryStub.buscarClientePorTelefone.resolves(undefined);
	clienteRepositoryStub.salvarCliente.resolves();

	Registry.getInstance().provide("clienteRepository", clienteRepositoryStub);

	const registrarCliente = new RegistrarCliente();
	const buscarCliente = new BuscarCliente();

	const input = {
		nome: "John Doe",
		telefone: "82991021732"
	};

	const outputRegistrarCliente = await registrarCliente.execute(input);
	expect(outputRegistrarCliente.clienteId).toBeDefined();

	// Agora simula que o cliente existe, para o segundo use case
	const clienteMock = new Cliente(UUID.create().getValue(), input.nome, input.telefone);
	clienteRepositoryStub.buscarClientePorTelefone.resolves(clienteMock);

	const outputBuscarCliente = await buscarCliente.execute(input.telefone);
	expect(outputBuscarCliente.nome).toBe(input.nome);
	expect(outputBuscarCliente.telefone).toBe(input.telefone);
});

test("Não deve criar um cliente duplicado com stub", async function () {
	const clienteRepositoryStub = sinon.createStubInstance(ClienteRepositoryDatabase);
	const clienteExistente = new Cliente(UUID.create().getValue(), "John Doe", "82991021732");
	clienteRepositoryStub.buscarClientePorTelefone.resolves(clienteExistente);
	clienteRepositoryStub.salvarCliente.resolves();
	Registry.getInstance().provide("clienteRepository", clienteRepositoryStub);
	const registrarCliente = new RegistrarCliente();
	const input = {
		nome: "John Doe",
		telefone: "82991021732"
	};

	await expect(() => registrarCliente.execute(input)).rejects.toThrow(new Error("Cliente já cadastrado"));
});

/* test("Não deve criar um cliente duplicado", async function () {
	const clienteRepositoryStub = sinon.createStubInstance(ClienteRepositoryDatabase);
	const input = {
		nome: "John Doe",
		telefone: "82991021732"
	};
	await registrarCliente.execute(input);
	await expect(() => registrarCliente.execute(input)).rejects.toThrow(new Error("Cliente já cadastrado"));
});  */

afterEach(async () => {
	const connection = Registry.getInstance().inject("databaseConnection");
	await connection.close();
});