import BuscarCliente from "../../application/usecase/BuscarCliente";
import RegistrarCliente from "../../application/usecase/RegistrarCliente";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import RegistrarClienteNoAsaas from "../../application/usecase/RegistrarClienteNoAsaas";
import { AsaasCliente, AsaasGateway } from "../gateway/Asaas.gateway";
import { HttpResponse } from "../http/HttpResponse";
import Logger from "../logger/Logger";
import { ApiError, NotFoundError, ValidationError, ExternalServiceError } from "../http/ApiError";

export default class ClienteController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("buscarCliente")
	buscarCliente?: BuscarCliente;
	@inject("registrarCliente")
	registrarCliente?: RegistrarCliente;
	@inject("registrarClienteNoAsaas")
	registrarClienteNoAsaas?: RegistrarClienteNoAsaas;
	@inject("asaasGateway")
	asaasGateway?: AsaasGateway;

	constructor () {
		this.rotaBuscarCliente();
		this.rotaRegistrarCliente();
		this.rotaRegistrarClienteAsaas();
		this.rotaBuscarClientePorExternalReference();
	}

	private rotaBuscarCliente(): void {
		this.httpServer?.register("get", "/clientes/:telefone", async (params: any, body: any) => {
			try {
				const output = await this.buscarCliente?.execute(params.telefone);
				return HttpResponse.success(output, "Cliente encontrado com sucesso");
			} catch (error: any) {
				if (error instanceof NotFoundError) {
					return HttpResponse.notFound("Cliente com telefone " + params.telefone + " não encontrado");
				}
				return HttpResponse.internalServerError("Erro ao buscar cliente", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaRegistrarCliente(): void {
		this.httpServer?.register("post", "/clientes", async (params: any, body: any) => {
			try {
				// Exemplo de validação
				if (!body.nome) throw new ValidationError("Nome é obrigatório");
				if (!body.telefone) throw new ValidationError("Telefone é obrigatório");

				const output = await this.registrarCliente?.execute(body);
				if (!output) {
					throw new ApiError("Erro ao registrar cliente", 500);
				}
				return HttpResponse.created(output, "Cliente registrado com sucesso");
			} catch (error: any) {
				Logger.getInstance().debug("Erro ao registrar cliente", error);
				if (error.isAxiosError || error.response) {
					return HttpResponse.externalServiceError(
						"Asaas",
						error.response?.status || 502,
						error.message,
						error.response?.data
					);
				}
				if (error instanceof ApiError) {
					return {
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						details: error.details,
						timestamp: new Date().toISOString()
					};
				}
				return HttpResponse.internalServerError("Erro ao registrar cliente", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaRegistrarClienteAsaas(): void {
		this.httpServer?.register("post", "/clientes/asaas", async (params: any, body: AsaasCliente) => {
			try {
				const output = await this.registrarClienteNoAsaas?.execute(body);
				if (!output) {
					throw new ApiError("Erro ao cadastrar cliente no ASAAS", 500);
				}
				return HttpResponse.created(output, "Cliente cadastrado no ASAAS com sucesso");
			} catch (error: any) {
				Logger.getInstance().debug("Erro ao cadastrar cliente no ASAAS", error);
				if (error.isAxiosError || error.response) {
					return HttpResponse.externalServiceError(
						"Asaas",
						error.response?.status || 502,
						error.message,
						error.response?.data
					);
				}
				if (error instanceof ApiError) {
					return {
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						details: error.details,
						timestamp: new Date().toISOString()
					};
				}
				return HttpResponse.internalServerError("Erro ao cadastrar cliente no ASAAS", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaBuscarClientePorExternalReference(): void {
		this.httpServer?.register("get", "/clientes/asaas/:externalReference", async (params: any, body: any) => {
			try {
				const output = await this.asaasGateway?.buscarClientePorExternalReference(params.externalReference);
				if (!output) {
					throw new NotFoundError("Cliente com externalReference " + params.externalReference + " não encontrado");
				}
				return HttpResponse.success(output, "Cliente encontrado com sucesso");
			} catch (error: any) {
				Logger.getInstance().debug("Erro ao buscar cliente por externalReference", error);
				if (error.isAxiosError || error.response) {
					return HttpResponse.externalServiceError(
						"Asaas",
						error.response?.status || 502,
						error.message,
						error.response?.data
					);
				}
				if (error instanceof ApiError) {
					return {
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						details: error.details,
						timestamp: new Date().toISOString()
					};
				}
				return HttpResponse.internalServerError("Erro ao buscar cliente por externalReference", error instanceof Error ? error.message : error);
			}
		});
	}
}
