import { inject } from "../../infra/di/DI";
import ConfigRepository from "../../infra/repository/Config.repository";

export default class FecharRestaurante {
	@inject("configRepository")
	configRepository?: ConfigRepository;

	async execute () {
		await this.configRepository?.alterarStatusRestauranteParaFechado();
		return false;
	}
}
