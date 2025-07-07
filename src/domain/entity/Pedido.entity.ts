import UUID from "../vo/UUID";

enum FormaPagamento {
    DINHEIRO = "DINHEIRO",
    PIX = "PIX",
    CREDIT_CARD = "CREDIT_CARD"
}

enum Status {
    RECEBIDO = "RECEBIDO",
    PREPARANDO = "PREPARANDO",
    SAIU_ENTREGA = "SAIU_ENTREGA",
    ENTREGUE = "ENTREGUE",
    CANCELADO = "CANCELADO"
}

export default class Pedido {
	private id: number;
	private clienteId: UUID;
	private enderecoId: number;
    private subTotalCentavos: number;
    private taxaEntregaCentavos: number;
    private totalCentavos: number;
    private formaPagamento: FormaPagamento;
    private trocoParaCentavos: number;
    private status: Status;
    private observacoes: string;
    private dataPedido: Date;
    private dataEntrega: Date;
    private pagamentoId: string;
    private pagamentoStatus: string;

	constructor (id: number, clienteId: string, enderecoId: number, subTotalCentavos: number, taxaEntregaCentavos: number, totalCentavos: number, formaPagamento: FormaPagamento, trocoParaCentavos: number, status: Status, observacoes: string, dataPedido: Date, dataEntrega: Date, pagamentoId: string, pagamentoStatus: string) {
		this.id = id;
		this.clienteId = new UUID(clienteId);
		this.enderecoId = enderecoId;
		this.subTotalCentavos = subTotalCentavos;
		this.taxaEntregaCentavos = taxaEntregaCentavos;
		this.totalCentavos = totalCentavos;
		this.formaPagamento = formaPagamento as FormaPagamento;
		this.trocoParaCentavos = trocoParaCentavos;
		this.status = status as Status;
		this.observacoes = observacoes;
		this.dataPedido = dataPedido;
		this.dataEntrega = dataEntrega;
		this.pagamentoId = pagamentoId;
		this.pagamentoStatus = pagamentoStatus;
	}

	static create (clienteId: string, enderecoId: number, subTotalCentavos: number, taxaEntregaCentavos: number, totalCentavos: number, formaPagamento: FormaPagamento, trocoParaCentavos: number, status: Status, observacoes: string, dataPedido: Date, dataEntrega: Date, pagamentoId: string, pagamentoStatus: string) {
		return new Pedido(0, clienteId, enderecoId, subTotalCentavos, taxaEntregaCentavos, totalCentavos, formaPagamento, trocoParaCentavos, status, observacoes, dataPedido, dataEntrega, pagamentoId, pagamentoStatus);
	}

	getId() {
		return this.id;
	}

	getClienteId () {
		return this.clienteId.getValue();
	}

    getEnderecoId () {
        return this.enderecoId;
    }

    getSubTotalCentavos () {
        return this.subTotalCentavos;
    }

    getTaxaEntregaCentavos () {
        return this.taxaEntregaCentavos;
    }

    getTotalCentavos () {
        return this.totalCentavos;
    }

    getFormaPagamento () {
        return this.formaPagamento;
    }

    getTrocoParaCentavos () {
        return this.trocoParaCentavos;
    }

    getStatus () {
        return this.status;
    }

    getObservacoes () {
        return this.observacoes;
    }

    getDataPedido () {
        return this.dataPedido;
    }

    getDataEntrega () {
        return this.dataEntrega;
    }

    getPagamentoId () {
        return this.pagamentoId;
    }

    getPagamentoStatus () {
        return this.pagamentoStatus;
    }

    toJSON () {
        return {
            id: this.id,
            clienteId: this.clienteId.getValue(),
            enderecoId: this.enderecoId,
            subTotalCentavos: this.subTotalCentavos,
            taxaEntregaCentavos: this.taxaEntregaCentavos,
            totalCentavos: this.totalCentavos,
            formaPagamento: this.formaPagamento,
            trocoParaCentavos: this.trocoParaCentavos,
            status: this.status,
            observacoes: this.observacoes,
            dataPedido: this.dataPedido,
            dataEntrega: this.dataEntrega,
            pagamentoId: this.pagamentoId,
            pagamentoStatus: this.pagamentoStatus
        };
    }

    toString () {
        return JSON.stringify(this.toJSON());
    }
}