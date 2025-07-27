import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import Logger from "../logger/Logger";
import { HttpResponse } from "../http/HttpResponse";
import AbrirRestaurante from "../../application/usecase/AbrirRestaurante";
import FecharRestaurante from "../../application/usecase/FecharRestaurante";
import ConfigRepository from "../repository/Config.repository";

export default class ConfigController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("abrirRestaurante")
	abrirRestaurante?: AbrirRestaurante;
	@inject("fecharRestaurante")
	fecharRestaurante?: FecharRestaurante;
	@inject("configRepository")
	configRepository?: ConfigRepository;
	
	constructor () {
		this.httpServer?.register("get", "/statusRestaurante", async (params: any, body: any, req?: any) => {
			try {
				const output = await this.configRepository?.buscarStatusRestaurante();
				return HttpResponse.success(output, "Status do restaurante buscado com sucesso");
			} catch (error: any) {
				Logger.getInstance().error("Erro interno ao buscar status do restaurante", { buscarStatusRestaurante: body }, error);
				return HttpResponse.internalServerError("Erro ao buscar status do restaurante", error instanceof Error ? error.message : error);
			}
		});
		
		this.httpServer?.register("get", "/abrirRestaurante", async (params: any, body: any, req?: any) => {
			try {
				const output = await this.abrirRestaurante?.execute();
				return HttpResponse.success(output, "Restaurante aberto com sucesso");
			} catch (error: any) {
				Logger.getInstance().error("Erro interno ao abrir restaurante", { abrirRestaurante: body }, error);
				return HttpResponse.internalServerError("Erro ao abrir restaurante", error instanceof Error ? error.message : error);
			}
		});

		this.httpServer?.register("get", "/fecharRestaurante", async (params: any, body: any, req?: any) => {
			try {
				const output = await this.fecharRestaurante?.execute();
				return HttpResponse.success(output, "Restaurante fechado com sucesso");
			} catch (error: any) {
				Logger.getInstance().error("Erro interno ao fechar restaurante", { fecharRestaurante: body }, error);
				return HttpResponse.internalServerError("Erro ao fechar restaurante", error instanceof Error ? error.message : error);
			}
		});
	}
}
