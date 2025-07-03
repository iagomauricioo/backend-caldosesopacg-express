export interface VariacaoProduto {
  tamanho_ml: number;
  nome_tamanho: string;
  preco_centavos: number;
}

export default class Produto {
  private id: number;
  private nome: string;
  private descricao: string;
  private disponivel: boolean;
  private ordem_exibicao: number;
  private variacoes: VariacaoProduto[];
  private imagem_url: string;
  
  constructor(id: number, nome: string, descricao: string, disponivel: boolean, ordem_exibicao: number, variacoes: VariacaoProduto[] = [], imagem_url: string) {
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
    this.variacoes = variacoes;
    this.imagem_url = imagem_url;
  }

  static create(nome: string, descricao: string, disponivel: boolean, ordem_exibicao: number, variacoes: VariacaoProduto[] = [], imagem_url: string) {
    return new Produto(0, nome, descricao, disponivel, ordem_exibicao, variacoes, imagem_url);
  }

  // Método para compatibilidade com a versão anterior
  static createComVariacaoUnica(nome: string, descricao: string, disponivel: boolean, ordem_exibicao: number, tamanho_ml: number, nome_tamanho: string, preco_centavos: number, imagem_url: string) {
    const variacao: VariacaoProduto = {
      tamanho_ml,
      nome_tamanho,
      preco_centavos
    };
    return new Produto(0, nome, descricao, disponivel, ordem_exibicao, [variacao], imagem_url);
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

  getVariacoes() {
    return this.variacoes;
  }

  // Métodos para compatibilidade com a versão anterior
  getTamanhoMl() {
    return this.variacoes.length > 0 ? this.variacoes[0].tamanho_ml : 0;
  }

  getNomeTamanho() {
    return this.variacoes.length > 0 ? this.variacoes[0].nome_tamanho : '';
  }

  getPrecoCentavos() {
    return this.variacoes.length > 0 ? this.variacoes[0].preco_centavos : 0;
  }

  getImagemUrl() {
    return this.imagem_url;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      disponivel: this.disponivel,
      ordem_exibicao: this.ordem_exibicao,
      variacoes: this.variacoes,
      imagem_url: this.imagem_url
    };
  }

  toString() {
    return `${this.nome} - ${this.descricao} - ${this.disponivel ? "Disponível" : "Indisponível"} - Ordem de exibição: ${this.ordem_exibicao} - Imagem: ${this.imagem_url}`;
  }
}