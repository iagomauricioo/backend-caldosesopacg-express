import { inject } from "../../infra/di/DI";
import { AsaasCobranca, AsaasGateway } from "../../infra/gateway/Asaas.gateway";

export default class GerarCobranca {
  @inject("asaasGateway")
  asaasGateway?: AsaasGateway;

  async execute(cobranca: AsaasCobranca): Promise<any> {
    return this.asaasGateway?.realizarCobrancaViaPix(cobranca);
  }
}