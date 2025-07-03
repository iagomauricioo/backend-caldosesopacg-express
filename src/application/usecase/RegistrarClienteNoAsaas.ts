import { inject } from "../../infra/di/DI";
import { AsaasCliente, AsaasGatewayHttp } from "../../infra/gateway/Asaas.gateway";

export default class RegistrarClienteNoAsaas {
  @inject("asaasGateway")
  asaasGateway?: AsaasGatewayHttp;

  async execute(cliente: AsaasCliente): Promise<any> {
    return this.asaasGateway?.cadastrarCliente(cliente);
  }
}