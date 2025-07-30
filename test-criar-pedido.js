const axios = require('axios');

const pedidoPayload = {
  clienteId: "6b0aa2c2-d561-4837-a696-eca127ab3e95", // UUID de um cliente existente
  enderecoId: 1, // ID de um endereço existente
  subTotalCentavos: 4500, // R$ 45,00
  taxaEntregaCentavos: 500, // R$ 5,00
  totalCentavos: 5000, // R$ 50,00
  formaPagamento: "PIX",
  trocoParaCentavos: 0,
  observacoes: "Sem cebola, por favor",
  pagamentoId: "pay_1dv4bxa80g7o8j2h" // ID do pagamento para testar o webhook
};

async function testCriarPedido() {
  try {
    console.log('Criando pedido...');
    console.log('Payload:', JSON.stringify(pedidoPayload, null, 2));
    
    const response = await axios.post('http://localhost:8080/api/v1/pedidos', pedidoPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Pedido criado com sucesso!');
    console.log('Status:', response.status);
    console.log('Resposta:', JSON.stringify(response.data, null, 2));
    
    // Se o pedido foi criado, testar o webhook
    if (response.data.success && response.data.data) {
      console.log('\n🎯 Agora testando o webhook...');
      
      const webhookPayload = {
        "id": "evt_15e444ff9b9ab9ec29294aa1abe68025&9934532",
        "event": "PAYMENT_CONFIRMED",
        "dateCreated": "2025-07-30 20:02:15",
        "payment": {
          "object": "payment",
          "id": "pay_1dv4bxa80g7o8j2h",
          "dateCreated": "2025-07-30",
          "customer": "cus_000006896139",
          "checkoutSession": null,
          "paymentLink": "06e56fel4os6aci2",
          "value": 50,
          "netValue": 48.02,
          "originalValue": null,
          "interestValue": null,
          "description": "Venda de caldos",
          "billingType": "CREDIT_CARD",
          "confirmedDate": "2025-07-30",
          "creditCard": {
            "creditCardNumber": "4444",
            "creditCardBrand": "VISA",
            "creditCardToken": "868bff6c-60bc-4aef-8ea2-27fea4c3a3a9"
          },
          "pixTransaction": null,
          "status": "CONFIRMED",
          "dueDate": "2025-07-30",
          "originalDueDate": "2025-07-30",
          "paymentDate": null,
          "clientPaymentDate": "2025-07-30",
          "installmentNumber": null,
          "invoiceUrl": "https://sandbox.asaas.com/i/1dv4bxa80g7o8j2h",
          "invoiceNumber": "10670782",
          "externalReference": null,
          "deleted": false,
          "anticipated": false,
          "anticipable": false,
          "creditDate": "2025-09-01",
          "estimatedCreditDate": "2025-09-01",
          "transactionReceiptUrl": "https://sandbox.asaas.com/comprovantes/2640387917973199",
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
          "fine": {
            "value": 0,
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
      };
      
      const webhookResponse = await axios.post('http://localhost:8080/api/v1/cobranca/webhook', webhookPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Webhook processado com sucesso!');
      console.log('Status:', webhookResponse.status);
      console.log('Resposta:', JSON.stringify(webhookResponse.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error.response?.data || error.message);
  }
}

testCriarPedido(); 