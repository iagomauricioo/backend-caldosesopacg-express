import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import { AsaasCobranca, AsaasGateway, AsaasReceberPagamentoPorQrCodeEstatico } from "../gateway/Asaas.gateway";
import { HttpResponse } from "../http/HttpResponse";
import GerarCobranca from "../../application/usecase/GerarCobranca";
import BuscarQrCodePix from "../../application/usecase/BuscarQrCodePix";
import ReceberWebhookCobranca from "../../application/usecase/ReceberWebhookCobranca";
import Logger from "../logger/Logger";
import { ApiError, NotFoundError, ValidationError } from "../http/ApiError";

export default class CobrancaController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("gerarCobranca")
	gerarCobranca?: GerarCobranca;
	@inject("buscarQrCodePix")
	buscarQrCodePix?: BuscarQrCodePix;
	@inject("receberWebhookCobranca")
	receberWebhookCobranca?: ReceberWebhookCobranca;
	@inject("asaasGateway")
	asaasGateway?: AsaasGateway;

	
	constructor () {
		this.rotaGerarCobranca();
		this.rotaWebhookCobranca();
		this.rotaReceberPagamentoPorQrCodeEstatico();
	}

	private rotaGerarCobranca(): void {
		this.httpServer?.register("post", "/cobranca", async (params: any, body: AsaasCobranca, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				logger.audit("GERAR_COBRANCA", "cobranca", { 
					customer: body.customer, 
					value: body.value 
				});
				
				const agora = new Date();
				const dataVencimento = new Date(agora.getTime() + 5 * 60 * 1000); // +5 minutos
				body.dueDate = dataVencimento;
				
				const output = await this.gerarCobranca?.execute(body);
				if (!output) {
					throw new ApiError("Erro ao gerar cobranca", 500);
				}
				
				logger.info("Cobrança gerada com sucesso", { 
					cobrancaId: output.id, 
					customer: body.customer, 
					value: body.value 
				});
				
				return HttpResponse.created(output, "Cobranca gerada com sucesso");
			} catch (error: any) {
				if (error instanceof ValidationError) {
					logger.warn("Dados inválidos para gerar cobrança", { customer: body.customer, value: body.value }, error);
					return HttpResponse.badRequest(error.message);
				}

				if (error.isAxiosError || error.response) {
					logger.error("Erro externo ao gerar cobrança", { customer: body.customer, value: body.value }, error);
					return HttpResponse.externalServiceError(
						"Asaas",
						error.response?.status || 502,
						error.message,
						error.response?.data
					);
				}
				if (error instanceof ApiError) {
					logger.error("Erro de API ao gerar cobrança", { customer: body.customer, value: body.value }, error);
					return {
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						details: error.details,
						timestamp: new Date().toISOString()
					};
				}
				logger.error("Erro interno ao gerar cobrança", { customer: body.customer, value: body.value }, error);
				return HttpResponse.internalServerError("Erro ao gerar cobranca", error instanceof Error ? error.message : error);
			}
		});

        this.httpServer?.register("get", "/cobranca/pixQrCode/:id", async (params: any, body: AsaasCobranca, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
            try {
				logger.audit("BUSCAR_QRCODE_PIX", "cobranca", { cobrancaId: params.id });
				
                const output = await this.buscarQrCodePix?.execute(params.id);
                if (!output) {
                    throw new NotFoundError("Cobranca não encontrada");
                }
				
				logger.info("QR Code PIX encontrado", { cobrancaId: params.id });
                return HttpResponse.success(output, "Cobranca encontrada com sucesso");
            } catch (error: any) {
				if (error instanceof NotFoundError) {
					logger.warn("QR Code PIX não encontrado", { cobrancaId: params.id }, error);
					return HttpResponse.notFound(error.message);
				}
				
                if (error instanceof ApiError) {
					logger.error("Erro de API ao buscar QR Code PIX", { cobrancaId: params.id }, error);
                    return {
                        success: false,
                        statusCode: error.statusCode,
                        message: error.message,
                        details: error.details,
                        timestamp: new Date().toISOString()
                    };
                }
				logger.error("Erro interno ao buscar QR Code PIX", { cobrancaId: params.id }, error);
                return HttpResponse.internalServerError("Erro ao buscar QRCode Pix", error instanceof Error ? error.message : error);
            }
        });
	}

	private rotaReceberPagamentoPorQrCodeEstatico(): void {
		this.httpServer?.register("post", "/cobranca/pix/qrCode/estatico", async (params: any, body: AsaasReceberPagamentoPorQrCodeEstatico, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				logger.audit("RECEBER_PAGAMENTO_QR_ESTATICO", "pagamento", { value: body.value });
				
				const output = await this.asaasGateway?.receberPagamentoPorQrCodeEstatico(body);
				
				logger.info("Pagamento por QR Code estático processado", { paymentId: output?.id, value: body.value });
				return HttpResponse.created(output, "Pagamento recebido com sucesso");
			} catch (error: any) {
				if (error instanceof ValidationError) {
					logger.warn("Dados inválidos para pagamento QR estático", { value: body.value }, error);
					return HttpResponse.badRequest(error.message);
				}
				
				if (error.isAxiosError || error.response) {
					logger.error("Erro externo no pagamento QR estático", { value: body.value }, error);
					return HttpResponse.externalServiceError(
						"Asaas",
						error.response?.status || 502,
						error.message,
						error.response?.data
					);
				}
				
				logger.error("Erro interno no pagamento QR estático", { value: body.value }, error);
				return HttpResponse.internalServerError("Erro ao receber pagamento", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaWebhookCobranca(): void {
		this.httpServer?.register("post", "/cobranca/webhook", async (params: any, body: any, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				logger.audit("PROCESSAR_WEBHOOK_COBRANCA", "webhook", { 
					event: body.event, 
					paymentId: body.payment?.id 
				});
				
				const output = await this.receberWebhookCobranca?.execute(body);
				if (!output) {
					throw new ApiError("Erro ao processar webhook", 500);
				}
				
				logger.info("Webhook de cobrança processado", { 
					event: body.event, 
					paymentId: body.payment?.id 
				});
				
				return HttpResponse.success(output, "Webhook processado com sucesso");
			} catch (error: any) {
				if (error instanceof ValidationError) {
					logger.warn("Dados inválidos no webhook de cobrança", { 
						event: body.event, 
						paymentId: body.payment?.id 
					}, error);
					return HttpResponse.badRequest(error.message);
				}
				
				if (error instanceof ApiError) {
					logger.error("Erro de API no webhook de cobrança", { 
						event: body.event, 
						paymentId: body.payment?.id 
					}, error);
					return {
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						details: error.details,
						timestamp: new Date().toISOString()
					};
				}
				
				logger.error("Erro interno no webhook de cobrança", { 
					event: body.event, 
					paymentId: body.payment?.id 
				}, error);
				return HttpResponse.internalServerError("Erro ao processar webhook de cobranca", error instanceof Error ? error.message : error);
			}
		});
	}
}

