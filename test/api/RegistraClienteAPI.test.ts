import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
};

function gerarCelularAleatorio(ddd = "82") {
  const prefixo = "9";
  const numero = Math.floor(10000000 + Math.random() * 90000000);
  return ddd + prefixo + numero;
}

function gerarCpfAleatorio() {
  // Gera os 9 primeiros dígitos aleatoriamente
  let cpf = "";
  for (let i = 0; i < 9; i++) {
    cpf += Math.floor(Math.random() * 10);
  }
  
  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;
  cpf += digito1;
  
  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;
  cpf += digito2;
  
  return cpf;
}

test("Deve criar um cliente", async function () {
  const input = {
    "nome": "Iago Mauricio dos Santos Silva",
    "telefone": "88991021732",
    "cpf": gerarCpfAleatorio(),
    "endereco": {
      "rua": "Quadra 19",
      "complemento": "",
      "numero": "36",
      "bairro": "Canto da Saudade",
      "pontoReferencia": "Próximo a casa do lucas lima",
      "cep": "57241040"
    }
  };
  const response = await axios.post("http://localhost:8080/api/v1/clientes", input);
  expect(response.status).toBe(201);
  expect(response.data.success).toBe(true);
  expect(response.data.statusCode).toBe(201);
  expect(response.data.message).toBe("Cliente registrado com sucesso");
  expect(response.data.data.clienteId).toBeDefined();
  expect(response.data.data.nome).toBe(input.nome);
  expect(response.data.data.telefone).toBe(input.telefone);
  expect(response.data.data.enderecoCadastrado.rua).toBe(input.endereco.rua);
  expect(response.data.data.enderecoCadastrado.complemento).toBe(input.endereco.complemento);
  expect(response.data.data.enderecoCadastrado.numero).toBe(input.endereco.numero);
  expect(response.data.data.enderecoCadastrado.bairro).toBe(input.endereco.bairro);
  expect(response.data.data.enderecoCadastrado.pontoReferencia).toBe(input.endereco.pontoReferencia);
  expect(response.data.data.enderecoCadastrado.cep).toBe(input.endereco.cep);
});

test("Deve retornar erro 422 para CPF inválido", async function () {
  const input = {
    "nome": "João Silva",
    "telefone": "88991021732",
    "cpf": "12345678901",
    "endereco": {
      "rua": "Rua das Flores",
      "complemento": "",
      "numero": "123",
      "bairro": "Centro",
      "pontoReferencia": "Próximo ao shopping",
      "cep": "57241040"
    }
  };
  const response = await axios.post("http://localhost:8080/api/v1/clientes", input);
  expect(response.status).toBe(422);
  expect(response.data.success).toBe(false);
  expect(response.data.statusCode).toBe(422);
  expect(response.data.error).toBe("CPF inválido");
});

test("Deve retornar erro 409 para CPF duplicado", async function () {
  const cpfDuplicado = gerarCpfAleatorio();
  
  // Primeiro cliente com o CPF
  const input1 = {
    "nome": "João Silva",
    "telefone": "88991021733",
    "cpf": cpfDuplicado,
    "endereco": {
      "rua": "Rua das Flores",
      "complemento": "",
      "numero": "123",
      "bairro": "Centro",
      "pontoReferencia": "Próximo ao shopping",
      "cep": "57241040"
    }
  };
  
  // Segundo cliente com o mesmo CPF
  const input2 = {
    "nome": "Maria Silva",
    "telefone": "88991021734",
    "cpf": cpfDuplicado,
    "endereco": {
      "rua": "Rua das Palmeiras",
      "complemento": "",
      "numero": "456",
      "bairro": "Jardim",
      "pontoReferencia": "Próximo ao mercado",
      "cep": "57241040"
    }
  };
  
  // Primeira requisição deve funcionar
  const response1 = await axios.post("http://localhost:8080/api/v1/clientes", input1);
  expect(response1.status).toBe(201);
  
  // Segunda requisição deve falhar com 409
  const response2 = await axios.post("http://localhost:8080/api/v1/clientes", input2);
  expect(response2.status).toBe(409);
  expect(response2.data.success).toBe(false);
  expect(response2.data.statusCode).toBe(409);
  expect(response2.data.error).toBe("CPF já cadastrado no sistema");
});