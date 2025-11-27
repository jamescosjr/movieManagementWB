# Guia de Contribuição

## 🤝 Como Contribuir

Obrigado por considerar contribuir para o Movie Management API! Este documento fornece diretrizes para manter a qualidade e consistência do código.

## 📋 Antes de Começar

1. **Leia a documentação**:
   - `README.md` - Visão geral da API
   - `AGENT.md` - Guia técnico detalhado
   - `ARCHITECTURE.md` - Arquitetura do sistema

2. **Configure o ambiente**:
   ```bash
   npm install
   cp .env.example .env  # Configure suas variáveis de ambiente
   ```

3. **Execute os testes**:
   ```bash
   npm test
   ```

## 🔄 Workflow de Desenvolvimento

### 1. Criando uma Branch

```bash
# Para novas funcionalidades
git checkout -b feature/nome-da-funcionalidade

# Para correções de bugs
git checkout -b fix/descricao-do-bug

# Para melhorias
git checkout -b improvement/descricao
```

### 2. Desenvolvendo

1. **Escreva testes primeiro** (TDD recomendado)
2. **Implemente a funcionalidade**
3. **Garanta que todos os testes passem**
4. **Verifique o linting**

```bash
npm test                    # Roda testes
npm run dev                 # Desenvolvimento com hot-reload
```

### 3. Commits

Siga o padrão de commits semânticos:

```bash
# Formato
<tipo>(<escopo>): <descrição>

# Tipos
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Alteração na documentação
style:    Formatação, ponto e vírgula, etc
refactor: Refatoração de código
test:     Adição ou correção de testes
chore:    Manutenção, dependências, etc

# Exemplos
feat(movies): adiciona endpoint para busca por ator
fix(validation): corrige validação de ano do filme
docs(readme): atualiza exemplos de uso da API
test(movies): adiciona teste para paginação
refactor(service): extrai lógica de formatação
```

### 4. Pull Request

#### Checklist antes de criar PR:

- [ ] Código segue os padrões do projeto
- [ ] Todos os testes passam (`npm test`)
- [ ] Cobertura de testes não diminuiu
- [ ] Documentação atualizada (se aplicável)
- [ ] Sem warnings de linting
- [ ] Branch está atualizada com `main`

#### Template de PR:

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Nova funcionalidade (feat)
- [ ] Correção de bug (fix)
- [ ] Mudança breaking (breaking change)
- [ ] Documentação (docs)

## Como Testar
1. Passo a passo para testar as mudanças
2. ...

## Checklist
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Código revisado por mim
- [ ] Sem conflitos com main
```

## 🎯 Padrões de Código

### JavaScript/ES6+

```javascript
// ✅ BOM
export async function createMovieService({ title, director, genre, year }) {
    try {
        return await createMovie({ title, director, genre, year });
    } catch (error) {
        throw new AppError(error.message || 'Error creating the movie', 500);
    }
}

// ❌ EVITAR
export async function createMovieService(data) {
    return await createMovie(data);  // Sem tratamento de erro
}
```

### Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Variáveis | camelCase | `movieTitle`, `totalCount` |
| Funções | camelCase + verbo | `getMovies`, `validateData` |
| Classes | PascalCase | `AppError`, `Movie` |
| Arquivos | camelCase | `movieController.js` |
| Constantes | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |

### Imports

```javascript
// ✅ Ordem correta
// 1. Dependências externas
import express from 'express';
import mongoose from 'mongoose';

// 2. Imports internos (camadas superiores primeiro)
import { createMovieService } from '../../domain/services/movieService.js';
import { Movie } from '../../infrastructure/schema/movieSchema.js';

// 3. Utilitários e configurações
import { validMovieData } from '../../domain/utils/validation.js';
```

## 🧪 Testes

### Estrutura de Testes

```javascript
describe("Feature/Endpoint Name", () => {
    // Setup
    beforeAll(async () => await dbHandler.connect());
    afterEach(async () => await dbHandler.clearDatabase());
    afterAll(async () => await dbHandler.closeDatabase());

    describe("success cases", () => {
        it("should perform expected behavior", async () => {
            // Arrange (preparar)
            const movieData = { title: "Test", ... };
            
            // Act (executar)
            const response = await supertest(app)
                .post("/movies")
                .send(movieData);
            
            // Assert (verificar)
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(expected);
        });
    });

    describe("error cases", () => {
        it("should return 400 when data is invalid", async () => {
            // ...
        });
    });
});
```

### Cobertura Mínima

- **Linhas**: 80%
- **Funções**: 80%
- **Branches**: 75%

```bash
# Verificar cobertura
npm test -- --coverage
```

## 📁 Estrutura de Arquivos

### Ao Adicionar Novo Recurso

```
src/
├── application/
│   └── controllers/
│       └── [recurso]Controller.js      # Criar handler
├── domain/
│   ├── services/
│   │   └── [recurso]Service.js         # Criar service
│   └── utils/
│       └── [recurso]Validation.js      # Se necessário
├── infrastructure/
│   ├── repository/
│   │   ├── [recurso]RepositoryRead.js  # Read operations
│   │   └── [recurso]RepositoryWrite.js # Write operations
│   └── schema/
│       └── [recurso]Schema.js          # Schema Mongoose
└── __tests__/
    └── [recurso].test.js               # Testes
```

## 🔍 Code Review

### O que revisar:

1. **Funcionalidade**: O código faz o que deveria?
2. **Testes**: Cobertura adequada? Casos de erro cobertos?
3. **Performance**: Queries otimizadas? N+1 evitado?
4. **Segurança**: Validações adequadas? Dados sensíveis protegidos?
5. **Manutenibilidade**: Código legível? Bem documentado?
6. **Padrões**: Segue as convenções do projeto?

### Comentários Construtivos

```
✅ "Sugiro extrair essa lógica para um service separado para melhor testabilidade"
❌ "Esse código está ruim"

✅ "Podemos usar .lean() aqui para melhorar a performance"
❌ "Você não sabe usar Mongoose"
```

## 🐛 Reportando Bugs

### Template de Issue

```markdown
## Descrição
Descrição clara e concisa do bug

## Como Reproduzir
1. Vá para '...'
2. Execute '...'
3. Veja o erro

## Comportamento Esperado
O que deveria acontecer

## Comportamento Atual
O que está acontecendo

## Screenshots
Se aplicável

## Ambiente
- Node version:
- npm version:
- OS:

## Logs
```
[Cole logs relevantes]
```
```

## 💡 Sugerindo Funcionalidades

### Template de Feature Request

```markdown
## Problema
Qual problema essa feature resolve?

## Solução Proposta
Descrição da solução

## Alternativas Consideradas
Outras abordagens que você pensou

## Contexto Adicional
Qualquer outra informação relevante
```

## 📚 Recursos

- [Documentação Express](https://expressjs.com/)
- [Documentação Mongoose](https://mongoosejs.com/)
- [Guia de Testes Jest](https://jestjs.io/docs/getting-started)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🆘 Precisa de Ajuda?

- Abra uma issue com a tag `question`
- Consulte `AGENT.md` para detalhes técnicos
- Revise a documentação existente

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.

---

**Obrigado por contribuir! 🎉**
