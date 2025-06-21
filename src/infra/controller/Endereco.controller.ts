import EnderecoRepository from "../repository/Endereco.repository";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";

export default class EnderecoController {
  @inject("httpServer")
  httpServer?: HttpServer;
  @inject("enderecoRepository")
  enderecoRepository?: EnderecoRepository;

  constructor() {
    this.httpServer?.register("get", "/clientes/:telefone/endereco", async (params: any, body: any) => {
      const endereco = await this.enderecoRepository?.buscarEnderecoPorTelefoneDoCliente(params.telefone);
      return endereco;
    });
  }
} 