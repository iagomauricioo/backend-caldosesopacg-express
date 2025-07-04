import BuscarCep from "../../application/usecase/BuscarCep";
import Cep from "../../domain/vo/Cep";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import Logger from "../logger/Logger";
import { HttpResponse } from "../http/HttpResponse";

export default class CepController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("buscarCep")
	buscarCep?: BuscarCep;

	constructor () {
		this.httpServer?.register("get", "/cep/:cep", async (params: any, body: any) => {
			try {
				const output = await this.buscarCep?.execute(new Cep(params.cep));
				return HttpResponse.success(output, "CEP encontrado com sucesso");
			} catch (error) {
				Logger.getInstance().debug("Erro ao buscar CEP", error);
				return HttpResponse.internalServerError("Erro ao buscar CEP", error instanceof Error ? error.message : error);
			}
		});
	}
}
