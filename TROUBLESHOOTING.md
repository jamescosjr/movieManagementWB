# Guia de Troubleshooting

## 🔍 Problemas Comuns e Soluções

Este guia ajuda a diagnosticar e resolver problemas comuns no projeto Movie Management API.

---

## 🚨 Erros de Inicialização

### Erro: "Cannot find module"

**Sintomas**:
```bash
Error: Cannot find module './src/application/controllers/routes/routes.js'
```

**Causas Comuns**:
1. Caminho de import incorreto
2. Extensão `.js` faltando
3. Arquivo não existe

**Soluções**:

```javascript
// ❌ ERRADO
import routes from './src/application/controllers/routes/routes';

// ✅ CORRETO
import routes from './src/application/controllers/routes/routes.js';
```

**Debug**:
```bash
# Verificar se arquivo existe
ls -la src/application/controllers/routes/routes.js

# Verificar estrutura de diretórios
tree src/
```

---

### Erro: "Connection to MongoDB failed"

**Sintomas**:
```bash
Error connecting to MongoDB: MongoNetworkError
```

**Causas Comuns**:
1. MongoDB não está rodando
2. String de conexão incorreta
3. Arquivo `.env` não configurado

**Soluções**:

**1. Verificar se MongoDB está rodando**:
```bash
# Linux/Mac
sudo systemctl status mongod
# ou
ps aux | grep mongod

# Iniciar MongoDB
sudo systemctl start mongod
```

**2. Verificar variável de ambiente**:
```bash
# Criar .env se não existir
cp .env.example .env

# Editar .env
nano .env
```

```env
# Desenvolvimento local
MONGODB_URI=mongodb://localhost:27017/moviesDB

# MongoDB Atlas (produção)
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/moviesDB
```

**3. Testar conexão manualmente**:
```bash
# Usando mongosh
mongosh mongodb://localhost:27017/moviesDB

# Ou mongo (versões antigas)
mongo mongodb://localhost:27017/moviesDB
```

---

### Erro: "Port already in use"

**Sintomas**:
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Soluções**:

**1. Encontrar processo usando a porta**:
```bash
# Linux/Mac
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

**2. Matar o processo**:
```bash
# Linux/Mac
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

**3. Usar porta diferente**:
```env
# .env
PORT=3001
```

---

## 🧪 Erros de Testes

### Erro: "Jest did not exit one second after the test run completed"

**Causas**:
- Conexão com MongoDB não foi fechada
- Timers/Intervals não foram limpos

**Soluções**:

```javascript
// ✅ CORRETO - Fechar conexões após testes
afterAll(async () => {
    await dbHandler.closeDatabase();
    await mongoose.connection.close();
});
```

**Forçar saída**:
```bash
# Adicionar --forceExit (não recomendado para uso regular)
npm test -- --forceExit
```

---

### Erro: "Cannot read property 'status' of undefined"

**Sintomas**:
```javascript
expect(response.status).toBe(201);
// TypeError: Cannot read property 'status' of undefined
```

**Causas**:
- Endpoint incorreto
- Servidor não está respondendo
- Request malformado

**Debug**:

```javascript
// Adicionar logs para debug
const response = await supertest(app).post("/movies").send(data);
console.log('Response:', response);  // Ver o que foi retornado

// Verificar se app está exportado
console.log('App:', app);  // Deve mostrar objeto Express
```

**Verificar se endpoint existe**:
```javascript
// Em routes.js
console.log('Registered routes:', router.stack);
```

---

### Erro: "MongoError: E11000 duplicate key error"

**Sintomas**:
```bash
MongoError: E11000 duplicate key error collection: test.movies index: title_1
```

**Causas**:
- Tentando criar documento com valor único duplicado
- Índice único no schema
- Banco não foi limpo entre testes

**Soluções**:

```javascript
// ✅ CORRETO - Limpar banco entre testes
afterEach(async () => {
    await dbHandler.clearDatabase();
});

// Ou limpar coleção específica
afterEach(async () => {
    await Movie.deleteMany({});
});
```

---

## 🐛 Erros em Runtime

### Erro 400: Validation Error

**Sintomas**:
```json
{
  "message": "The title should be a valid string"
}
```

**Debug**:

**1. Verificar dados enviados**:
```javascript
// No controller, adicionar log
export async function registerMovieHandler(req, res, next) {
    console.log('Received body:', req.body);
    // ...
}
```

**2. Verificar tipo de dados**:
```javascript
console.log('Title type:', typeof title);
console.log('Year type:', typeof year);
```

**3. Testar com curl**:
```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Movie",
    "director": "Test Director",
    "genre": "Drama",
    "year": 2020
  }'
```

---

### Erro 404: Not Found

**Sintomas**:
```json
{
  "message": "Movie not found"
}
```

**Debug**:

**1. Verificar se ID existe**:
```javascript
// Testar diretamente no banco
const movie = await Movie.findById(id);
console.log('Found movie:', movie);
```

**2. Verificar formato do ID**:
```javascript
const mongoose = require('mongoose');
console.log('Is valid ObjectId:', mongoose.Types.ObjectId.isValid(id));
```

**3. Listar todos os documentos**:
```bash
# No mongosh
use moviesDB
db.movies.find().pretty()
```

---

### Erro 500: Internal Server Error

**Sintomas**:
```json
{
  "message": "Database error"
}
```

**Debug**:

**1. Verificar logs do servidor**:
```javascript
// Em errorHandler.js, adicionar log completo
export default function errorHandler(err, req, res, next) {
    console.error('Full error:', err);  // Ver stack trace completo
    console.error('Error stack:', err.stack);
    
    const statusCode = err.status || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({ message });
}
```

