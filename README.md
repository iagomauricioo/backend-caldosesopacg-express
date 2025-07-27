# Back-end do projeto Caldos e Sopas da Cynthia

API REST para gerenciamento de clientes e pedidos do sistema de caldos e sopas.

## 🚀 Tecnologias

- **Node.js** com TypeScript
- **Express.js** para API REST
- **PostgreSQL** como banco de dados
- **Jest** para testes
- **Sinon** para mocks
- **Docker** para containerização
- **Evolution API** para integração com WhatsApp
- **Redis** para cache da Evolution API

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

### 4. Configure a Evolution API (WhatsApp)
```bash
# Navegue para a pasta da Evolution API
cd evolution_api/

# Crie o arquivo .env com as configurações necessárias
cp .env.example .env  # Se existir um exemplo
# Ou crie manualmente o arquivo .env com as seguintes variáveis:
# DATABASE_PASSWORD=sua_senha_aqui
# AUTHENTICATION_TYPE=apikey
# AUTHENTICATION_API_KEY=sua_api_key_aqui
# AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true

# Inicie a Evolution API
docker-compose up -d
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

### Evolution API
```bash
# Inicia a Evolution API
cd evolution_api/
docker-compose up -d

# Para a Evolution API
docker-compose down

# Remove containers e volumes da Evolution API
docker-compose down -v
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

evolution_api/            # Evolution API para WhatsApp
└── docker-compose.yaml  # Configuração da Evolution API
```

### Docker Compose
O arquivo `docker-compose.yml` na raiz do projeto configura:
- PostgreSQL na porta 5432
- Usuário: postgres
- Senha: 123456
- Database: app

### Evolution API
O arquivo `evolution_api/docker-compose.yaml` configura:
- Evolution API na porta 8081
- PostgreSQL na porta 5434
- Redis na porta 6379
- Volumes para persistência de dados

## 🔧 Configuração da Evolution API

A Evolution API é utilizada para integração com WhatsApp. Para configurar:

1. **Crie o arquivo `.env` na pasta `evolution_api/`:**
```env
DATABASE_PASSWORD=sua_senha_aqui
AUTHENTICATION_TYPE=apikey
AUTHENTICATION_API_KEY=sua_api_key_aqui
AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true
```

2. **Inicie os serviços:**
```bash
cd evolution_api/
docker-compose up -d
```

3. **Configure uma instância do WhatsApp:**
- Acesse `http://localhost:8081`
- Crie uma nova instância
- Escaneie o QR Code com seu WhatsApp

## 🐛 Troubleshooting

### Problemas comuns

1. **Erro de conexão com banco:**
   - Verifique se o Docker está rodando
   - Execute `npm run docker:start`
   - Aguarde alguns segundos para o banco inicializar

2. **Erro de dependências:**
   - Delete `node_modules` e `package-lock.json`
   - Execute `npm install` novamente

3. **Problemas com Evolution API:**
   - Verifique se as portas 8081, 5434 e 6379 estão disponíveis
   - Verifique se o arquivo `.env` está configurado corretamente
   - Execute `docker-compose logs evolution-api` para ver logs

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm test` - Executa testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run docker:start` - Inicia containers Docker
- `npm run docker:stop` - Para containers Docker
- `npm run docker:clean` - Remove containers e volumes