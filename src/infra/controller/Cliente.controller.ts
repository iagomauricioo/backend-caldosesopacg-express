import BuscarCliente from "../../application/usecase/BuscarCliente";
import RegistrarCliente from "../../application/usecase/RegistrarCliente";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import RegistrarClienteNoAsaas from "../../application/usecase/RegistrarClienteNoAsaas";
import { AsaasCliente, AsaasGateway } from "../gateway/Asaas.gateway";
import { HttpResponse } from "../http/HttpResponse";
import Logger from "../logger/Logger";
import { ApiError, NotFoundError, ValidationError, ExternalServiceError, ConflictError } from "../http/ApiError";
import Cpf from "../../domain/vo/Cpf";

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
		this.httpServer?.register("get", "/clientes/:telefone", async (params: any, body: any, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				logger.audit("BUSCAR_CLIENTE", "cliente", { telefone: params.telefone });
				const output = await this.buscarCliente?.execute(params.telefone);
				logger.info("Cliente encontrado", { telefone: params.telefone, clienteId: output?.clienteId });
				return HttpResponse.success(output, "Cliente encontrado com sucesso");
			} catch (error: any) {
				if (error instanceof NotFoundError) {
					logger.warn("Cliente não encontrado", { telefone: params.telefone }, error);
					return HttpResponse.notFound("Cliente com telefone " + params.telefone + " não encontrado");
				}
				if (error instanceof ValidationError) {
					logger.warn("Dados inválidos para buscar cliente", { telefone: params.telefone }, error);
					return HttpResponse.badRequest(error.message);
				}
				logger.error("Erro interno ao buscar cliente", { telefone: params.telefone }, error);
				return HttpResponse.internalServerError("Erro ao buscar cliente", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaRegistrarCliente(): void {
		this.httpServer?.register("post", "/clientes", async (params: any, body: any, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				// Validações básicas
				if (!body.nome) throw new ValidationError("Nome é obrigatório");
				if (!body.telefone) throw new ValidationError("Telefone é obrigatório");
				
				try {
					new Cpf(body.cpf);
				} catch (error: any) {
					if (error.message === "CPF inválido") {
						logger.warn("CPF inválido fornecido", { cpf: body.cpf });
						return HttpResponse.unprocessableEntity("CPF inválido");
					}
					throw error;
				}

				logger.audit("REGISTRAR_CLIENTE", "cliente", { 
					nome: body.nome, 
					telefone: body.telefone,
					hasEndereco: !!body.endereco 
				});
				
				const output = await this.registrarCliente?.execute(body);
				if (!output) {
					throw new ApiError("Erro ao registrar cliente", 500);
				}
				
				logger.info("Cliente registrado com sucesso", { 
					clienteId: output.clienteId, 
					telefone: body.telefone 
				});
				
				return HttpResponse.created(output, "Cliente registrado com sucesso");
			} catch (error: any) {
				if (error instanceof ValidationError) {
					logger.warn("Dados inválidos para registrar cliente", { 
						nome: body.nome, 
						telefone: body.telefone 
					}, error);
					return HttpResponse.badRequest(error.message);
				}
				
				if (error instanceof ConflictError) {
					logger.warn("Conflito ao registrar cliente", { 
						nome: body.nome, 
						telefone: body.telefone 
					}, error);
					return HttpResponse.conflict(error.message);
				}
				
				if (error.isAxiosError || error.response) {
					logger.error("Erro externo ao registrar cliente", { 
						nome: body.nome, 
						telefone: body.telefone 
					}, error);
					return HttpResponse.externalServiceError(
						"Asaas",
						error.response?.status || 502,
						error.message,
						error.response?.data
					);
				}
				if (error instanceof ApiError) {
					logger.error("Erro de API ao registrar cliente", { 
						nome: body.nome, 
						telefone: body.telefone 
					}, error);
					return {
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						details: error.details,
						timestamp: new Date().toISOString()
					};
				}
				logger.error("Erro interno ao registrar cliente", { 
					nome: body.nome, 
					telefone: body.telefone 
				}, error);
				return HttpResponse.internalServerError("Erro ao registrar cliente", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaRegistrarClienteAsaas(): void {
		this.httpServer?.register("post", "/clientes/asaas", async (params: any, body: AsaasCliente, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				logger.audit("REGISTRAR_CLIENTE_ASAAS", "cliente", { 
					nome: body.name, 
					cpfCnpj: body.cpfCnpj 
				});
				
				const output = await this.registrarClienteNoAsaas?.execute(body);
				if (!output) {
					throw new ApiError("Erro ao cadastrar cliente no ASAAS", 500);
				}
				
				logger.info("Cliente registrado no ASAAS com sucesso", { 
					clienteId: output.id, 
					cpfCnpj: body.cpfCnpj 
				});
				
				return HttpResponse.created(output, "Cliente cadastrado no ASAAS com sucesso");
			} catch (error: any) {
				if (error instanceof ValidationError) {
					logger.warn("Dados inválidos para cadastrar cliente no ASAAS", { cpfCnpj: body.cpfCnpj }, error);
					return HttpResponse.badRequest(error.message);
				}
				
				if (error.isAxiosError || error.response) {
					logger.error("Erro externo ao cadastrar cliente no ASAAS", { cpfCnpj: body.cpfCnpj }, error);
					return HttpResponse.externalServiceError(
						"Asaas",
						error.response?.status || 502,
						error.message,
						error.response?.data
					);
				}
				if (error instanceof ApiError) {
					logger.error("Erro de API ao cadastrar cliente no ASAAS", { cpfCnpj: body.cpfCnpj }, error);
					return {
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						details: error.details,
						timestamp: new Date().toISOString()
					};
				}
				logger.error("Erro interno ao cadastrar cliente no ASAAS", { cpfCnpj: body.cpfCnpj }, error);
				return HttpResponse.internalServerError("Erro ao cadastrar cliente no ASAAS", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaBuscarClientePorExternalReference(): void {
		this.httpServer?.register("get", "/clientes/asaas/:externalReference", async (params: any, body: any, req?: any) => {
			const logger = req?.logger || Logger.getInstance();
			try {
				logger.audit("BUSCAR_CLIENTE_ASAAS", "cliente", { externalReference: params.externalReference });
				
				const output = await this.asaasGateway?.buscarClientePorExternalReference(params.externalReference);
				if (!output) {
					throw new NotFoundError("Cliente com externalReference " + params.externalReference + " não encontrado");
				}
				
				logger.info("Cliente encontrado no ASAAS", { 
					externalReference: params.externalReference, 
					clienteId: output.id 
				});
				
				return HttpResponse.success(output, "Cliente encontrado com sucesso");
			} catch (error: any) {
				if (error instanceof NotFoundError) {
					logger.warn("Cliente não encontrado no ASAAS", { externalReference: params.externalReference }, error);
					return HttpResponse.notFound(error.message);
				}
				
				if (error.isAxiosError || error.response) {
					logger.error("Erro externo ao buscar cliente no ASAAS", { externalReference: params.externalReference }, error);
					return HttpResponse.externalServiceError(
						"Asaas",
						error.response?.status || 502,
						error.message,
						error.response?.data
					);
				}
				if (error instanceof ApiError) {
					logger.error("Erro de API ao buscar cliente no ASAAS", { externalReference: params.externalReference }, error);
					return {
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						details: error.details,
						timestamp: new Date().toISOString()
					};
				}
				logger.error("Erro interno ao buscar cliente no ASAAS", { externalReference: params.externalReference }, error);
				return HttpResponse.internalServerError("Erro ao buscar cliente por externalReference", error instanceof Error ? error.message : error);
			}
		});
	}
}
