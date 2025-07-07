import { inject } from "../../infra/di/DI";
import { AsaasGatewayHttp } from "../../infra/gateway/Asaas.gateway";
import Logger from "../../infra/logger/Logger";

export default class ReceberWebhookCobranca {
  @inject("asaasGateway")
  asaasGateway?: AsaasGatewayHttp;

  async execute(input: any) {
    Logger.getInstance().debug("Recebendo webhook de cobranca", { input });
    return {
      message: "Webhook recebido com sucesso",
    };
  }
}