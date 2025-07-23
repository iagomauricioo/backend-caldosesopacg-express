import Endereco from "../../entity/Endereco.entity";

export default class SaiuParaEntrega {
	constructor(
		public readonly numero: string,
		public readonly nome: string,
		public readonly endereco: Endereco,
	) {}

    public getMensagem() {
        return `
🍲 *Caldos da Cynthia* 🍲

Olá, ${this.nome}! 😊

Seu delicioso pedido saiu para entrega e logo estará quentinho aí na sua casa!

📦 *Detalhes da Entrega:*
🕐 Hora de saída: ${new Date().toLocaleTimeString('pt-BR')}
📍 Endereço: ${this.endereco.toString()}

🚚 Nosso entregador está a caminho com todo carinho e cuidado que seus caldos merecem!

Obrigada pela preferência! ❤️

*Caldos da Cynthia - Sabor que aquece o coração* 🔥`;
    }

    public getNumero() {
        return this.numero;
    }    
}