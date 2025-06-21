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
import ProdutoController from "./infra/controller/Produto.controller";
import { ProdutoRepositoryDatabase } from "./infra/repository/Produto.repository";
import ListarProdutosDisponiveis from "./application/usecase/ListarProdutos";
import CepController from "./infra/controller/Cep.controller";
import BuscarCep from "./application/usecase/BuscarCep";
import CepService from "./domain/service/Cep.service";

// Configurar logger para exibir SQL
Logger.getInstance().setLevel("debug");

const httpServer = new ExpressAdapter();

//Infra
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());

// Repository
Registry.getInstance().provide("clienteRepository", new ClienteRepositoryDatabase());
Registry.getInstance().provide("enderecoRepository", new EnderecoRepositoryDatabase());
Registry.getInstance().provide("produtoRepository", new ProdutoRepositoryDatabase());

// Usecase
Registry.getInstance().provide("buscarCliente", new BuscarCliente());
Registry.getInstance().provide("registrarCliente", new RegistrarCliente());
Registry.getInstance().provide("listarProdutosDisponiveis", new ListarProdutosDisponiveis());
Registry.getInstance().provide("buscarCep", new BuscarCep());

// Service
Registry.getInstance().provide("cepService", new CepService());

// Controller
Registry.getInstance().provide("clienteController", new ClienteController());
Registry.getInstance().provide("enderecoController", new EnderecoController());
Registry.getInstance().provide("produtoController", new ProdutoController());
Registry.getInstance().provide("cepController", new CepController());

httpServer.listen(3000);