import axios from "axios";
import dotenv from "dotenv";
import Logger from "../logger/Logger";

dotenv.config();

export interface EvolutionApiGateway {
  enviarMensagemDeTexto(mensagem: string, numero: string): Promise<any>;
}

export class EvolutionApiGatewayHttp implements EvolutionApiGateway {
  private readonly base_url = "http://localhost:8081";
  private readonly api_key = process.env.AUTHENTICATION_API_KEY;
  private readonly instance = process.env.INSTANCE_EVOLUTION_API;

  async enviarMensagemDeTexto(mensagem: string, numero: string): Promise<any> {
    if (!this.api_key) throw new Error("AUTHENTICATION_API_KEY não configurada");
    if (!this.instance) throw new Error("INSTANCE_EVOLUTION_API não configurada");
    const input = {
        "number": numero,
        "text": mensagem,
        "delay": 1000
    }
    const response = await axios.post(`${this.base_url}/message/sendText/caldos`, input, {
      headers: {
        'apikey': this.api_key,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
}