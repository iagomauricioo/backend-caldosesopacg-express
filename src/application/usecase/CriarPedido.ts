import { inject } from "../../infra/di/DI";
import PedidoRepository from "../../infra/repository/Pedido.repository";
import Pedido from "../../domain/entity/Pedido.entity";
import Logger from "../../infra/logger/Logger";

export default class CriarPedido {
  @inject("pedidoRepository")
  pedidoRepository?: PedidoRepository;

  async execute(input: CriarPedidoInput) {
    const logger = Logger.getInstance();
    
    logger.info("Criando novo pedido", {
      clienteId: input.clienteId,
      enderecoId: input.enderecoId,
      totalCentavos: input.totalCentavos,
      formaPagamento: input.formaPagamento
    });
    
    // Validar dados obrigatórios
    if (!input.clienteId) throw new Error("Cliente ID é obrigatório");
    if (!input.enderecoId) throw new Error("Endereço ID é obrigatório");
    if (!input.totalCentavos || input.totalCentavos <= 0) throw new Error("Total deve ser maior que zero");
    if (!input.formaPagamento) throw new Error("Forma de pagamento é obrigatória");
    
    // Criar entidade do pedido
    const pedido = Pedido.create(
      input.clienteId,
      input.enderecoId,
      input.subTotalCentavos || input.totalCentavos,
      input.taxaEntregaCentavos || 0,
      input.totalCentavos,
      input.formaPagamento as any, // Cast para FormaPagamento
      input.trocoParaCentavos || 0,
      "recebido" as any, // Status inicial (minúsculo)
      input.observacoes || "",
      new Date(), // Data do pedido
      null as any, // Data de entrega (será definida depois)
      input.pagamentoId || "", // ID do pagamento (pode ser vazio inicialmente)
      "pendente" as any // Status do pagamento inicial (minúsculo)
    );
    
    logger.audit("CRIAR_PEDIDO", "pedido", {
      clienteId: input.clienteId,
      enderecoId: input.enderecoId,
      totalCentavos: input.totalCentavos,
      formaPagamento: input.formaPagamento
    });
    
    // Salvar no repositório
    const pedidoSalvo = await this.pedidoRepository?.salvarPedido(pedido);
    if (!pedidoSalvo) throw new Error("Erro ao salvar pedido");
    
    logger.info("Pedido criado com sucesso", {
      pedidoId: pedidoSalvo.id,
      totalCentavos: pedidoSalvo.totalCentavos
    });
    
    return pedidoSalvo;
  }
}

type CriarPedidoInput = {
  clienteId: string;
  enderecoId: number;
  subTotalCentavos?: number;
  taxaEntregaCentavos?: number;
  totalCentavos: number;
  formaPagamento: "DINHEIRO" | "PIX" | "CREDIT_CARD";
  trocoParaCentavos?: number;
  observacoes?: string;
  pagamentoId?: string;
}; 