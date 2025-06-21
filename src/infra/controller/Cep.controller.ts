import BuscarCep from "../../application/usecase/BuscarCep";
import Cep from "../../domain/vo/Cep";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";

export default class CepController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("buscarCep")
	buscarCep?: BuscarCep;

	constructor () {
		this.httpServer?.register("get", "/cep/:cep", async (params: any, body: any) => {
			const output = await this.buscarCep?.execute(new Cep(params.cep));
			return output;
		});
	}
}
