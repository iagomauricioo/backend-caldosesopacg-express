import { Registry } from "./infra/di/DI";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import ClienteController from "./infra/controller/Cliente.controller";
import { ClienteRepositoryDatabase } from "./infra/repository/Cliente.repository";
import BuscarCliente from "./application/usecase/BuscarCliente";
import RegistrarCliente from "./application/usecase/RegistrarCliente";
import { EnderecoRepositoryDatabase } from "./infra/repository/Endereco.repository";
import EnderecoController from "./infra/controller/Endereco.controller";
import Logger from "./infra/logger/logger";

// Configurar logger para exibir SQL
Logger.getInstance().setLevel("debug");

const httpServer = new ExpressAdapter();

//Infra
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());

// Repository
Registry.getInstance().provide("clienteRepository", new ClienteRepositoryDatabase());
Registry.getInstance().provide("enderecoRepository", new EnderecoRepositoryDatabase());

// Usecase
Registry.getInstance().provide("buscarCliente", new BuscarCliente());
Registry.getInstance().provide("registrarCliente", new RegistrarCliente());

// Controller
Registry.getInstance().provide("clienteController", new ClienteController());
Registry.getInstance().provide("enderecoController", new EnderecoController());

httpServer.listen(3000);