import { inject } from "../../infra/di/DI";
import { AsaasCobranca, AsaasGateway } from "../../infra/gateway/Asaas.gateway";

export default class BuscarQrCodePix {
  @inject("asaasGateway")
  asaasGateway?: AsaasGateway;

  async execute(id: string): Promise<any> {
    return this.asaasGateway?.buscarQrCodePix(id);
  }
}