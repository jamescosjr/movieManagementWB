# 🎬 Movie Management API - Visão Geral do Projeto

## 📊 Status do Projeto

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green)
![Tests](https://img.shields.io/badge/Tests-Jest-red)
![Coverage](https://img.shields.io/badge/Coverage-80%25+-brightgreen)

**Status**: ✅ Em Produção  
**Versão**: 1.0.0  
**Última Atualização**: Novembro 2025

---

## 🎯 Sobre o Projeto

API RESTful completa para gerenciamento de filmes com arquitetura em camadas, seguindo princípios de Clean Architecture e Domain-Driven Design.

### Principais Características

✨ **Arquitetura em Camadas**
- Separação clara de responsabilidades
- CQRS Pattern (Read/Write repositories)
- Error handling centralizado

🔒 **Qualidade de Código**
- Cobertura de testes >= 80%
- ESLint configurado
- Padrões de código bem definidos

📚 **Documentação Completa**
- Guias para desenvolvedores
- Documentação específica para AI agents
- Checklists e referências rápidas

🚀 **Performance**
- Paginação em todos endpoints
- Queries otimizadas com `.lean()`
- Conexões eficientes com MongoDB

---

## 🏗️ Arquitetura

### Camadas

```
┌─────────────────────────────────────────┐
│           HTTP Layer (Express)          │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│        Application Layer                │
│   Controllers │ Routes │ Middleware     │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│           Domain Layer                  │
│   Services │ Validations │ Errors       │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│       Infrastructure Layer              │
│   Repositories │ Schemas                │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Database (MongoDB)              │
└─────────────────────────────────────────┘
```

### Padrões de Design

- **Repository Pattern** - Abstração de acesso a dados
- **CQRS** - Separação Read/Write
- **Error Handling Pattern** - Erros customizados hierárquicos
- **DTO Pattern** - Transformação de dados

---

## 📁 Estrutura de Diretórios

```
movieManagementWB/
├── 📄 Documentação
│   ├── README.md              # Visão geral da API
│   ├── INDEX.md               # Índice completo
│   ├── AGENT.md               # Guia para AI agents ⭐
│   ├── QUICK_REFERENCE.md     # Referência rápida
│   ├── ARCHITECTURE.md        # Arquitetura detalhada
│   ├── CONTRIBUTING.md        # Como contribuir
│   ├── CODE_STYLE.md          # Padrões de código
│   ├── CHECKLIST.md           # Checklists
│   └── TROUBLESHOOTING.md     # Solução de problemas
│
├── 🔧 Configuração
│   ├── .env.example           # Template de env vars
│   ├── .gitignore             # Arquivos ignorados
│   ├── package.json           # Dependências
│   ├── babel.config.cjs       # Config Babel
│   ├── eslint.config.mjs      # Config ESLint
│   └── server.js              # Entry point
│
├── 📂 src/
│   ├── application/           # Camada de Aplicação
│   │   ├── controllers/       # HTTP handlers
│   │   │   ├── movieController.js
│   │   │   └── routes/
│   │   │       └── routes.js
│   │   └── middleware/
│   │       └── errorHandler.js
│   │
│   ├── domain/                # Camada de Domínio
│   │   ├── services/
│   │   │   └── movieService.js
│   │   ├── error/
│   │   │   └── customErros.js
│   │   └── utils/
│   │       └── validation.js
│   │
│   ├── infrastructure/        # Camada de Infraestrutura
│   │   ├── repository/
│   │   │   ├── movieRepositoryRead.js
│   │   │   └── movieRepositoryWrite.js
│   │   └── schema/
│   │       └── movieSchema.js
│   │
│   ├── contracts/             # API Contracts
│   │   └── contract.yaml
│   │
│   └── __tests__/             # Testes
│       ├── deleteMovie.test.js
│       ├── getAllMovies.test.js
│       ├── registerMovie.test.js
│       ├── searchMovies.test.js
│       ├── updateMovie.test.js
│       └── wakeup.test.js
│
└── 🧪 jest/
    └── jest.setup.js          # Configuração de testes
```

---

## 🔌 API Endpoints

### Movies

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| POST | `/movies` | Criar filme | ✅ |
| GET | `/movies` | Listar todos (paginado) | ✅ |
| GET | `/movies/:title` | Buscar por título | ✅ |
| GET | `/movies/genre/:genre` | Listar por gênero | ✅ |
| GET | `/movies/director/:director` | Listar por diretor | ✅ |
| GET | `/movies/year/:year` | Listar por ano | ✅ |
| PUT | `/movies/:id` | Atualizar filme | ✅ |
| DELETE | `/movies/:id` | Deletar filme | ✅ |
| GET | `/search` | Busca geral | ✅ |
| GET | `/wakeup` | Health check | ✅ |

---

## 🛠️ Stack Tecnológico

### Core
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB 8.x
- **ODM**: Mongoose 8.x

### Desenvolvimento
- **Testes**: Jest 29.x + Supertest
- **Transpiler**: Babel 7.x
- **Linter**: ESLint 9.x
- **Dev Server**: Nodemon 3.x

### Produção
- **Validação**: express-jsonschema + js-yaml
- **CORS**: cors middleware
- **Environment**: dotenv

---

## 📊 Métricas do Projeto

### Código
- **Linhas de Código**: ~2,500
- **Arquivos JavaScript**: 16
- **Testes**: 6 suites
- **Cobertura**: >= 80%

### Documentação
- **Páginas de Docs**: 8 arquivos
- **Palavras**: ~20,000
- **Diagramas**: 5+

### Qualidade
- **Camadas**: 3 (Application, Domain, Infrastructure)
- **Separation of Concerns**: ✅ Alta
- **Testability**: ✅ Alta
- **Maintainability**: ✅ Alta

---

## 🚀 Como Começar

### Pré-requisitos
```bash
Node.js >= 18
MongoDB >= 5.0
npm >= 6
```

### Instalação

```bash
# 1. Clonar repositório
git clone <repository-url>
cd movieManagementWB

# 2. Instalar dependências
npm install

# 3. Configurar ambiente
cp .env.example .env
# Editar .env com suas configurações

# 4. Iniciar MongoDB
sudo systemctl start mongod

# 5. Rodar em desenvolvimento
npm run dev

# 6. Rodar testes
npm test
```

### Verificação
```bash
# Health check
curl http://localhost:3000/wakeup

# Resposta esperada
{"message":"I'm awake!"}
```

---

## 📚 Guias de Uso

### Para Desenvolvedores

**Primeiro Acesso**:
1. Ler [README.md](../README.md)
2. Ler [CONTRIBUTING.md](../CONTRIBUTING.md)
3. Configurar ambiente
4. Executar testes

**Desenvolvimento**:
1. Consultar [CODE_STYLE.md](../CODE_STYLE.md)
2. Seguir [CHECKLIST.md](../CHECKLIST.md)
3. Ver [ARCHITECTURE.md](../ARCHITECTURE.md) para dúvidas

**Problemas**:
1. [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)

### Para AI Agents

**SEMPRE**:
1. Ler [AGENT.md](../AGENT.md) ⭐
2. Usar [QUICK_REFERENCE.md](../QUICK_REFERENCE.md)
3. Seguir [CHECKLIST.md](../CHECKLIST.md)

**Referências**:
- [INDEX.md](../INDEX.md) - Encontrar qualquer informação

---

## 🎯 Princípios do Projeto

### Design
- ✅ Separation of Concerns
- ✅ Single Responsibility
- ✅ Don't Repeat Yourself (DRY)
- ✅ Keep It Simple (KISS)
- ✅ SOLID principles

### Código
- ✅ ES6+ modules
- ✅ Async/await over callbacks
- ✅ Error handling em todas camadas
- ✅ Validação em múltiplos níveis
- ✅ Testes abrangentes

### Documentação
- ✅ Completa e atualizada
- ✅ Exemplos práticos
- ✅ Guias para diferentes públicos
- ✅ Troubleshooting detalhado

---

## 🔄 Workflow de Desenvolvimento

```
┌─────────────────┐
│  Criar Branch   │
└────────┬────────┘
         │
┌────────▼────────┐
│ Implementar     │
│ (seguir docs)   │
└────────┬────────┘
         │
┌────────▼────────┐
│ Escrever Testes │
└────────┬────────┘
         │
┌────────▼────────┐
│   npm test      │
└────────┬────────┘
         │
┌────────▼────────┐
│ Verificar       │
│ Checklists      │
└────────┬────────┘
         │
┌────────▼────────┐
│  Criar PR       │
└─────────────────┘
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia:

1. [CONTRIBUTING.md](../CONTRIBUTING.md) - Workflow completo
2. [CODE_STYLE.md](../CODE_STYLE.md) - Padrões de código
3. [CHECKLIST.md](../CHECKLIST.md) - Antes de PR

### Tipos de Contribuição
- 🐛 Bug fixes
- ✨ Novas features
- 📝 Documentação
- 🧪 Testes
- ♻️ Refatoração

---

## 📞 Suporte

### Recursos
- **Documentação**: Ver [INDEX.md](../INDEX.md)
- **Issues**: GitHub Issues
- **Troubleshooting**: [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)

### Antes de Abrir Issue
1. Verificar [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
2. Pesquisar issues existentes
3. Ter informações completas (erro, ambiente, passos)

---

## 🗺️ Roadmap

### v1.0.0 (Atual) ✅
- [x] CRUD completo de filmes
- [x] Paginação
- [x] Busca por múltiplos campos
- [x] Testes >= 80% cobertura
- [x] Documentação completa

### v1.1.0 (Planejado)
- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] Cache com Redis
- [ ] Logging estruturado

### v2.0.0 (Futuro)
- [ ] GraphQL API
- [ ] Microservices architecture
- [ ] Docker compose
- [ ] CI/CD pipeline

---

## 📄 Licença

Este projeto é open source sob a [MIT License](../LICENSE).

---

## 📊 Estatísticas

**Iniciado**: 2025  
**Mantenedores**: 1  
**Contribuidores**: Open to contributions  
**Stars**: ⭐ (dê uma estrela!)

---

## 🙏 Agradecimentos

- Express.js team
- Mongoose maintainers
- Jest contributors
- Todos os contribuidores

---

**Mantenha este projeto com alta qualidade!** 🚀

Para mais informações, consulte a [documentação completa](../INDEX.md).