**2. Adicionar try-catch específico**:
```javascript
try {
    const result = await Movie.findById(id);
} catch (error) {
    console.error('MongoDB error:', error);
    throw new AppError(error.message, 500);
}
```

---

## 📦 Problemas com Dependências

### Erro: "Module not found" após npm install

**Soluções**:

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Verificar versões
node --version  # Deve ser >= 14
npm --version   # Deve ser >= 6
```

---

### Erro: "Cannot find module 'express-jsonschema'"

**Causa**: Dependência não instalada

**Solução**:
```bash
npm install express-jsonschema --save
```

---

## 🔧 Problemas de Desenvolvimento

### Nodemon não reinicia automaticamente

**Causas**:
- Configuração incorreta
- Arquivos não estão sendo "watched"

**Soluções**:

**1. Criar/atualizar nodemon.json**:
```json
{
  "watch": ["src", "server.js"],
  "ext": "js,json",
  "ignore": ["src/__tests__/*"],
  "exec": "node server.js"
}
```

**2. Verificar se nodemon está instalado**:
```bash
npm list nodemon
npm install --save-dev nodemon
```

---

### ESLint mostrando muitos erros

**Solução**:

```bash
# Verificar configuração
cat eslint.config.mjs

# Executar com fix automático
npx eslint src/ --fix

# Ignorar arquivos específicos
echo "coverage/" >> .eslintignore
echo "node_modules/" >> .eslintignore
```

---

## 🔍 Debugging Estratégico

### Técnicas de Debug

**1. Console.log Estratégico**:
```javascript
export async function createMovieService(data) {
    console.log('1. Service received:', data);
    
    try {
        const result = await createMovie(data);
        console.log('2. Repository returned:', result);
        return result;
    } catch (error) {
        console.log('3. Error occurred:', error.message);
        throw new AppError(error.message, 500);
    }
}
```

**2. Debugger Node.js**:
```bash
# Rodar com inspector
node --inspect server.js

# Ou com nodemon
nodemon --inspect server.js

# Conectar no Chrome
# Abrir chrome://inspect
```

**3. Usar VS Code Debugger**:
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/server.js",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal"
    }
  ]
}
```

---

## 📊 Problemas de Performance

### Query muito lenta

**Debug**:

```javascript
// Medir tempo de query
console.time('query');
const movies = await Movie.find(query);
console.timeEnd('query');

// Ver explain do MongoDB
const explained = await Movie.find(query).explain('executionStats');
console.log('Execution stats:', explained);
```

**Soluções**:

**1. Adicionar índices**:
```javascript
// Em movieSchema.js
movieSchema.index({ title: 1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ year: -1 });
```

**2. Usar .lean() para queries de leitura**:
```javascript
// ✅ Mais rápido
const movies = await Movie.find(query).lean();

// ❌ Mais lento (hydration desnecessária)
const movies = await Movie.find(query);
```

**3. Limitar campos retornados**:
```javascript
// Retornar apenas campos necessários
const movies = await Movie.find(query)
    .select('title director year')
    .lean();
```

---

## 🧹 Limpeza e Manutenção

### Limpar dados de teste

```bash
# Conectar ao MongoDB
mongosh

# Usar banco de dados
use moviesDB

# Limpar coleção
db.movies.deleteMany({})

# Ou dropar banco completamente
db.dropDatabase()
```

### Reset completo do projeto

```bash
# Parar servidor (Ctrl+C)

# Limpar node_modules e cache
rm -rf node_modules package-lock.json
npm cache clean --force

# Reinstalar
npm install

# Limpar banco de dados
mongosh
use moviesDB
db.dropDatabase()

# Reiniciar
npm run dev
```

---

## 📝 Checklist de Debug

Quando algo não funciona:

- [ ] Li a mensagem de erro completa
- [ ] Verifiquei o stack trace
- [ ] Reproduzi o erro de forma consistente
- [ ] Isolei o problema (qual camada?)
- [ ] Verifiquei logs do servidor
- [ ] Verifiquei logs do MongoDB
- [ ] Testei com dados diferentes
- [ ] Verifiquei variáveis de ambiente
- [ ] Confirmo que dependências estão instaladas
- [ ] Tentei restart do servidor/MongoDB
- [ ] Pesquisei erro no Google/Stack Overflow
- [ ] Revisei código recente (git diff)

---

## 🆘 Quando Pedir Ajuda

Antes de abrir uma issue, tenha pronto:

1. **Descrição do problema**: O que você estava tentando fazer?
2. **Erro completo**: Mensagem de erro e stack trace
3. **Reprodução**: Passos para reproduzir o problema
4. **Ambiente**: Versões de Node, npm, MongoDB, OS
5. **Código relevante**: Snippets do código relacionado
6. **O que já tentou**: Soluções que testou

**Template de Issue**:
```markdown
## Problema
[Descrição clara]

## Erro
```
[Cole erro completo aqui]
```

## Como Reproduzir
1. 
2. 
3. 

## Ambiente
- Node: vX.X.X
- npm: vX.X.X
- MongoDB: vX.X.X
- OS: Linux/Mac/Windows

## Já tentei
- [x] Restart do servidor
- [x] Verificar conexão MongoDB
- [ ] ...
```

---

**Dica**: Mantenha este guia aberto durante o desenvolvimento. 90% dos problemas estão documentados aqui!

**Versão**: 1.0.0  
**Última atualização**: Novembro 2025
