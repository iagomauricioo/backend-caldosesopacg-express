import BuscarCep from "../../application/usecase/BuscarCep";
import Cep from "../../domain/vo/Cep";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import Logger from "../logger/Logger";
import { HttpResponse } from "../http/HttpResponse";
import { ApiError, NotFoundError } from "../http/ApiError";

export default class CepController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("buscarCep")
	buscarCep?: BuscarCep;

	constructor () {
		this.httpServer?.register("get", "/cep/:cep", async (params: any, body: any, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				logger.audit("BUSCAR_CEP", "cep", { cep: params.cep });
				
				const output = await this.buscarCep?.execute(new Cep(params.cep));
				if (!output) {
					throw new NotFoundError("CEP não encontrado");
				}
				
				logger.info("CEP encontrado", { cep: params.cep, rua: output.rua });
				return HttpResponse.success(output, "CEP encontrado com sucesso");
			} catch (error: any) {
				if (error instanceof NotFoundError) {
					logger.warn("CEP não encontrado", { cep: params.cep }, error);
					return HttpResponse.notFound(error.message);
				}
				
				if (error.name === 'ValidationError' || error.message?.includes('inválido')) {
					logger.warn("CEP inválido", { cep: params.cep }, error);
					return HttpResponse.badRequest("CEP inválido");
				}
				
				if (error instanceof ApiError) {
					logger.error("Erro de API ao buscar CEP", { cep: params.cep }, error);
					return {
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						details: error.details,
						timestamp: new Date().toISOString()
					};
				}
				
				logger.error("Erro interno ao buscar CEP", { cep: params.cep }, error);
				return HttpResponse.internalServerError("Erro ao buscar CEP", error instanceof Error ? error.message : error);
			}
		});
	}
}
