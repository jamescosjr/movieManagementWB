# Checklist de Desenvolvimento

## 🎯 Checklist Geral para Agents

Use este checklist em **TODAS** as tarefas de desenvolvimento para garantir qualidade e consistência.

---

## ✅ Antes de Iniciar Qualquer Tarefa

- [ ] Li e entendi o `AGENT.md` completamente
- [ ] Revisei a `ARCHITECTURE.md` para entender o fluxo
- [ ] Verifiquei se há issues ou PRs relacionados
- [ ] Entendi o escopo completo da tarefa
- [ ] Identifiquei quais camadas serão afetadas

---

## 🔍 Durante a Análise de Código

### Leitura de Contexto
- [ ] Li todos os arquivos relacionados completamente
- [ ] Entendi as dependências entre arquivos
- [ ] Identifiquei padrões existentes a seguir
- [ ] Verifiquei imports/exports necessários
- [ ] Revisei testes existentes (se houver)

### Planejamento
- [ ] Identifiquei todas as camadas que precisam mudanças:
  - [ ] Controller (se precisar novo endpoint)
  - [ ] Routes (se precisar nova rota)
  - [ ] Service (lógica de negócio)
  - [ ] Repository (acesso a dados)
  - [ ] Schema (se precisar novos campos)
  - [ ] Validations (regras de validação)
  - [ ] Contract YAML (documentação)
  - [ ] Tests (sempre necessário)

---

## 📝 Durante a Implementação

### Código Geral
- [ ] Usando ES6 modules (`import/export`), não CommonJS
- [ ] Seguindo convenções de nomenclatura do projeto
- [ ] Todo código async usa `async/await`, não Promises diretas
- [ ] Todos os erros têm tratamento adequado
- [ ] Sem código duplicado
- [ ] Sem valores hardcoded (usar variáveis de ambiente)
- [ ] Comentários apenas quando necessário (código auto-explicativo)

### Controllers
- [ ] Handler recebe `(req, res, next)`
- [ ] Extrai dados de `req.body`, `req.params` ou `req.query` corretamente
- [ ] Valida inputs ANTES de chamar service
- [ ] Usa `next(error)` para passar erros ao middleware
- [ ] Retorna status HTTP apropriado (200, 201, 204, 400, 404, 500)
- [ ] Não contém lógica de negócio ou acesso a banco

### Services
- [ ] Contém apenas lógica de negócio
- [ ] Não depende de `req` ou `res`
- [ ] Sempre usa `try/catch`
- [ ] Lança erros customizados apropriados (`AppError`, `ValidationError`, `NotFoundError`)
- [ ] Formata dados antes de retornar
- [ ] Para listagens: retorna objeto com `data`, `currentPage`, `totalCount`, `totalPages`
- [ ] Transforma `_id` em `id` quando necessário
- [ ] Retorna arrays vazios (não null) para listagens sem resultados

### Repositories
- [ ] Separado corretamente (Read vs Write)
- [ ] Read: usa `.lean()` para melhor performance
- [ ] Read: implementa paginação com `skip` e `limit`
- [ ] Read: retorna `{ movies, totalCount }` para listagens
- [ ] Write: usa validações do Mongoose
- [ ] Sempre usa `try/catch`
- [ ] Lança `AppError` em caso de erro de banco
- [ ] Não contém lógica de negócio

### Validations
- [ ] Validações estão em `domain/utils/validation.js`
- [ ] Retorna `{ valid: boolean, message: string }`
- [ ] Cobre todos os campos obrigatórios
- [ ] Valida tipos de dados
- [ ] Valida ranges/limites quando aplicável
- [ ] Mensagens de erro são descritivas

### Routes
- [ ] Usa método HTTP correto (GET, POST, PUT, DELETE)
- [ ] Path segue padrão REST
- [ ] Conecta ao handler correto
- [ ] Ordem das rotas está correta (específicas antes de genéricas)

### Schemas
- [ ] Todos os campos têm tipo definido
- [ ] Campos obrigatórios marcados com `required: true`
- [ ] Não contém lógica de negócio
- [ ] Exporta tanto schema quanto model

### Error Handling
- [ ] Usa classes de erro apropriadas:
  - `ValidationError` (400) para erros de validação
  - `NotFoundError` (404) para recursos não encontrados
  - `AppError` (500) para erros gerais/inesperados
