import EnderecoRepository from "../repository/Endereco.repository";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";
import Logger from "../logger/Logger";
import { HttpResponse } from "../http/HttpResponse";

export default class EnderecoController {
  @inject("httpServer")
  httpServer?: HttpServer;
  @inject("enderecoRepository")
  enderecoRepository?: EnderecoRepository;

  constructor() {
    this.httpServer?.register("get", "/clientes/:telefone/endereco", async (params: any, body: any) => {
      try {
        const endereco = await this.enderecoRepository?.buscarEnderecoPorTelefoneDoCliente(params.telefone);
        return HttpResponse.success(endereco, "Endereço encontrado com sucesso");
      } catch (error) {
        Logger.getInstance().debug("Erro ao buscar endereço do cliente", error);
        return HttpResponse.internalServerError("Erro ao buscar endereço do cliente", error instanceof Error ? error.message : error);
      }
    });
  }
} 