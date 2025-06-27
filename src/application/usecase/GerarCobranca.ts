import { inject } from "../../infra/di/DI";
import { AsaasBillingType, AsaasCobranca, AsaasGateway } from "../../infra/gateway/Asaas.gateway";

export default class GerarCobranca {
  @inject("asaasGateway")
  asaasGateway?: AsaasGateway;

  async execute(cobranca: AsaasCobranca): Promise<any> {
    if (cobranca.billingType === AsaasBillingType.PIX) {
      return this.asaasGateway?.realizarCobrancaViaPix(cobranca);
    } else if (cobranca.billingType === AsaasBillingType.CREDIT_CARD) {
      return this.asaasGateway?.realizarCobrancaViaCartaoDeCredito(cobranca);
    }
  }
}