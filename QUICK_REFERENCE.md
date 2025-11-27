# 🤖 Quick Reference for AI Agents

> **Referência rápida** - Consulte antes de cada tarefa!

---

## ⚡ Essencial - Leia Sempre

### 📋 Documentos Principais (em ordem de prioridade)
1. **[AGENT.md](AGENT.md)** ⭐ Guia completo - SEMPRE consulte
2. **[CHECKLIST.md](CHECKLIST.md)** ✅ Use em TODA tarefa
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** 🏗️ Entenda os fluxos
4. **[INDEX.md](INDEX.md)** 📚 Índice de toda documentação

---

## 🎯 Workflow Padrão

```
┌──────────────────────────────────────┐
│ 1. Ler solicitação do usuário        │
├──────────────────────────────────────┤
│ 2. Consultar AGENT.md seção relevante│
├──────────────────────────────────────┤
│ 3. Seguir CHECKLIST.md apropriado    │
├──────────────────────────────────────┤
│ 4. Ler arquivos relacionados         │
├──────────────────────────────────────┤
│ 5. Implementar seguindo CODE_STYLE   │
├──────────────────────────────────────┤
│ 6. Escrever/atualizar testes         │
├──────────────────────────────────────┤
│ 7. Executar npm test                 │
├──────────────────────────────────────┤
│ 8. Verificar todos checkpoints       │
├──────────────────────────────────────┤
│ 9. Se erro → TROUBLESHOOTING.md      │
└──────────────────────────────────────┘
```

---

## 📁 Estrutura do Projeto

```
src/
├── application/         Controllers, Routes, Middleware
│   ├── controllers/     HTTP handlers
│   ├── middleware/      Error handling
│   └── routes/         Route definitions
│
├── domain/             Business Logic
│   ├── services/       Lógica de negócio
│   ├── error/          Custom errors
│   └── utils/          Validações
│
├── infrastructure/     Data Access
│   ├── repository/     Read/Write separation
│   └── schema/         Mongoose schemas
│
└── contracts/          API contracts (OpenAPI)
```

---

## 🔄 Fluxo de Dados Simplificado

```
Request → Router → Controller → Service → Repository → MongoDB
                      ↓
                  Validation
                      ↓
                Error Handler → Response
```

---

## ✅ Checklist Mínimo (Toda Tarefa)

### Antes de Implementar
- [ ] Li AGENT.md seção relevante
- [ ] Entendi quais camadas serão afetadas
- [ ] Li arquivos relacionados completamente

### Durante Implementação
- [ ] Uso ES6 modules (import/export)
- [ ] Async/await em operações assíncronas
- [ ] Try-catch em todas funções async
- [ ] Erros customizados apropriados
- [ ] Segue nomenclatura do projeto

### Antes de Finalizar
- [ ] Testes escritos/atualizados
- [ ] `npm test` passa
- [ ] Sem console.logs debug
- [ ] Documentação atualizada (se necessário)

---

## 🚨 Regras Críticas - NUNCA VIOLAR

### ❌ NÃO Fazer

1. **NÃO use CommonJS**
   ```javascript
   ❌ const x = require('x');
   ✅ import x from 'x';
   ```

2. **NÃO misture responsabilidades**
   ```javascript
   ❌ Controller fazendo query no banco
   ✅ Controller → Service → Repository
   ```

3. **NÃO ignore tratamento de erros**
   ```javascript
   ❌ const result = await operation();
   ✅ try { const result = await operation(); } catch (e) { ... }
   ```

4. **NÃO quebre paginação**
   ```javascript
   ❌ return movies;
   ✅ return { data: movies, currentPage, totalCount, totalPages };
   ```

5. **NÃO retorne objetos Mongoose diretamente**
   ```javascript
   ❌ return await Movie.find();
   ✅ return await Movie.find().lean();
   ```

---

## 📝 Templates Rápidos

### Controller Handler
```javascript
export async function {action}{Resource}Handler(req, res, next) {
    const { param } = req.body; // ou req.params, req.query
    
    const validation = validFunction(param);
    if (!validation.valid) {
        return next(new ValidationError(validation.message));
    }
    
    try {
        const result = await someService(param);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
```

### Service
```javascript
export async function {action}{Resource}Service(params) {
    try {
        const { data, count } = await repositoryFunction(params);
        
        if (!data || data.length === 0) {
            return {
                data: [],
                currentPage: params.page,
                totalCount: 0,
                totalPages: 0
            };
        }
        
        const formatted = data.map(item => {
            const { _id, ...rest } = item;
            return { ...rest, id: _id };
        });
        
        return {
            data: formatted,
            currentPage: params.page,
            totalCount: count,
            totalPages: Math.ceil(count / params.limit)
        };
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}
```

### Repository Read
```javascript
export async function findBy{Field}(value, page, limit) {
    try {
        const query = { field: new RegExp(value, "i") };
        const skip = (page - 1) * limit;
        
        const [data, totalCount] = await Promise.all([
            Model.find(query).skip(skip).limit(limit).lean(),
            Model.countDocuments(query)
        ]);
        
        return { data, totalCount };
    } catch (error) {
        throw error;
    }
}
```

### Repository Write
```javascript
export async function {action}{Resource}(params) {
    try {
        const instance = new Model(params);
        return await instance.save();
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}
```

