import { Registry } from "./infra/di/DI";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import ClienteController from "./infra/controller/Cliente.controller";
import { ClienteRepositoryDatabase } from "./infra/repository/Cliente.repository";
import BuscarCliente from "./application/usecase/BuscarCliente";
import RegistrarCliente from "./application/usecase/RegistrarCliente";
import { EnderecoRepositoryDatabase } from "./infra/repository/Endereco.repository";
import EnderecoController from "./infra/controller/Endereco.controller";
import Logger from "./infra/logger/Logger";
import ProdutoController from "./infra/controller/Produto.controller";
import { ProdutoRepositoryDatabase } from "./infra/repository/Produto.repository";
import ListarProdutosDisponiveis from "./application/usecase/ListarProdutos";
import CepController from "./infra/controller/Cep.controller";
import BuscarCep from "./application/usecase/BuscarCep";
import RegistrarClienteNoAsaas from "./application/usecase/RegistrarClienteNoAsaas";
import { AsaasGatewayHttp } from "./infra/gateway/Asaas.gateway";
import BrasilApiGateway from "./infra/gateway/BrasilApi.gateway";
import CobrancaController from "./infra/controller/Cobranca.controller";
import GerarCobranca from "./application/usecase/GerarCobranca";
import BuscarQrCodePix from "./application/usecase/BuscarQrCodePix";
import HealthController from "./infra/controller/Health.controller";
import ReceberWebhookCobranca from "./application/usecase/ReceberWebhookCobranca";
import { PedidoRepositoryDatabase } from "./infra/repository/Pedido.repository";
import BuscarPedidos from "./application/usecase/BuscarPedidos";
import PedidoController from "./infra/controller/Pedido.controller";
import EnviarMensagemWhatsapp from "./application/usecase/EnviarMensagemWhatsapp";
import AbrirRestaurante from "./application/usecase/AbrirRestaurante";
import FecharRestaurante from "./application/usecase/FecharRestaurante";
import { ConfigRepositoryDatabase } from "./infra/repository/Config.repository";
import ConfigController from "./infra/controller/Config.controller";

// Configurar logger
const logLevel = process.env.LOG_LEVEL || "info";
Logger.getInstance().setLevel(logLevel as any);

const httpServer = new ExpressAdapter();

// Gateway
Registry.getInstance().provide("asaasGateway", new AsaasGatewayHttp());
Registry.getInstance().provide("brasilApiGateway", new BrasilApiGateway());

//Infra
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());

// Repository
Registry.getInstance().provide("clienteRepository", new ClienteRepositoryDatabase());
Registry.getInstance().provide("enderecoRepository", new EnderecoRepositoryDatabase());
Registry.getInstance().provide("produtoRepository", new ProdutoRepositoryDatabase());
Registry.getInstance().provide("pedidoRepository", new PedidoRepositoryDatabase());
Registry.getInstance().provide("configRepository", new ConfigRepositoryDatabase());

// Usecase
Registry.getInstance().provide("buscarCliente", new BuscarCliente());
Registry.getInstance().provide("registrarCliente", new RegistrarCliente());
Registry.getInstance().provide("listarProdutosDisponiveis", new ListarProdutosDisponiveis());
Registry.getInstance().provide("buscarCep", new BuscarCep());
Registry.getInstance().provide("registrarClienteNoAsaas", new RegistrarClienteNoAsaas());
Registry.getInstance().provide("gerarCobranca", new GerarCobranca());
Registry.getInstance().provide("buscarQrCodePix", new BuscarQrCodePix());
Registry.getInstance().provide("receberWebhookCobranca", new ReceberWebhookCobranca());
Registry.getInstance().provide("buscarPedidos", new BuscarPedidos());
Registry.getInstance().provide("enviarMensagemWhatsapp", new EnviarMensagemWhatsapp());
Registry.getInstance().provide("abrirRestaurante", new AbrirRestaurante());
Registry.getInstance().provide("fecharRestaurante", new FecharRestaurante());

// Controller
Registry.getInstance().provide("clienteController", new ClienteController());
Registry.getInstance().provide("enderecoController", new EnderecoController());
Registry.getInstance().provide("produtoController", new ProdutoController());
Registry.getInstance().provide("cepController", new CepController());
Registry.getInstance().provide("cobrancaController", new CobrancaController());
Registry.getInstance().provide("healthController", new HealthController());
Registry.getInstance().provide("pedidoController", new PedidoController());
Registry.getInstance().provide("configController", new ConfigController());

httpServer.listen(8080);