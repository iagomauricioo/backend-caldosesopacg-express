import CepService from "../../domain/service/Cep.service";
import Cep from "../../domain/vo/Cep";
import { inject } from "../../infra/di/DI";
import Logger from "../../infra/logger/logger";

export default class BuscarCep {
	@inject("cepService")
	cepService?: CepService;

	async execute (cep: Cep) {
		const cepData = await this.cepService?.buscarCep(cep.getValue());
		Logger.getInstance().debug("CEP encontrado", cepData);
		if (!cepData) throw new Error("CEP não encontrado");
		return {
			cep: cepData.cep,
			estado: cepData.state,
			cidade: cepData.city,
			bairro: cepData.neighborhood,
			rua: cepData.street,
			service: cepData.service,
			location: cepData.location
		};
	}
}
