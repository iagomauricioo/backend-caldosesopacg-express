export default class Produto {
  private id: number;
  private nome: string;
  private descricao: string;
  private disponivel: boolean;
  private ordem_exibicao: number;
  private tamanho_ml: number;
  private nome_tamanho: string;
  private preco_centavos: number;
  
  constructor(id: number, nome: string, descricao: string, disponivel: boolean, ordem_exibicao: number, tamanho_ml: number, nome_tamanho: string, preco_centavos: number) {
    this.id = id;
    if (!nome) {
      throw new Error("Nome inválido");
    }
    this.nome = nome;
    if (!descricao) {
      throw new Error("Descrição inválida");
    }
    this.descricao = descricao;
    this.disponivel = disponivel;
    this.ordem_exibicao = ordem_exibicao;
    this.tamanho_ml = tamanho_ml;
    this.nome_tamanho = nome_tamanho;
    this.preco_centavos = preco_centavos;
  }

  static create(nome: string, descricao: string, disponivel: boolean, ordem_exibicao: number, tamanho_ml: number, nome_tamanho: string, preco_centavos: number) {
    return new Produto(0, nome, descricao, disponivel, ordem_exibicao, tamanho_ml, nome_tamanho, preco_centavos);
  }

  getId() {
    return this.id;
  }

  getNome() {
    return this.nome;
  }
  
  getDescricao() {
    return this.descricao;
  }

  getDisponivel() {
    return this.disponivel;
  }
  
  getOrdemExibicao() {
    return this.ordem_exibicao;
  }

  getTamanhoMl() {
    return this.tamanho_ml;
  }

  getNomeTamanho() {
    return this.nome_tamanho;
  }

  getPrecoCentavos() {
    return this.preco_centavos;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      disponivel: this.disponivel,
      ordem_exibicao: this.ordem_exibicao,
      tamanho_ml: this.tamanho_ml,
      nome_tamanho: this.nome_tamanho,
      preco_centavos: this.preco_centavos
    };
  }

  toString() {
    return `${this.nome} - ${this.descricao} - ${this.disponivel ? "Disponível" : "Indisponível"} - Ordem de exibição: ${this.ordem_exibicao}`;
  }
}