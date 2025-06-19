import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { Registry } from "./infra/di/DI";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import AccountController from "./infra/controller/AccountController";

const httpServer = new ExpressAdapter();
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Registry.getInstance().provide("mailerGateway", new MailerGatewayMemory());
Registry.getInstance().provide("accountController", new AccountController());
httpServer.listen(3000);