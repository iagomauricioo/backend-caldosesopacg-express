import BuscarCliente from "../../application/usecase/BuscarCliente";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";

export default class ClienteController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("buscarCliente")
	buscarCliente?: BuscarCliente;

	constructor () {
		this.httpServer?.register("get", "/clientes/:telefone", async (params: any, body: any) => {
			const output = await this.buscarCliente?.execute(params.telefone);
			return output;
		});
	}
}