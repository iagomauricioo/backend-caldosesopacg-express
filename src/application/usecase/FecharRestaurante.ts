import { inject } from "../../infra/di/DI";
import ConfigRepository from "../../infra/repository/Config.repository";

export default class FecharRestaurante {
	@inject("configRepository")
	configRepository?: ConfigRepository;

	async execute () {
		await this.configRepository?.alterarStatusRestauranteParaFechado();
		const status = await this.configRepository?.buscarStatusRestaurante();
		return {
			"loja_aberta": status.loja_aberta,
		};
	}
}
