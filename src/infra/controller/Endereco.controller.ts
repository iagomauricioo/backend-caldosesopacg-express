import EnderecoRepository from "../repository/Endereco.repository";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import Logger from "../logger/Logger";
import { HttpResponse } from "../http/HttpResponse";
import { ApiError, NotFoundError } from "../http/ApiError";

export default class EnderecoController {
  @inject("httpServer")
  httpServer?: HttpServer;
  @inject("enderecoRepository")
  enderecoRepository?: EnderecoRepository;

  constructor() {
    this.httpServer?.register("get", "/clientes/:telefone/endereco", async (params: any, body: any) => {
      try {
        const endereco = await this.enderecoRepository?.buscarEnderecoPorTelefoneDoCliente(params.telefone);
        if (!endereco) {
          throw new NotFoundError("Endereço não encontrado para o telefone informado");
        }
        return HttpResponse.success(endereco, "Endereço encontrado com sucesso");
      } catch (error: any) {
        Logger.getInstance().debug("Erro ao buscar endereço do cliente", error);
        if (error instanceof ApiError) {
          return {
            success: false,
            statusCode: error.statusCode,
            message: error.message,
            details: error.details,
            timestamp: new Date().toISOString()
          };
        }
        return HttpResponse.internalServerError("Erro ao buscar endereço do cliente", error instanceof Error ? error.message : error);
      }
    });
  }
} 