- [ ] Mensagens de erro são descritivas
- [ ] Erros são propagados corretamente (`throw` ou `next(error)`)

---

## 🧪 Testes

### Estrutura
- [ ] Arquivo de teste criado em `src/__tests__/`
- [ ] Nome do arquivo: `[feature].test.js`
- [ ] Setup correto: `beforeAll`, `afterEach`, `afterAll`
- [ ] Usa `mongodb-memory-server` para testes de integração
- [ ] Importa `app` de `../../server`
- [ ] Usa `supertest` para requisições HTTP

### Cobertura
- [ ] **Casos de Sucesso** (happy path):
  - [ ] Status code correto
  - [ ] Estrutura de resposta correta
  - [ ] Dados corretos retornados
  
- [ ] **Casos de Erro**:
  - [ ] Validação de campos obrigatórios
  - [ ] Validação de tipos de dados
  - [ ] Recurso não encontrado (404)
  - [ ] Erros de banco de dados (500)
  
- [ ] **Edge Cases**:
  - [ ] Paginação (primeira página, última página)
  - [ ] Arrays vazios
  - [ ] Strings vazias/whitespace
  - [ ] Números limites (mínimo/máximo)

### Qualidade
- [ ] Testes são independentes (não dependem de ordem)
- [ ] Banco é limpo entre testes (`afterEach`)
- [ ] Usa `expect.any(String)` para IDs dinâmicos
- [ ] Mocks são usados quando apropriado
- [ ] Todos os testes passam: `npm test`
- [ ] Cobertura não diminuiu

---

## 📚 Documentação

### Código
- [ ] Funções complexas têm comentários explicativos
- [ ] Parâmetros não-óbvios são documentados
- [ ] Regras de negócio importantes estão comentadas

### API
- [ ] Endpoint documentado em `contract.yaml`
- [ ] Schema de request está correto
- [ ] Schema de response está correto
- [ ] Status codes documentados
- [ ] Exemplos fornecidos (quando útil)

### README/Docs
- [ ] `README.md` atualizado (se novo endpoint)
- [ ] Exemplos de uso atualizados
- [ ] Variáveis de ambiente documentadas (se novas)

---

## 🔧 Antes de Commitar

### Verificações Automáticas
- [ ] `npm test` - Todos os testes passam
- [ ] `npm test -- --coverage` - Cobertura adequada (>80%)
- [ ] Sem warnings de linting/eslint
- [ ] Sem console.logs esquecidos (exceto em errorHandler)

### Verificações Manuais
- [ ] Revisei todas as mudanças (`git diff`)
- [ ] Removi código comentado/debug
- [ ] Removi imports não utilizados
- [ ] Código está formatado consistentemente
- [ ] Não há conflitos de merge

### Git
- [ ] Branch criada com nome apropriado (`feature/`, `fix/`, etc)
- [ ] Commits seguem conventional commits
- [ ] Mensagens de commit são descritivas
- [ ] `.gitignore` está correto (não commitando `node_modules`, `.env`, etc)

---

## 🚀 Antes de Criar PR

### Funcionalidade
- [ ] Feature/fix funciona completamente
- [ ] Testei manualmente todas as mudanças
- [ ] Não quebrei funcionalidades existentes
- [ ] Performance é adequada

### Código
- [ ] Código segue todos os padrões do projeto
- [ ] Não há duplicação desnecessária
- [ ] Não há over-engineering
- [ ] Código é legível e manutenível

### Documentação
- [ ] Todas as docs necessárias foram atualizadas
- [ ] README reflete as mudanças
- [ ] Comentários explicam decisões não-óbvias

### Testes
- [ ] Cobertura de testes >= 80%
- [ ] Todos os cenários críticos cobertos
- [ ] Testes são significativos (não apenas para números)

### Git
- [ ] Branch atualizada com `main`
- [ ] Sem conflitos
- [ ] Histórico de commits está limpo
- [ ] PR tem descrição clara

---

## 📋 Checklist por Tipo de Tarefa

### ➕ Nova Funcionalidade (Feature)

1. **Planejamento**
   - [ ] Defini estrutura de dados (schema)
   - [ ] Identifiquei endpoints necessários
   - [ ] Planejei validações necessárias

