import EnviarMensagemWhatsapp from "../../src/application/usecase/EnviarMensagemWhatsapp";
import Endereco from "../../src/domain/entity/Endereco.entity";
import RecebemosSeuPedido from "../../src/domain/template/entrega/RecebemosSeuPedido.template";
import SaiuParaEntrega from "../../src/domain/template/entrega/SaiuParaEntrega.template";
import UUID from "../../src/domain/vo/UUID";
import { Registry } from "../../src/infra/di/DI";
import { EvolutionApiGatewayHttp } from "../../src/infra/gateway/EvolutionApiGateway";

let enviarMensagemWhatsapp: EnviarMensagemWhatsapp;

beforeEach(() => {
	Registry.getInstance().provide("evolutionApiGateway", new EvolutionApiGatewayHttp());
	enviarMensagemWhatsapp = new EnviarMensagemWhatsapp();
});

test("Deve enviar uma mensagem de texto para um número de saída para entrega", async function () {
	const endereco = new Endereco(0, UUID.create().getValue(), "Rua das Flores", "123", "Apto 101", "Jardim", "57055-100", "Próximo ao shopping", true);
	const saiuParaEntrega = new SaiuParaEntrega("5582991021732", "Geovana", endereco);
	const outputEnviarMensagemWhatsapp = await enviarMensagemWhatsapp.execute(saiuParaEntrega.getNumero(), saiuParaEntrega.getMensagem());
	console.log(outputEnviarMensagemWhatsapp);
	expect(outputEnviarMensagemWhatsapp.message.conversation).toBeDefined();
});

test.only("Deve enviar uma mensagem de texto para um número de recebimento de pedido", async function () {
	const endereco = new Endereco(0, UUID.create().getValue(), "Rua das Flores", "123", "Apto 101", "Jardim", "57055-100", "Próximo ao shopping", true);
	const recebemosSeuPedido = new RecebemosSeuPedido("5582991021732", "Geovana", endereco);
	const outputEnviarMensagemWhatsapp = await enviarMensagemWhatsapp.execute(recebemosSeuPedido.getNumero(), recebemosSeuPedido.getMensagem());
	console.log(outputEnviarMensagemWhatsapp);
	expect(outputEnviarMensagemWhatsapp.message.conversation).toBeDefined();
});