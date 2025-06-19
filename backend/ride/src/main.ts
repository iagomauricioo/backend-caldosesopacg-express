import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { Registry } from "./infra/di/DI";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import ClienteController from "./infra/controller/ClienteController";
import { ClienteRepositoryDatabase } from "./infra/repository/ClienteRepository";
import BuscarCliente from "./application/usecase/BuscarCliente";

const httpServer = new ExpressAdapter();

//Infra
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Registry.getInstance().provide("mailerGateway", new MailerGatewayMemory());

// Repository
Registry.getInstance().provide("clienteRepository", new ClienteRepositoryDatabase());

// Usecase
Registry.getInstance().provide("buscarCliente", new BuscarCliente());

// Controller
Registry.getInstance().provide("clienteController", new ClienteController());

httpServer.listen(3000);