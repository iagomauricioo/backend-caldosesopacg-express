import EnderecoService from "../../domain/service/Endereco.service";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";

export default class EnderecoController {
  @inject("httpServer")
  httpServer?: HttpServer;
  @inject("enderecoService")
  enderecoService?: EnderecoService;

  constructor() {
    this.httpServer?.register("post", "/clientes/:clienteId/endereco", async (params: any, body: any) => {
      
    });
  }
} 