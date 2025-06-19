import BuscarCliente from "../../application/usecase/BuscarCliente";
import RegistrarCliente from "../../application/usecase/RegistrarCliente";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";

export default class ClienteController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("buscarCliente")
	buscarCliente?: BuscarCliente;
	@inject("registrarCliente")
	registrarCliente?: RegistrarCliente;
	constructor () {
		this.httpServer?.register("get", "/clientes/:telefone", async (params: any, body: any) => {
			const output = await this.buscarCliente?.execute(params.telefone);
			return output;
		});
		this.httpServer?.register("post", "/clientes", async (params: any, body: any) => {
			const output = await this.registrarCliente?.execute(body);
			return output;
		});
	}
}