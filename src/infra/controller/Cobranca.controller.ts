import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import { AsaasCobranca } from "../gateway/Asaas.gateway";
import { HttpResponse } from "../http/HttpResponse";
import GerarCobranca from "../../application/usecase/GerarCobranca";
import BuscarQrCodePix from "../../application/usecase/BuscarQrCodePix";
import ReceberWebhookCobranca from "../../application/usecase/ReceberWebhookCobranca";

export default class CobrancaController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("gerarCobranca")
	gerarCobranca?: GerarCobranca;
	@inject("buscarQrCodePix")
	buscarQrCodePix?: BuscarQrCodePix;
	@inject("receberWebhookCobranca")
	receberWebhookCobranca?: ReceberWebhookCobranca;

	constructor () {
		this.rotaGerarCobranca();
		this.rotaWebhookCobranca();
	}

	private rotaGerarCobranca(): void {
		this.httpServer?.register("post", "/cobranca", async (params: any, body: AsaasCobranca) => {
			const agora = new Date();
			const dataVencimento = new Date(agora.getTime() + 5 * 60 * 1000); // +5 minutos
			body.dueDate = dataVencimento;
			const output = await this.gerarCobranca?.execute(body);
			if (!output) {
				return HttpResponse.internalServerError("Erro ao gerar cobranca");
			}
			return HttpResponse.created(output, "Cobranca gerada com sucesso");
		});

        this.httpServer?.register("get", "/cobranca/pixQrCode/:id", async (params: any, body: AsaasCobranca) => {
            const output = await this.buscarQrCodePix?.execute(params.id);
            if (!output) {
                return HttpResponse.notFound("Cobranca não encontrada");
            }
            return HttpResponse.success(output, "Cobranca encontrada com sucesso");
        });
	}

	private rotaWebhookCobranca(): void {
		this.httpServer?.register("post", "/cobranca/webhook", async (params: any, body: any) => {
			const output = await this.receberWebhookCobranca?.execute(body);
			if (!output) {
				return HttpResponse.internalServerError("Erro ao processar webhook");
			}
			return HttpResponse.success(output, "Webhook processado com sucesso");
		});
	}
}

