import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
};

function gerarCelularAleatorio(ddd = "82") {
  const prefixo = "9";
  const numero = Math.floor(10000000 + Math.random() * 90000000);
  return ddd + prefixo + numero;
}

test("Deve criar um cliente", async function () {
  const input = {
    nome: "Iago Mauricio",
    telefone: gerarCelularAleatorio(),
    endereco: {
      rua: "Rua das Flores",
      complemento: "apto 403",
      numero: "123",
      bairro: "Centro",
      pontoReferencia: "uninassau",
      cep: "12345-678",
    },
  };
  const response = await axios.post("http://localhost:3000/clientes", input);
  expect(response.status).toBe(200);
  expect(response.data.clienteId).toBeDefined();
  expect(response.data.nome).toBe(input.nome);
  expect(response.data.telefone).toBe(input.telefone);
  expect(response.data.enderecoCadastrado).toBe(true);
});
