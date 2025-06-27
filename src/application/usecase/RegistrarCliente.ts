import ClienteRepository from "../../infra/repository/Cliente.repository";
import Cliente from "../../domain/entity/Cliente.entity";
import { inject } from "../../infra/di/DI";
import Endereco from "../../domain/entity/Endereco.entity";
import EnderecoRepository from "../../infra/repository/Endereco.repository";

export default class RegistrarCliente {
  @inject("clienteRepository")
  clienteRepository?: ClienteRepository;
  @inject("enderecoRepository")
  enderecoRepository?: EnderecoRepository;

  async execute(input: RegistrarClienteInput) {
    const clienteExiste = await this.clienteRepository?.buscarClientePorTelefone(input.telefone);
    if (clienteExiste) throw new Error("Cliente já cadastrado");
    const cliente = Cliente.create(input.nome, input.cpf, input.telefone);
    const clienteSalvo = await this.clienteRepository?.salvarCliente(cliente);
    if (!clienteSalvo) throw new Error("Erro ao salvar cliente");
    if (input.endereco) {
      const endereco = Endereco.create(clienteSalvo.id, input.endereco.rua, input.endereco.numero, input.endereco.complemento || "", input.endereco.bairro, input.endereco.cep, input.endereco.pontoReferencia || "", input.endereco.enderecoPrincipal || true);
      await this.enderecoRepository?.salvarEndereco(endereco);
    }
    return {
      clienteId: clienteSalvo.id,
      nome: cliente.getNome(),
      telefone: cliente.getTelefone(),
      enderecoCadastrado: !!input.endereco,
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