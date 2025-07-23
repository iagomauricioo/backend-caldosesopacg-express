import Endereco from "../../entity/Endereco.entity";
import MensagemBase from "../MensagemBase";

export default class RecebemosSeuPedido extends MensagemBase {

    constructor(numero: string, nome: string, endereco?: Endereco) {
        super(numero, nome, endereco);
    }

    public getMensagem(): string {
        return `
🍲 *Caldos da Cynthia* 🍲

Olá ${this.nome}! 😊

✅ *Pedido Confirmado!* 

Recebemos seu pedido com sucesso e já estamos preparando seus caldos com todo carinho!

📋 *Dados do Pedido:*
📍 Endereço: ${this.endereco?.toString()}

👩‍🍳 Sua Cynthia já está na cozinha preparando seus caldos fresquinhos!

⏰ Em breve você receberá uma nova mensagem confirmando que seu pedido saiu para entrega.

Obrigada pela confiança! ❤️

*Caldos da Cynthia - Sabor que aquece o coração* 🔥`
    }

    public getNumero(): string {
        return this.numero;
    }
}