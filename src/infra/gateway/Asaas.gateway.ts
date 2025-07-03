import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export interface AsaasGateway {
  cadastrarCliente(cliente: AsaasCliente): Promise<any>;
  realizarCobrancaViaPix(cobranca: AsaasCobranca): Promise<any>;
  realizarCobrancaViaCartaoDeCredito(cobranca: AsaasCobranca): Promise<any>;
  buscarQrCodePix(id: string): Promise<any>;
}

export class AsaasGatewayHttp implements AsaasGateway {
  private readonly base_url = "https://api-sandbox.asaas.com/v3";
  private readonly api_key = process.env.ASAAS_API_KEY;

  async cadastrarCliente(cliente: AsaasCliente): Promise<any> {
    if (!this.api_key) throw new Error("ASAAS_API_KEY não configurada");
    const response = await axios.post(`${this.base_url}/customers`, cliente, {
      headers: {
        'access_token': this.api_key,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async realizarCobrancaViaPix(cobranca: AsaasCobranca): Promise<any> {
    if (!this.api_key) throw new Error("ASAAS_API_KEY não configurada");
    const response = await axios.post(`${this.base_url}/lean/payments`, cobranca, {
      headers: {
        'access_token': this.api_key,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async realizarCobrancaViaCartaoDeCredito(cobranca: AsaasCobranca): Promise<any> {
    if (!this.api_key) throw new Error("ASAAS_API_KEY não configurada");
    const response = await axios.post(`${this.base_url}/payments`, cobranca, {
      headers: {
        'access_token': this.api_key,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async buscarQrCodePix(id: string): Promise<any> {
    if (!this.api_key) throw new Error("ASAAS_API_KEY não configurada");
    const response = await axios.get(`${this.base_url}/payments/${id}/pixQrCode`, {
      headers: {
        'access_token': this.api_key,
      }
    });
    return response.data;
  }
}

export type AsaasCliente = {
    "name": string,
    "cpfCnpj": string,
    "mobilePhone": string,
    "address": string, //rua
    "addressNumber": string, //numero
    "complement": string, //complemento
    "province": string, //bairro
    "postalCode": string, //cep
}

export enum AsaasBillingType {
    PIX = "PIX",
    CREDIT_CARD = "CREDIT_CARD",
}

export type AsaasCobranca = {
    "customer": string,
    "billingType": AsaasBillingType,
    "value": number,
    "dueDate": string,
}