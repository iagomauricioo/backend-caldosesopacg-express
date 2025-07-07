import ClienteRepository from "../../infra/repository/Cliente.repository";
import Cliente from "../../domain/entity/Cliente.entity";
import { inject } from "../../infra/di/DI";
import Endereco from "../../domain/entity/Endereco.entity";
import EnderecoRepository from "../../infra/repository/Endereco.repository";
import { AsaasCliente, AsaasGatewayHttp } from "../../infra/gateway/Asaas.gateway";
import Logger from "../../infra/logger/Logger";

export default class RegistrarCliente {
  @inject("clienteRepository")
  clienteRepository?: ClienteRepository;
  @inject("enderecoRepository")
  enderecoRepository?: EnderecoRepository;
  @inject("asaasGateway")
  asaasGateway?: AsaasGatewayHttp;

  async execute(input: RegistrarClienteInput) {
    const clienteExiste = await this.clienteRepository?.buscarClientePorTelefone(input.telefone);
    if (clienteExiste) throw new Error("Cliente já cadastrado");

    const cliente = Cliente.create(input.nome, input.cpf, input.telefone);
    const clienteSalvo = await this.clienteRepository?.salvarCliente(cliente);
    if (!clienteSalvo) throw new Error("Erro ao salvar cliente");

    if (!input.endereco) throw new Error("Endereço não informado");
    const endereco = Endereco.create(clienteSalvo.id, input.endereco.rua, input.endereco.numero, input.endereco.complemento || "", input.endereco.bairro, input.endereco.cep, input.endereco.pontoReferencia || "", input.endereco.enderecoPrincipal || true);
    await this.enderecoRepository?.salvarEndereco(endereco);

    return {
      clienteId: clienteSalvo.id,
      nome: cliente.getNome(),
      telefone: cliente.getTelefone(),
      enderecoCadastrado: endereco.toJSON(),
    };
  }
}

type RegistrarClienteInput = {
  nome: string;
  cpf: string;
  telefone: string;
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cep: string;
    pontoReferencia?: string;
    enderecoPrincipal?: boolean;
  };
};