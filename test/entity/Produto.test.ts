import Produto from "../../src/domain/entity/Produto.entity";

test("Deve criar um produto válido", function () {
  const variacao = {
    tamanho_ml: 1000,
    nome_tamanho: "1L",
    preco_centavos: 1000
  };
  const produto = new Produto(0, "Caldo de Feijão", "Delicioso caldo de feijão", true, 1, [variacao], "imagem1.jpg");
  expect(produto).toBeDefined();
});   

test("Não deve criar um produto com nome inválido", function () {
  expect(
    () => new Produto(0, "", "Delicioso caldo de feijão", true, 1, [], "imagem1.jpg")
  ).toThrow(new Error("Nome inválido"));
});

test("Não deve criar um produto com descrição inválida", function () {
  expect(
    () => new Produto(0, "Caldo de Feijão", "", true, 1, [], "imagem1.jpg")
  ).toThrow(new Error("Descrição inválida"));
});

test("Deve testar o toString", function () {
  const variacao = {
    tamanho_ml: 1000,
    nome_tamanho: "1L",
    preco_centavos: 1000
  };
  const produto = new Produto(0, "Caldo de Feijão", "Delicioso caldo de feijão", true, 1, [variacao], "imagem1.jpg");
  expect(produto.toString()).toBe(
    "Caldo de Feijão - Delicioso caldo de feijão - Disponível - Ordem de exibição: 1 - Imagem: imagem1.jpg"
  );
});

test("Deve testar o toString para produto indisponível", function () {
  const produto = new Produto(0, "Caldo de Feijão", "Delicioso caldo de feijão", false, 1, [], "imagem1.jpg");
  expect(produto.toString()).toBe(
    "Caldo de Feijão - Delicioso caldo de feijão - Indisponível - Ordem de exibição: 1 - Imagem: imagem1.jpg"
  );
});

test("Deve converter produto para JSON", function () {
  const variacao = {
    tamanho_ml: 1000,
    nome_tamanho: "1L",
    preco_centavos: 1000
  };
  const produto = new Produto(42, "Caldo de Feijão", "Delicioso caldo de feijão", true, 1, [variacao], "imagem1.jpg");
  const json = produto.toJSON();
  expect(json).toEqual({
    id: 42,
    nome: "Caldo de Feijão",
    descricao: "Delicioso caldo de feijão",
    disponivel: true,
    ordem_exibicao: 1,
    variacoes: [variacao],
    imagem_url: "imagem1.jpg"
  });
});

test("Deve criar produto com método de compatibilidade", function () {
  const produto = Produto.createComVariacaoUnica("Caldo de Feijão", "Delicioso caldo de feijão", true, 1, 1000, "1L", 1000, "imagem1.jpg");
  expect(produto.getTamanhoMl()).toBe(1000);
  expect(produto.getNomeTamanho()).toBe("1L");
  expect(produto.getPrecoCentavos()).toBe(1000);
});

test("Deve criar produto usando método create", function () {
  const variacao = {
    tamanho_ml: 500,
    nome_tamanho: "500ml",
    preco_centavos: 500
  };
  const produto = Produto.create("Caldo de Feijão", "Delicioso caldo de feijão", true, 1, [variacao], "imagem1.jpg");
  expect(produto.getId()).toBe(0);
  expect(produto.getNome()).toBe("Caldo de Feijão");
  expect(produto.getDescricao()).toBe("Delicioso caldo de feijão");
  expect(produto.getDisponivel()).toBe(true);
  expect(produto.getOrdemExibicao()).toBe(1);
  expect(produto.getVariacoes()).toEqual([variacao]);
  expect(produto.getImagemUrl()).toBe("imagem1.jpg");
});

test("Deve retornar valores padrão para métodos de compatibilidade quando não há variações", function () {
  const produto = new Produto(0, "Caldo de Feijão", "Delicioso caldo de feijão", true, 1, [], "imagem1.jpg");
  expect(produto.getTamanhoMl()).toBe(0);
  expect(produto.getNomeTamanho()).toBe('');
  expect(produto.getPrecoCentavos()).toBe(0);
});

test("Deve retornar primeira variação para métodos de compatibilidade", function () {
  const variacao1 = {
    tamanho_ml: 500,
    nome_tamanho: "500ml",
    preco_centavos: 500
  };
  const variacao2 = {
    tamanho_ml: 1000,
    nome_tamanho: "1L",
    preco_centavos: 1000
  };
  const produto = new Produto(0, "Caldo de Feijão", "Delicioso caldo de feijão", true, 1, [variacao1, variacao2], "imagem1.jpg");
  expect(produto.getTamanhoMl()).toBe(500);
  expect(produto.getNomeTamanho()).toBe("500ml");
  expect(produto.getPrecoCentavos()).toBe(500);
});
