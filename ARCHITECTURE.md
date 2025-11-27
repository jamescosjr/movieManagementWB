# Arquitetura do Sistema

## 📐 Visão Geral

O Movie Management API segue uma arquitetura em camadas inspirada em Domain-Driven Design (DDD) e Clean Architecture, com clara separação de responsabilidades e baixo acoplamento entre as camadas.

## 🏛️ Camadas da Aplicação

### Diagrama de Camadas

```
┌─────────────────────────────────────────────────────┐
│                    HTTP Layer                        │
│                  (Express Server)                    │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│              Application Layer                       │
│  ┌──────────────┐         ┌────────────────┐       │
│  │  Controllers │ ◄────── │  Middleware    │       │
│  │   (Handlers) │         │ (Error Handler)│       │
│  └──────┬───────┘         └────────────────┘       │
└─────────┼──────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────┐
│                Domain Layer                          │
│  ┌──────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │   Services   │  │ Validations │  │  Errors   │ │
│  │ (Business    │  │   (Utils)   │  │ (Custom)  │ │
│  │   Logic)     │  └─────────────┘  └───────────┘ │
│  └──────┬───────┘                                   │
└─────────┼──────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────┐
│            Infrastructure Layer                      │
│  ┌──────────────┐         ┌────────────────┐       │
│  │ Repositories │ ◄────── │    Schemas     │       │
│  │ (Read/Write) │         │   (Mongoose)   │       │
│  └──────┬───────┘         └────────────────┘       │
└─────────┼──────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────┐
│                  Database Layer                      │
│                    (MongoDB)                         │
└─────────────────────────────────────────────────────┘
```

## 📦 Descrição das Camadas

### 1. Application Layer (Camada de Aplicação)

**Localização**: `src/application/`

**Responsabilidades**:
- Receber e processar requisições HTTP
- Validar dados de entrada
- Orquestrar chamadas aos serviços
- Formatar respostas HTTP
- Tratamento centralizado de erros

**Componentes**:

#### Controllers (`controllers/movieController.js`)
```javascript
// Responsável por:
// - Extrair dados da requisição
// - Validar inputs básicos
// - Chamar serviços de domínio
// - Retornar respostas HTTP

export async function registerMovieHandler(req, res, next) {
    const { title, director, year, genre } = req.body;
    
    // Validação
    const validation = validMovieData(title, director, genre, year);
    if (!validation.valid) {
        return next(new ValidationError(validation.message));
    }
    
    try {
        // Chamada ao serviço
        const result = await createMovieService({ title, director, genre, year });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}
```

#### Routes (`controllers/routes/routes.js`)
```javascript
// Define o mapeamento HTTP Method + Path → Handler
router.post("/movies", registerMovieHandler);
router.get("/movies", getAllMoviesHandler);
```

#### Middleware (`middleware/errorHandler.js`)
```javascript
// Tratamento centralizado de erros
export default function errorHandler(err, req, res, next) {
    const statusCode = err.status || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({ message });
}
```

### 2. Domain Layer (Camada de Domínio)

**Localização**: `src/domain/`

**Responsabilidades**:
- Implementar regras de negócio
- Validações complexas
- Transformações de dados
- Lógica de domínio pura (independente de infraestrutura)

**Componentes**:

#### Services (`services/movieService.js`)
```javascript
// Lógica de negócio central
// - Orquestra operações de repositório
// - Aplica regras de negócio
// - Formata dados para resposta
// - Trata erros de domínio

export async function getAllMoviesService(page, limit) {
    try {
        const { movies, totalCount } = await getAllMovies(page, limit);
        
        // Regra de negócio: retornar estrutura vazia se não há filmes
        if (!movies || movies.length === 0) {
            return {
                data: [],
                currentPage: page,
                totalCount: 0,
                totalPages: 0
            };
        }
        
        // Transformação: _id → id
        const formattedMovies = movies.map(movie => {
            const { _id, ...rest } = movie;
            return { ...rest, id: _id };
        });
        
        // Regra de negócio: calcular paginação
        return {
            data: formattedMovies,
            currentPage: page,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit)
        };
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}
```

#### Validations (`utils/validation.js`)
```javascript
// Validações de domínio (regras de negócio)
export function validMovieData(title, director, genre, year) {
    if (typeof title !== 'string' || title.trim() === '') {
        return { valid: false, message: 'The title should be a valid string' };
    }
    // ... mais validações
    return { valid: true };
}
```

