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
    this.httpServer?.register("get", "/clientes/:telefone/endereco", async (params: any, body: any, req?: any) => {
      const logger = req?.logger || Logger.getInstance();
      try {
        logger.audit("BUSCAR_ENDERECO_CLIENTE", "endereco", { telefone: params.telefone });
        
        const endereco = await this.enderecoRepository?.buscarEnderecoPorTelefoneDoCliente(params.telefone);
        if (!endereco) {
          throw new NotFoundError("Endereço não encontrado para o telefone informado");
        }
        
        logger.info("Endereço do cliente encontrado", { telefone: params.telefone, cep: endereco.getCep() });
        return HttpResponse.success(endereco, "Endereço encontrado com sucesso");
      } catch (error: any) {
        if (error instanceof NotFoundError) {
          logger.warn("Endereço do cliente não encontrado", { telefone: params.telefone }, error);
          return HttpResponse.notFound(error.message);
        }
        
        if (error instanceof ApiError) {
          logger.error("Erro de API ao buscar endereço do cliente", { telefone: params.telefone }, error);
          return {
            success: false,
            statusCode: error.statusCode,
            message: error.message,
            details: error.details,
            timestamp: new Date().toISOString()
          };
        }
        
        logger.error("Erro interno ao buscar endereço do cliente", { telefone: params.telefone }, error);
        return HttpResponse.internalServerError("Erro ao buscar endereço do cliente", error instanceof Error ? error.message : error);
      }
    });
  }
} 