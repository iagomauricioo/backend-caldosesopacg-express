import BuscarCliente from "../../application/usecase/BuscarCliente";
import RegistrarCliente from "../../application/usecase/RegistrarCliente";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import RegistrarClienteNoAsaas from "../../application/usecase/RegistrarClienteNoAsaas";
import { AsaasCliente, AsaasGateway } from "../gateway/Asaas.gateway";
import { HttpResponse } from "../http/HttpResponse";
import Logger from "../logger/Logger";

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
				if (!output) {
					return HttpResponse.notFound("Cliente com telefone " + params.telefone + " não encontrado");
				}
				return HttpResponse.success(output, "Cliente encontrado com sucesso");
			} catch (error) {
				Logger.getInstance().debug("Erro ao buscar cliente", error);
				return HttpResponse.internalServerError("Erro ao buscar cliente", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaRegistrarCliente(): void {
		this.httpServer?.register("post", "/clientes", async (params: any, body: any) => {
			try {
				const output = await this.registrarCliente?.execute(body);
				if (!output) {
					return HttpResponse.internalServerError("Erro ao registrar cliente");
				}
				return HttpResponse.created(output, "Cliente registrado com sucesso");
			} catch (error) {
				Logger.getInstance().debug("Erro ao registrar cliente", error);
				return HttpResponse.internalServerError("Erro ao registrar cliente", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaRegistrarClienteAsaas(): void {
		this.httpServer?.register("post", "/clientes/asaas", async (params: any, body: AsaasCliente) => {
			try {
				const output = await this.registrarClienteNoAsaas?.execute(body);
				if (!output) {
					return HttpResponse.internalServerError("Erro ao cadastrar cliente no ASAAS");
				}
				return HttpResponse.created(output, "Cliente cadastrado no ASAAS com sucesso");
			} catch (error) {
				Logger.getInstance().debug("Erro ao cadastrar cliente no ASAAS", error);
				return HttpResponse.internalServerError("Erro ao cadastrar cliente no ASAAS", error instanceof Error ? error.message : error);
			}
		});
	}

	private rotaBuscarClientePorExternalReference(): void {
		this.httpServer?.register("get", "/clientes/asaas/:externalReference", async (params: any, body: any) => {
			try {
				const output = await this.asaasGateway?.buscarClientePorExternalReference(params.externalReference);
				if (!output) {
					return HttpResponse.notFound("Cliente com externalReference " + params.externalReference + " não encontrado");
				}
				return HttpResponse.success(output, "Cliente encontrado com sucesso");
			} catch (error) {
				Logger.getInstance().debug("Erro ao buscar cliente por externalReference", error);
				return HttpResponse.internalServerError("Erro ao buscar cliente por externalReference", error instanceof Error ? error.message : error);
			}
		});
	}
}