#### Errors (`error/customErrors.js`)
```javascript
// Erros de domínio personalizados
export class AppError extends Error {
    constructor(message = "something went wrong", status) {
        super(message);
        this.status = status || 500;
        this.isOperational = true;
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message = "Invalid data") {
        super(message, 400);
    }
}
```

### 3. Infrastructure Layer (Camada de Infraestrutura)

**Localização**: `src/infrastructure/`

**Responsabilidades**:
- Acesso a banco de dados
- Schemas e modelos
- Detalhes de persistência
- Implementação de repositórios

**Componentes**:

#### Repositories

##### Read Repository (`repository/movieRepositoryRead.js`)
```javascript
// Operações SOMENTE de leitura
// - Queries otimizadas com .lean()
// - Paginação
// - Filtros e buscas

export async function getAllMovies(page, limit) {
    const skip = (page - 1) * limit;
    
    const [movies, totalCount] = await Promise.all([
        Movie.find().skip(skip).limit(limit).sort({ title: 1 }).lean(),
        Movie.countDocuments()
    ]);
    
    return { movies, totalCount };
}
```

##### Write Repository (`repository/movieRepositoryWrite.js`)
```javascript
// Operações de escrita
// - Create, Update, Delete
// - Validações de banco

export async function createMovie({ title, director, genre, year }) {
    try {
        const newMovie = new Movie({ title, director, genre, year });
        return await newMovie.save();
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}
```

#### Schemas (`schema/movieSchema.js`)
```javascript
// Definição do modelo de dados
export const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: String, required: true },
    year: { type: Number, required: true },
});

export const Movie = mongoose.model("Movie", movieSchema);
```

### 4. Contracts Layer (Camada de Contratos)

**Localização**: `src/contracts/`

**Responsabilidades**:
- Definir API contracts (OpenAPI/Swagger)
- Validação de schemas
- Documentação da API

**Componentes**:

#### OpenAPI Contract (`contracts/contract.yaml`)
```yaml
# Define estrutura de requisição/resposta
# Usado para validação automática com express-jsonschema
paths:
  /movies:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                title: { type: string }
                # ...
```

## 🔄 Fluxo de Dados Detalhado

### Exemplo: POST /movies (Criar Filme)

```
1. HTTP Request
   POST /movies
   Body: { title, director, genre, year }
        ↓

2. Express Middleware Pipeline
   a. CORS middleware
   b. JSON parser
   c. Schema validation (express-jsonschema + YAML)
        ↓

3. Router (routes.js)
   Mapeia POST /movies → registerMovieHandler
        ↓

4. Controller (movieController.js)
   a. Extrai dados do req.body
   b. Valida com validMovieData()
   c. Se inválido → next(ValidationError)
   d. Se válido → chama createMovieService()
        ↓

5. Service (movieService.js)
   a. Recebe dados validados
   b. Aplica regras de negócio (se houver)
   c. Chama createMovie() do repository
   d. Trata erros → AppError
   e. Retorna resultado
        ↓

6. Repository (movieRepositoryWrite.js)
   a. Cria instância do Model
   b. Salva no MongoDB
   c. Retorna documento salvo
   d. Trata erros de DB → AppError
        ↓

7. Response Flow (volta)
   Repository → Service → Controller → Express → HTTP Response
        ↓

8. HTTP Response
   Status: 201
   Body: { _id, title, director, genre, year, __v }
```

### Exemplo: GET /movies (Listar Filmes)

```
1. HTTP Request
   GET /movies?page=2&limit=10
        ↓

2. Controller (movieController.js)
   a. Extrai page e limit de req.query
   b. Converte para integers
   c. Valida (page >= 1, limit >= 1)
   d. Chama getAllMoviesService(page, limit)
        ↓

3. Service (movieService.js)
   a. Chama getAllMovies(page, limit) do repository
   b. Verifica se há resultados
   c. Formata: _id → id
   d. Calcula metadados de paginação
   e. Retorna objeto formatado
        ↓

4. Repository (movieRepositoryRead.js)
   a. Calcula skip = (page - 1) * limit
   b. Executa queries em paralelo:
      - Movie.find().skip().limit().sort().lean()
      - Movie.countDocuments()
   c. Retorna { movies, totalCount }
        ↓

5. HTTP Response
   Status: 200
   Body: {
     data: [...],
     currentPage: 2,
     totalCount: 100,
     totalPages: 10
   }
```

