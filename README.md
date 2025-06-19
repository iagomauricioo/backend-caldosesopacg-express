# Back-end do projeto Caldos e Sopas da Cynthia

API REST para gerenciamento de clientes e pedidos do sistema de caldos e sopas.

## 🚀 Tecnologias

- **Node.js** com TypeScript
- **Express.js** para API REST
- **PostgreSQL** como banco de dados
- **Jest** para testes
- **Sinon** para mocks
- **Docker** para containerização

## 📋 Pré-requisitos

- Node.js (versão 20 ou superior)
- Docker e Docker Compose
- npm

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd backend-caldos-express/
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Inicie o PostgreSQL com Docker
npm run docker:start

# Aguarde alguns segundos para o banco inicializar
```



## 🏃‍♂️ Como Executar

### Desenvolvimento
```bash
# Inicia o servidor em modo desenvolvimento com hot reload
npm run dev
```

### Testes
```bash
# Executa todos os testes
npm test

# Executa testes em modo watch
npm run test:watch
```

### Docker
```bash
# Inicia os containers
npm run docker:start

# Para os containers
npm run docker:stop

# Remove containers e volumes
npm run docker:clean
```

## 📡 Endpoints da API

### Com Postman
1. Importe a collection `openapi.json`
2. Configure a URL base: `http://localhost:3000`
3. Use os exemplos JSON acima

## 🏗️ Estrutura do Projeto

```
src/
├── application/          # Casos de uso
│   └── usecase/
├── domain/              # Entidades e regras de negócio
│   ├── entity/
│   └── vo/
├── infra/               # Infraestrutura
│   ├── controller/      # Controllers HTTP
│   ├── database/        # Conexão com banco
│   ├── repository/      # Repositórios
│   └── di/              # Injeção de dependência
└── main.ts              # Ponto de entrada
```

### Docker Compose
O arquivo `docker-compose.yml` na raiz do projeto configura:
- PostgreSQL na porta 5432
- Usuário: postgres
- Senha: 123456
- Database: app

## 🐛 Troubleshooting

### Problemas comuns

1. **Erro de conexão com banco:**
   - Verifique se o Docker está rodando
   - Execute `npm run docker:start`
   - Aguarde alguns segundos para o banco inicializar

2. **Erro de dependências:**
   - Delete `node_modules` e `package-lock.json`
   - Execute `npm install` novamente

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm test` - Executa testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run docker:start` - Inicia containers Docker
- `npm run docker:stop` - Para containers Docker
- `npm run docker:clean` - Remove containers e volumes