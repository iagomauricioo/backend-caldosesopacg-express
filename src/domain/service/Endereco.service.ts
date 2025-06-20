import EnderecoRepository from "../../infra/repository/Endereco.repository";
import { inject } from "../../infra/di/DI";
import Endereco from "../entity/Endereco";
import ClienteRepository from "../../infra/repository/Cliente.repository";

export default class EnderecoService {
  @inject("enderecoRepository")
  enderecoRepository?: EnderecoRepository;
  @inject("clienteRepository")
  clienteRepository?: ClienteRepository;

  async salvarEnderecoPorTelefoneDoCliente(telefone: string, body: Endereco) {
    const cliente = await this.clienteRepository?.buscarClientePorTelefone(telefone);
    if (!cliente) throw new Error("Cliente não encontrado");
    const endereco = Endereco.create(cliente.getClienteId(), body.getRua(), body.getNumero().getValue(), body.getComplemento() || "", body.getBairro(), body.getCep().getValue(), body.getPontoReferencia() || "", body.getEnderecoPrincipal());
    await this.enderecoRepository?.salvarEndereco(endereco);
  }

  async buscarEnderecoPorClienteId(clienteId: string) {
    return this.enderecoRepository?.buscarEnderecoPorClienteId(clienteId);
  }

  async buscarEnderecoPorTelefoneDoCliente(telefone: string) {
    return this.enderecoRepository?.buscarEnderecoPorTelefoneDoCliente(telefone);
  }
}