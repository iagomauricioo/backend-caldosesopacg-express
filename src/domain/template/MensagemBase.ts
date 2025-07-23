import Endereco from "../entity/Endereco.entity";

export default abstract class MensagemBase {
    constructor(
        public readonly numero: string,
        public readonly nome: string,
        public readonly endereco?: Endereco,
    ) {}

    public abstract getMensagem(): string;
    public abstract getNumero(): string;
}