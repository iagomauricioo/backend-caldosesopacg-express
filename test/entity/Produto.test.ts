import Produto from "../../src/domain/entity/Produto.entity";

test("Deve criar um produto válido", function () {
  const variacao = {
    tamanho_ml: 1000,
    nome_tamanho: "1L",
    preco_centavos: 1000
  };
  const produto = new Produto(0, "Caldo de Feijão", "Delicioso caldo de feijão", true, 1, [variacao]);
  expect(produto).toBeDefined();
});   

test("Não deve criar um produto com nome inválido", function () {
  expect(
    () => new Produto(0, "", "Delicioso caldo de feijão", true, 1, [])
  ).toThrow(new Error("Nome inválido"));
});

test("Deve testar o toString", function () {
  const variacao = {
    tamanho_ml: 1000,
    nome_tamanho: "1L",
    preco_centavos: 1000
  };
  const produto = new Produto(0, "Caldo de Feijão", "Delicioso caldo de feijão", true, 1, [variacao]);
  expect(produto.toString()).toBe(
    "Caldo de Feijão - Delicioso caldo de feijão - Disponível - Ordem de exibição: 1"
  );
});

test("Deve converter produto para JSON", function () {
  const variacao = {
    tamanho_ml: 1000,
    nome_tamanho: "1L",
    preco_centavos: 1000
  };
  const produto = new Produto(42, "Caldo de Feijão", "Delicioso caldo de feijão", true, 1, [variacao]);
  const json = produto.toJSON();
  expect(json).toEqual({
    id: 42,
    nome: "Caldo de Feijão",
    descricao: "Delicioso caldo de feijão",
    disponivel: true,
    ordem_exibicao: 1,
    variacoes: [variacao]
  });
});

test("Deve criar produto com método de compatibilidade", function () {
  const produto = Produto.createComVariacaoUnica("Caldo de Feijão", "Delicioso caldo de feijão", true, 1, 1000, "1L", 1000);
  expect(produto.getTamanhoMl()).toBe(1000);
  expect(produto.getNomeTamanho()).toBe("1L");
  expect(produto.getPrecoCentavos()).toBe(1000);
});