### Teste
```javascript
describe("Feature", () => {
    beforeAll(async () => await dbHandler.connect());
    afterEach(async () => await dbHandler.clearDatabase());
    afterAll(async () => await dbHandler.closeDatabase());

    describe("success cases", () => {
        it("should do something", async () => {
            // Arrange
            const data = { ... };
            
            // Act
            const response = await supertest(app)
                .post("/endpoint")
                .send(data);
            
            // Assert
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(expected);
        });
    });

    describe("error cases", () => {
        it("should return 400 when invalid", async () => {
            // ...
        });
    });
});
```

---

## 🎨 Nomenclatura Padrão

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Handler | `{action}{Resource}Handler` | `registerMovieHandler` |
| Service | `{action}{Resource}Service` | `createMovieService` |
| Repository | `{action}By{Field}` | `findByTitle` |
| Validation | `valid{What}` | `validMovieData` |
| Error | `{Type}Error` | `ValidationError` |

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Rodar com nodemon
npm start               # Rodar produção

# Testes
npm test                # Rodar testes
npm test -- --coverage  # Com cobertura

# Verificações
npm run lint            # (se configurado)
```

---

## 🐛 Debug Rápido

### Erro 400 (Validation)
1. Verificar dados enviados: `console.log('Body:', req.body)`
2. Verificar tipos: `console.log('Type:', typeof value)`
3. Verificar validação em `domain/utils/validation.js`

### Erro 404 (Not Found)
1. Verificar se ID existe no banco
2. Verificar se route está registrada
3. Verificar ordem das routes (específicas antes genéricas)

### Erro 500 (Server Error)
1. Ver logs completos do erro
2. Verificar conexão MongoDB
3. Verificar try-catch em repositories

### Testes Não Passam
1. Verificar conexão mongodb-memory-server
2. Limpar banco entre testes (`afterEach`)
3. Ver erro específico e stack trace

---

## 📊 Hierarquia de Erros

```
AppError (500)
├── NotFoundError (404)
└── ValidationError (400)
```

**Uso**:
- `ValidationError` - Input inválido (400)
- `NotFoundError` - Recurso não existe (404)
- `AppError` - Erro genérico/inesperado (500)

---

## 🎯 Quando Adicionar Nova Funcionalidade

### Ordem de Implementação:
1. Schema (se precisar novos campos)
2. Repository (Read e/ou Write)
3. Validation (regras de validação)
4. Service (lógica de negócio)
5. Controller (HTTP handler)
6. Routes (registrar endpoint)
7. Contract YAML (documentar)
8. Testes (sempre!)

### Checklist Específico:
Veja [CHECKLIST.md#Nova Funcionalidade](CHECKLIST.md#➕-nova-funcionalidade-feature)

---

## 🔍 Busca Rápida

| Procuro... | Consulte... |
|------------|-------------|
| Como estruturar código | [CODE_STYLE.md](CODE_STYLE.md) |
| Arquitetura/fluxos | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Resolver erro | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| Checklist tarefa | [CHECKLIST.md](CHECKLIST.md) |
| Todas as regras | [AGENT.md](AGENT.md) |
| Índice completo | [INDEX.md](INDEX.md) |

---

## 💡 Dicas de Eficiência

### Para Leitura de Código
```
1. Ler arquivo completamente antes de editar
2. Verificar imports/exports
3. Entender fluxo de dados
4. Identificar padrões existentes
5. Seguir mesmo padrão
```

### Para Implementação
```
1. Uma camada por vez (bottom-up ou top-down)
2. Testar cada camada antes de próxima
3. Seguir templates do projeto
4. Usar multi_replace para múltiplas edições
5. Verificar erros após cada mudança
```

### Para Testes
```
1. Escrever teste ANTES de implementar (TDD)
2. Ou IMEDIATAMENTE após implementar
3. Cobrir casos de sucesso E erro
4. Limpar banco entre testes
5. Verificar cobertura >= 80%
```

---

## ⚠️ Avisos Importantes

### 🚫 NUNCA faça:
- ❌ Editar sem ler arquivo completo
- ❌ Usar `var` ou CommonJS
- ❌ Misturar camadas (lógica no controller, etc)
- ❌ Ignorar tratamento de erros
- ❌ Commitar sem rodar testes
- ❌ Usar valores hardcoded (usar .env)

### ✅ SEMPRE faça:
- ✅ Ler AGENT.md antes de começar
- ✅ Seguir CHECKLIST.md
- ✅ Try-catch em funções async
- ✅ Validar inputs
- ✅ Escrever testes
- ✅ Verificar que testes passam

---

## 📞 Quando Precisa de Mais Info

1. **Conceitos gerais**: [AGENT.md](AGENT.md)
2. **Arquitetura/fluxos**: [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Padrões de código**: [CODE_STYLE.md](CODE_STYLE.md)
4. **Problemas/erros**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
5. **Workflow/PRs**: [CONTRIBUTING.md](CONTRIBUTING.md)
6. **Encontrar algo**: [INDEX.md](INDEX.md)

---

## 🎓 Lembre-se

> **"Qualidade sobre velocidade"**
> 
> É melhor gastar 2 minutos consultando a documentação
> do que 20 minutos debugando código inconsistente.

---

**Última atualização**: Novembro 2025  
**Versão**: 1.0.0

**Use este arquivo como referência constante! Mantenha aberto durante desenvolvimento.** 🚀
