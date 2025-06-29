import { ClienteRepositoryDatabase } from "../../src/infra/repository/Cliente.repository";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { Registry } from "../../src/infra/di/DI";
import BuscarCliente from "../../src/application/usecase/BuscarCliente";
import RegistrarCliente from "../../src/application/usecase/RegistrarCliente";
import sinon from "sinon";
import Cliente from "../../src/domain/entity/Cliente.entity";
import UUID from "../../src/domain/vo/UUID";
import Endereco from "../../src/domain/entity/Endereco.entity";
import { EnderecoRepositoryDatabase } from "../../src/infra/repository/Endereco.repository";

let registrarCliente: RegistrarCliente;
let buscarCliente: BuscarCliente;
let endereco: Endereco;

beforeEach(() => {
	Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
	Registry.getInstance().provide("clienteRepository", new ClienteRepositoryDatabase());
	Registry.getInstance().provide("enderecoRepository", new EnderecoRepositoryDatabase());
	registrarCliente = new RegistrarCliente();
	buscarCliente = new BuscarCliente();
	endereco = new Endereco(0, UUID.create().getValue(), "Rua das Flores", "123", "Apto 101", "Jardim", "57055-100", "Próximo ao shopping", true);
});

test("Deve criar um cliente com stub e buscar por telefone", async function () {
	const clienteRepositoryStub = sinon.createStubInstance(ClienteRepositoryDatabase);
	const enderecoRepositoryStub = sinon.createStubInstance(EnderecoRepositoryDatabase);

	// Primeiro, simula que o cliente não existe
	clienteRepositoryStub.buscarClientePorTelefone.resolves(undefined);
	clienteRepositoryStub.salvarCliente.resolves({ id: UUID.create().getValue() });
	enderecoRepositoryStub.salvarEndereco.resolves();

	Registry.getInstance().provide("clienteRepository", clienteRepositoryStub);
	Registry.getInstance().provide("enderecoRepository", enderecoRepositoryStub);

	const registrarCliente = new RegistrarCliente();
	const buscarCliente = new BuscarCliente();

	const input = {
		nome: "John Doe",
		telefone: "82991021732",
		cpf: "13299111485",
		endereco: {
			rua: "Rua das Flores",
			numero: "123",
			complemento: "Apto 101",
			bairro: "Jardim",
			cep: "57055-100",
			pontoReferencia: "Próximo ao shopping",
			enderecoPrincipal: true
		}
	};

	const outputRegistrarCliente = await registrarCliente.execute(input);
	expect(outputRegistrarCliente.clienteId).toBeDefined();

	// Agora simula que o cliente existe, para o segundo use case
	const clienteMock = new Cliente(UUID.create().getValue(), input.nome, input.cpf, input.telefone, endereco);
	clienteRepositoryStub.buscarClientePorTelefone.resolves(clienteMock);

	const outputBuscarCliente = await buscarCliente.execute(input.telefone);
	expect(outputBuscarCliente.nome).toBe(input.nome);
	expect(outputBuscarCliente.telefone).toBe(input.telefone);
});

test("Não deve criar um cliente duplicado com stub", async function () {
	const clienteRepositoryStub = sinon.createStubInstance(ClienteRepositoryDatabase);
	const enderecoRepositoryStub = sinon.createStubInstance(EnderecoRepositoryDatabase);
	
	const clienteExistente = new Cliente(UUID.create().getValue(), "John Doe", "13299111485", "82991021732", endereco);
	clienteRepositoryStub.buscarClientePorTelefone.resolves(clienteExistente);
	clienteRepositoryStub.salvarCliente.resolves({ id: UUID.create().getValue() });
	enderecoRepositoryStub.salvarEndereco.resolves();
	
	Registry.getInstance().provide("clienteRepository", clienteRepositoryStub);
	Registry.getInstance().provide("enderecoRepository", enderecoRepositoryStub);
	
	const registrarCliente = new RegistrarCliente();
	const input = {
		nome: "John Doe",
		cpf: "13299111485",
		telefone: "82991021732",
		endereco: {
			rua: "Rua das Flores",
			numero: "123",
			complemento: "Apto 101",
			bairro: "Jardim",
			cep: "57055-100",
			pontoReferencia: "Próximo ao shopping",
			enderecoPrincipal: true
		}
	};

	await expect(() => registrarCliente.execute(input)).rejects.toThrow(new Error("Cliente já cadastrado"));
});

afterEach(async () => {
	const connection = Registry.getInstance().inject("databaseConnection");
	await connection.close();
});