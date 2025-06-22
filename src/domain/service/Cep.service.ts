import Logger from "../../infra/logger/Logger";

export default class CepService {
    async buscarCep(cep: string): Promise<CepData> {
        const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
        const data = await response.json();
        Logger.getInstance().debug("CEP Log", data);
        return data;
    }
}

type CepData = {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    service: string;
    location: {
        type: string;
        coordinates: {
            longitude: string;
            latitude: string;
        }
    }
}