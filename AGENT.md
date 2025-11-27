# Guia para Agents - Movie Management API

## 📋 Visão Geral do Projeto

Este é um projeto de **API RESTful para Gerenciamento de Filmes** desenvolvido com Node.js, Express e MongoDB. O projeto segue uma arquitetura em camadas (Domain-Driven Design adaptado) com clara separação de responsabilidades.

## 🏗️ Arquitetura do Projeto

### Estrutura de Camadas

```
📁 src/
├── 📁 application/         # Camada de Aplicação (Controllers e Rotas)
│   ├── controllers/        # Handlers das requisições HTTP
│   ├── middleware/         # Middlewares (error handler)
│   └── routes/            # Definição de rotas
├── 📁 domain/             # Camada de Domínio (Regras de Negócio)
│   ├── services/          # Lógica de negócio
│   ├── error/             # Erros customizados
│   └── utils/             # Validações e utilitários
├── 📁 infrastructure/      # Camada de Infraestrutura (Banco de Dados)
│   ├── repository/        # Repositórios (Read/Write)
│   └── schema/            # Schemas do Mongoose
└── 📁 contracts/          # Contratos OpenAPI/Swagger
```

### Princípios de Design

1. **Separação de Responsabilidades**: Cada camada tem um propósito específico
2. **CQRS Pattern**: Repositórios separados para leitura e escrita
3. **Error Handling Centralizado**: Middleware dedicado para tratamento de erros
4. **Validação em Múltiplas Camadas**: Schema YAML + validações customizadas
5. **Paginação**: Todas as consultas de listagem suportam paginação

## 🎯 Regras de Desenvolvimento

### 1. Padrões de Código

#### Estilo e Formatação
- **ESLint**: Configurado com `@eslint/js` e globals
- **Babel**: Transpilação para ES6+ com preset-env
- **Modules**: Usar ES6 modules (`import/export`), não CommonJS
- **Naming**:
  - Arquivos: camelCase (ex: `movieController.js`)
  - Funções: camelCase descritivo (ex: `registerMovieHandler`)
  - Classes: PascalCase (ex: `AppError`, `ValidationError`)
  - Constantes: UPPER_SNAKE_CASE quando aplicável

#### Estrutura de Funções
```javascript
// ✅ CORRETO - Async/await com try-catch
export async function functionName(params) {
    try {
        const result = await someAsyncOperation();
        return result;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

// ❌ EVITAR - Promises sem estrutura adequada
export function functionName(params) {
    return someAsyncOperation().then(result => result);
}
```

### 2. Fluxo de Dados

#### Request → Response Flow
```
HTTP Request
    ↓
Router (routes.js)
    ↓
Controller Handler (movieController.js)
    ↓ [validação de dados]
Service (movieService.js)
    ↓ [lógica de negócio]
Repository (movieRepository*.js)
    ↓ [acesso ao banco]
MongoDB (via Mongoose)
    ↓
Response ← Error Handler (se erro)
```

### 3. Convenções de API

#### Request Body (POST/PUT)
```json
{
  "title": "string (obrigatório, não vazio)",
  "director": "string (obrigatório, não vazio)",
  "genre": "string (obrigatório, não vazio)",
  "year": "number (obrigatório, 1000 <= year <= ano atual)"
}
```

#### Response Padrão (Listagens)
```json
{
  "data": [...],
  "currentPage": 1,
  "totalCount": 100,
  "totalPages": 10
}
```

#### Query Parameters (Paginação)
- `page`: número da página (default: 1, mínimo: 1)
- `limit`: itens por página (default: 10, mínimo: 1)

#### Error Response
```json
{
  "message": "Descrição do erro"
}
```

### 4. Tratamento de Erros

#### Hierarquia de Erros
```javascript
AppError (500)
├── NotFoundError (404)
└── ValidationError (400)
```

#### Uso Correto
```javascript
// Em Controllers - validação de input
if (!validation.valid) {
    return next(new ValidationError(validation.message));
}

// Em Services - erro de negócio
if (!movie) {
    throw new NotFoundError('Movie not found');
}

// Em Repositories - erro de infraestrutura
throw new AppError(error.message || 'Database error', 500);
```

### 5. Testes

#### Estrutura de Testes
- **Framework**: Jest + Supertest
- **Banco de Dados**: mongodb-memory-server (em memória)
- **Localização**: `src/__tests__/`
- **Naming**: `[feature].test.js`

#### Template de Teste
```javascript
import supertest from "supertest";
import { app } from "../../server";
const dbHandler = require('../../jest/jest.setup');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("Feature Name", () => {
    describe("success cases", () => {
        it("should...", async () => {
            // Arrange, Act, Assert
        });
    });
    
    describe("non success cases", () => {
        it("should return error when...", async () => {
            // Arrange, Act, Assert
        });
    });
});
```

#### Executar Testes
```bash
npm test              # Roda todos os testes com coverage
npm run dev           # Modo desenvolvimento (nodemon)
npm start             # Modo produção
```

## 📝 Tarefas Comuns para Agents

### ✅ Ao Adicionar Nova Funcionalidade

1. **Criar/Atualizar Schema** (`infrastructure/schema/`)
   - Definir campos e validações do Mongoose

2. **Criar Repository Methods** (`infrastructure/repository/`)
   - Read operations → `movieRepositoryRead.js`
   - Write operations → `movieRepositoryWrite.js`

