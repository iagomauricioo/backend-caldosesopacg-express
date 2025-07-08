import { inject } from "../../infra/di/DI";
import { AsaasGatewayHttp } from "../../infra/gateway/Asaas.gateway";
import { NotFoundError } from "../../infra/http/ApiError";
import Logger from "../../infra/logger/Logger";
import PedidoRepository from "../../infra/repository/Pedido.repository";

export default class ReceberWebhookCobranca {
  @inject("asaasGateway")
  asaasGateway?: AsaasGatewayHttp;

  @inject("pedidoRepository")
  pedidoRepository?: PedidoRepository;

  async execute(input: any) {
    Logger.getInstance().debug("Recebendo webhook de cobranca", { input });
    if (input.event !== "PAYMENT_RECEIVED") {
      return {
        message: "Webhook recebido com sucesso",
      };
    }
    const pedido = await this.pedidoRepository?.buscarPedidoPorId(input.payment.externalReference);
    Logger.getInstance().debug("Pedido encontrado", { pedido });
    if (!pedido) {
      throw new NotFoundError("Pedido não encontrado");
    }
    await this.pedidoRepository?.atualizarStatusDePedidoPorId(pedido.getId(), "aprovado");
    Logger.getInstance().debug("Pedido atualizado com sucesso", { pedido });
    return this.pedidoRepository?.buscarStatusDePedidoPorId(pedido.getId());
  }
}


/* 
Webhook recebido pelo Asaas:

{
 "id": "evt_d26e303b238e509335ac9ba210e51b0f&9719460",
 "event": "PAYMENT_RECEIVED",
 "dateCreated": "2025-07-07 21:22:17",
 "payment": {
  "object": "payment",
  "id": "pay_9epqnj151bnvrjgb",
  "dateCreated": "2025-07-07",
  "customer": "cus_000006834576",
  "checkoutSession": null,
  "paymentLink": null,
  "value": 1,
  "netValue": 1,
  "originalValue": null,
  "interestValue": null,
  "description": "Cobrança gerada automaticamente a partir de Pix recebido.",
  "billingType": "PIX",
  "confirmedDate": "2025-07-07",
  "pixTransaction": "c1f17d02-1a78-493a-8af8-a7e267bee75e",
  "pixQrCodeId": "IAGOMAUR00000000682788ASA",
  "status": "RECEIVED",
  "dueDate": "2025-07-07",
  "originalDueDate": "2025-07-07",
  "paymentDate": "2025-07-07",
  "clientPaymentDate": "2025-07-07",
  "installmentNumber": null,
  "invoiceUrl": "https://sandbox.asaas.com/i/9epqnj151bnvrjgb",
  "invoiceNumber": "10226057",
  "externalReference": null,
  "deleted": false,
  "anticipated": false,
  "anticipable": false,
  "creditDate": "2025-07-07",
  "estimatedCreditDate": "2025-07-07",
  "transactionReceiptUrl": "https://sandbox.asaas.com/comprovantes/h/UEFZTUVOVF9SRUNFSVZFRDpwYXlfOWVwcW5qMTUxYm52cmpnYg%3D%3D",
  "nossoNumero": null,
  "bankSlipUrl": null,
  "lastInvoiceViewedDate": null,
  "lastBankSlipViewedDate": null,
  "discount": {
   "value": 0,
   "limitDate": null,
   "dueDateLimitDays": 0,
   "type": "FIXED"
  },
  "interest": {
   "value": 0,
   "type": "PERCENTAGE"
  },
  "postalService": false,
  "custody": null,
  "escrow": null,
  "refunds": null
 }
}
*/