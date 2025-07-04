import { inject } from "../../infra/di/DI";
import { AsaasGatewayHttp } from "../../infra/gateway/Asaas.gateway";
import Logger from "../../infra/logger/Logger";

export default class ReceberWebhookCobranca {
  @inject("asaasGateway")
  asaasGateway?: AsaasGatewayHttp;

  async execute(input: any) {
    Logger.getInstance().debug("Recebendo webhook de cobranca", { input });
    const output = await this.asaasGateway?.buscarClientePorExternalReference('a05ca9cb-7dd3-493c-a504-2e3395a72096');
    Logger.getInstance().debug("Cliente encontrado", { output });
    return output;
  }
}