## 🎯 Padrões de Design Implementados

### 1. Repository Pattern
- Separa lógica de acesso a dados da lógica de negócio
- Implementação: `movieRepositoryRead.js` e `movieRepositoryWrite.js`

### 2. CQRS (Command Query Responsibility Segregation)
- Separação entre operações de leitura e escrita
- Read: otimizado com `.lean()`, sem hydration
- Write: com validações completas do Mongoose

### 3. Dependency Injection (implícito)
- Services recebem dados, não dependem de req/res
- Repositories são importados, não instanciados
- Facilita testes e substituição

### 4. Error Handling Pattern
- Erros customizados com hierarquia
- Middleware centralizado
- Propagação consistente (throw → next)

### 5. DTO (Data Transfer Object) Pattern
- Transformação `_id → id`
- Estrutura padronizada de resposta com paginação
- Separação entre modelo de DB e modelo de API

## 🧪 Testabilidade

### Arquitetura Favorece Testes

```javascript
// Camada de Controller - Mock do Service
jest.mock('../../domain/services/movieService.js');

test('controller calls service correctly', async () => {
    createMovieService.mockResolvedValue({ id: '123' });
    await registerMovieHandler(req, res, next);
    expect(createMovieService).toHaveBeenCalledWith(expectedData);
});

// Camada de Service - Mock do Repository
jest.mock('../../infrastructure/repository/movieRepositoryWrite.js');

test('service formats data correctly', async () => {
    createMovie.mockResolvedValue(mockMovie);
    const result = await createMovieService(data);
    expect(result).toHaveProperty('id');
});

// Camada de Repository - MongoDB em memória
// Usa mongodb-memory-server para testes de integração
```

## 📊 Diagrama de Dependências

```
server.js
    │
    ├─► routes.js
    │       └─► movieController.js
    │               └─► movieService.js
    │                       ├─► movieRepositoryRead.js
    │                       │           └─► movieSchema.js
    │                       └─► movieRepositoryWrite.js
    │                                   └─► movieSchema.js
    │
    ├─► errorHandler.js
    └─► contract.yaml (via express-jsonschema)
```

### Regra de Dependência
```
Application → Domain → Infrastructure
     │                        │
     └────────────────────────┘
           (somente interfaces, não implementações diretas)
```

## 🔒 Princípios SOLID

### Single Responsibility Principle (SRP)
- Cada camada tem uma responsabilidade única
- Controllers: HTTP handling
- Services: Business logic
- Repositories: Data access

### Open/Closed Principle (OCP)
- Fácil adicionar novos endpoints sem modificar existentes
- Extensível via novos services/repositories

### Liskov Substitution Principle (LSP)
- Erros customizados substituem Error base
- Repositories podem ser substituídos (mock em testes)

### Interface Segregation Principle (ISP)
- Read/Write repositories separados
- Cada handler tem responsabilidade específica

### Dependency Inversion Principle (DIP)
- Controllers dependem de Services (abstração)
- Services dependem de Repositories (abstração)
- Não há dependência direta de detalhes de implementação

## 🚀 Escalabilidade

### Horizontal Scaling
- Stateless design permite múltiplas instâncias
- MongoDB pode ser replicado
- Cache pode ser adicionado na camada de Service

### Vertical Scaling
- Queries otimizadas com `.lean()`
- Paginação em todos os endpoints
- Índices podem ser adicionados no Schema

### Melhorias Futuras
```
┌─────────────────────────────────────────┐
│         Load Balancer (Nginx)           │
└────────────┬────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼────┐
│ App 1  │      │  App 2  │
└───┬────┘      └────┬────┘
    │                │
    └────────┬───────┘
             │
    ┌────────▼────────┐
    │  Cache (Redis)  │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │ MongoDB Cluster │
    └─────────────────┘
```

## 📝 Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Handler | `{action}{Resource}Handler` | `registerMovieHandler` |
| Service | `{action}{Resource}Service` | `createMovieService` |
| Repository | `{action}By{Field}` | `findByTitle` |
| Error | `{Type}Error` | `ValidationError` |
| Schema | `{resource}Schema` | `movieSchema` |
| Model | `{Resource}` (PascalCase) | `Movie` |

---

**Versão**: 1.0.0
**Última atualização**: Novembro 2025
