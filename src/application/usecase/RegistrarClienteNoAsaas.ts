import { inject } from "../../infra/di/DI";
import { AsaasCliente, AsaasGateway } from "../../infra/gateway/Asaas.gateway";

export default class RegistrarClienteNoAsaas {
  @inject("asaasGateway")
  asaasGateway?: AsaasGateway;

  async execute(cliente: AsaasCliente): Promise<any> {
    return this.asaasGateway?.cadastrarCliente(cliente);
  }
}