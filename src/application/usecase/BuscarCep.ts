import { inject } from "../../infra/di/DI";
import Cep from "../../domain/vo/Cep";
import BrasilApiGateway from "../../infra/gateway/BrasilApi.gateway";

export default class BuscarCep {
	@inject("brasilApiGateway")
	brasilApiGateway?: BrasilApiGateway;

	async execute (cep: Cep) {
		const cepData = await this.brasilApiGateway?.buscarCep(cep.getValue());
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
