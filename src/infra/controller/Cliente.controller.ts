import BuscarCliente from "../../application/usecase/BuscarCliente";
import RegistrarCliente from "../../application/usecase/RegistrarCliente";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import RegistrarClienteNoAsaas from "../../application/usecase/RegistrarClienteNoAsaas";
import { AsaasCliente } from "../gateway/Asaas.gateway";
import { HttpResponse } from "../http/HttpResponse";

export default class ClienteController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("buscarCliente")
	buscarCliente?: BuscarCliente;
	@inject("registrarCliente")
	registrarCliente?: RegistrarCliente;
	@inject("registrarClienteNoAsaas")
	registrarClienteNoAsaas?: RegistrarClienteNoAsaas;
	
	constructor () {
		this.rotaBuscarCliente();
		this.rotaRegistrarCliente();
		this.rotaRegistrarClienteAsaas();
	}

	private rotaBuscarCliente(): void {
		this.httpServer?.register("get", "/clientes/:telefone", async (params: any, body: any) => {
				const output = await this.buscarCliente?.execute(params.telefone);
				if (!output) {
					return HttpResponse.notFound("Cliente com telefone " + params.telefone + " não encontrado");
				}
				return HttpResponse.success(output, "Cliente encontrado com sucesso");
		});
	}

	private rotaRegistrarCliente(): void {
		this.httpServer?.register("post", "/clientes", async (params: any, body: any) => {
			const output = await this.registrarCliente?.execute(body);
			if (!output) {
				return HttpResponse.internalServerError("Erro ao registrar cliente");
			}
			return HttpResponse.created(output, "Cliente registrado com sucesso");
		});
	}

	private rotaRegistrarClienteAsaas(): void {
		this.httpServer?.register("post", "/clientes/asaas", async (params: any, body: AsaasCliente) => {
				const output = await this.registrarClienteNoAsaas?.execute(body);
				if (!output) {
					return HttpResponse.internalServerError("Erro ao cadastrar cliente no ASAAS");
				}
				return HttpResponse.created(output, "Cliente cadastrado no ASAAS com sucesso");
		});
	}
}