2. **Implementação** (nesta ordem)
   - [ ] Schema (se necessário)
   - [ ] Repository (Read/Write)
   - [ ] Validations
   - [ ] Service
   - [ ] Controller
   - [ ] Routes
   - [ ] Contract YAML

3. **Testes**
   - [ ] Testes de integração (endpoint completo)
   - [ ] Testes de unidade (se lógica complexa)

4. **Documentação**
   - [ ] README atualizado
   - [ ] Contract YAML completo
   - [ ] Exemplos de uso

### 🐛 Correção de Bug (Fix)

1. **Análise**
   - [ ] Reproduzi o bug
   - [ ] Identifiquei a causa raiz
   - [ ] Identifiquei camadas afetadas

2. **Fix**
   - [ ] Corrigi o problema
   - [ ] Adicionei validação/check para prevenir reincidência
   - [ ] Não introduzi novos bugs

3. **Testes**
   - [ ] Adicionei teste que falha SEM o fix
   - [ ] Teste passa COM o fix
   - [ ] Testes existentes ainda passam

4. **Documentação**
   - [ ] Comentei código se necessário
   - [ ] Atualizei docs se comportamento mudou

### ♻️ Refatoração (Refactor)

1. **Antes**
   - [ ] Todos os testes passam
   - [ ] Documentei comportamento atual
   - [ ] Identifiquei o que será mudado

2. **Durante**
   - [ ] Mudanças são incrementais
   - [ ] Testes continuam passando após cada mudança
   - [ ] Comportamento externo não muda

3. **Depois**
   - [ ] Código é mais legível/manutenível
   - [ ] Sem duplicação
   - [ ] Performance não piorou
   - [ ] Todos os testes ainda passam

### 📖 Documentação (Docs)

1. **Conteúdo**
   - [ ] Informação está correta e atualizada
   - [ ] Exemplos funcionam
   - [ ] Formatação Markdown correta

2. **Clareza**
   - [ ] Linguagem clara e objetiva
   - [ ] Organização lógica
   - [ ] Links funcionam

---

## 🎓 Checklist de Boas Práticas

### Performance
- [ ] Queries usam índices (quando aplicável)
- [ ] Paginação implementada
- [ ] `.lean()` usado em queries de leitura
- [ ] Sem N+1 queries
- [ ] Dados desnecessários não são retornados

### Segurança
- [ ] Inputs são validados
- [ ] Queries usam Mongoose (proteção contra injection)
- [ ] Dados sensíveis não são logados
- [ ] Variáveis de ambiente para configs sensíveis

### Manutenibilidade
- [ ] Código é auto-explicativo
- [ ] Funções têm responsabilidade única
- [ ] Nomes são descritivos
- [ ] Magic numbers são constantes nomeadas
- [ ] Complexidade é gerenciável

### Escalabilidade
- [ ] Stateless (não depende de estado em memória)
- [ ] Pode ser paralelizado
- [ ] Recursos são liberados corretamente
- [ ] Sem memory leaks

---

## 🆘 Se Algo Deu Errado

### Debug Checklist
- [ ] Li a mensagem de erro completa
- [ ] Verifiquei stack trace
- [ ] Conferi imports/exports
- [ ] Revisei fluxo de dados
- [ ] Testei em isolamento
- [ ] Revisei recent changes
- [ ] Consultei `AGENT.md` e `ARCHITECTURE.md`

### Quando Pedir Ajuda
- [ ] Tentei debugar por pelo menos 15 minutos
- [ ] Pesquisei erro no Google/Stack Overflow
- [ ] Revisei documentação
- [ ] Preparei descrição clara do problema
- [ ] Tenho exemplos de reprodução

---

## ✨ Meta-Checklist

Ao completar uma tarefa, verificar:

- [ ] Todos os checklists relevantes foram seguidos
- [ ] Nada foi "pulado" ou deixado para depois
- [ ] Qualidade está no mesmo nível ou melhor que código existente
- [ ] Estou orgulhoso deste código

---

**Dica**: Imprima/salve este checklist e use-o como referência constante durante o desenvolvimento!

**Versão**: 1.0.0  
**Última atualização**: Novembro 2025