3. **Criar Service** (`domain/services/`)
   - Implementar lógica de negócio
   - Formatar resposta com paginação
   - Tratamento de erros

4. **Criar Controller Handler** (`application/controllers/`)
   - Validar input
   - Chamar service
   - Retornar response

5. **Adicionar Rota** (`application/controllers/routes/`)
   - Definir HTTP method e path
   - Conectar ao handler

6. **Atualizar Contrato** (`contracts/contract.yaml`)
   - Documentar endpoint no OpenAPI

7. **Escrever Testes** (`__tests__/`)
   - Casos de sucesso
   - Casos de erro
   - Edge cases

### ✅ Ao Modificar Código Existente

1. **Ler o arquivo completamente** antes de editar
2. **Verificar dependências** (imports, exports)
3. **Manter consistência** com padrões existentes
4. **Atualizar testes** se necessário
5. **Verificar erros** após modificação

### ✅ Ao Debugar

1. **Verificar logs** no console
2. **Analisar stack trace** de erros
3. **Verificar validações** em cada camada
4. **Testar endpoint** com dados variados
5. **Revisar fluxo** de dados entre camadas

## 🚫 O Que NÃO Fazer

### ❌ Evitar Absolutamente

1. **Misturar Responsabilidades**
   ```javascript
   // ❌ NÃO fazer lógica de banco no controller
   export async function handler(req, res) {
       const movie = await Movie.findOne({...}); // ERRADO
   }
   
   // ✅ FAZER através do service
   export async function handler(req, res, next) {
       const movie = await movieService.findMovie(...); // CORRETO
   }
   ```

2. **Ignorar Tratamento de Erros**
   ```javascript
   // ❌ NÃO deixar erros sem tratamento
   export async function service() {
       return await repository.save(); // pode lançar erro não tratado
   }
   
   // ✅ FAZER tratamento adequado
   export async function service() {
       try {
           return await repository.save();
       } catch (error) {
           throw new AppError(error.message, 500);
       }
   }
   ```

3. **Hardcode de Valores**
   ```javascript
   // ❌ NÃO usar valores fixos
   const PORT = 3000;
   
   // ✅ FAZER uso de variáveis de ambiente
   const PORT = process.env.PORT;
   ```

4. **Quebrar Paginação**
   ```javascript
   // ❌ NÃO retornar array direto em listagens
   return movies;
   
   // ✅ FAZER retorno com metadados de paginação
   return {
       data: movies,
       currentPage: page,
       totalCount: count,
       totalPages: Math.ceil(count / limit)
   };
   ```

5. **Usar CommonJS em Novos Arquivos**
   ```javascript
   // ❌ NÃO usar
   const express = require('express');
   module.exports = router;
   
   // ✅ FAZER
   import express from 'express';
   export default router;
   ```

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/moviesDB
NODE_ENV=development
```

### Dependências Principais
- **Runtime**: express, mongoose, cors, dotenv
- **Validação**: express-jsonschema, js-yaml
- **Dev/Test**: jest, supertest, nodemon, mongodb-memory-server
- **Build**: babel, eslint

## 📚 Recursos Adicionais

### Documentação
- **OpenAPI Contract**: `src/contracts/contract.yaml`
- **README**: `README.md` (documentação da API)

### Endpoints Disponíveis
- `POST /movies` - Registrar filme
- `GET /movies` - Listar todos (paginado)
- `GET /movies/:title` - Buscar por título (query param)
- `GET /movies/genre/:genre` - Listar por gênero
- `GET /movies/director/:director` - Listar por diretor
- `GET /movies/year/:year` - Listar por ano
- `PUT /movies/:id` - Atualizar filme
- `DELETE /movies/:id` - Deletar filme
- `GET /search` - Busca geral (query: searchType, searchTerm)
- `GET /wakeup` - Health check

## 🎓 Boas Práticas Específicas

### 1. Ao Trabalhar com MongoDB/Mongoose
- Usar `.lean()` em queries de leitura para melhor performance
- Sempre usar try-catch em operações de banco
- Transformar `_id` em `id` nas respostas (se necessário)

### 2. Ao Trabalhar com Controllers
- Sempre usar `next(error)` para passar erros ao middleware
- Validar query params (page, limit) antes de usar
- Retornar status HTTP apropriado

### 3. Ao Trabalhar com Services
- Retornar arrays vazios ao invés de null para listagens
- Formatar dados antes de retornar
- Nunca retornar objetos Mongoose diretamente

### 4. Ao Escrever Testes
- Limpar banco entre testes (`afterEach`)
- Testar tanto sucesso quanto falha
- Usar `expect.any(String)` para IDs dinâmicos
- Mockar dependências quando necessário

## 🔍 Checklist para Agents

Antes de completar uma tarefa, verificar:

- [ ] Código segue o padrão ES6 modules
- [ ] Erros são tratados adequadamente
- [ ] Paginação está implementada (se aplicável)
- [ ] Validações estão em múltiplas camadas
- [ ] Testes foram criados/atualizados
- [ ] Imports/exports estão corretos
- [ ] Não há código duplicado
- [ ] Mensagens de erro são descritivas
- [ ] Status HTTP correto está sendo usado
- [ ] Documentação foi atualizada se necessário

---

**Versão**: 1.0.0
**Última atualização**: Novembro 2025
**Maintainer**: GitHub Copilot Agent Team
