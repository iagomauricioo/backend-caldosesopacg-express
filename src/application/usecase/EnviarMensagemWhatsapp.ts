import SaiuParaEntrega from "../../domain/template/entrega/SaiuParaEntrega.template";
import { inject } from "../../infra/di/DI";
import { EvolutionApiGateway, EvolutionApiGatewayHttp } from "../../infra/gateway/EvolutionApiGateway";

export default class EnviarMensagemWhatsapp {
	@inject("evolutionApiGateway")
	evolutionApiGateway?: EvolutionApiGatewayHttp;

	async execute (numero: string, mensagem: string) {
		const response = await this.evolutionApiGateway?.enviarMensagemDeTexto(mensagem, numero);
		if (!response) throw new Error("Não foi possível enviar a mensagem");
		return response;
	}
}
