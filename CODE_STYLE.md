# Guia de Estilo de Código

## 📘 Propósito

Este documento define os padrões de estilo de código para o projeto Movie Management API. Seguir estes padrões garante consistência, legibilidade e manutenibilidade.

---

## 🎨 Princípios Gerais

1. **Clareza sobre Concisão**: Código deve ser fácil de entender
2. **Consistência**: Siga os padrões existentes
3. **Simplicidade**: Evite over-engineering
4. **Manutenibilidade**: Pense em quem vai ler seu código depois

---

## 📝 JavaScript/ES6+

### Modules

```javascript
// ✅ BOM - ES6 modules
import express from 'express';
import { Movie } from '../schema/movieSchema.js';

export async function createMovie(data) {
    // ...
}

export default router;

// ❌ EVITAR - CommonJS
const express = require('express');
module.exports = createMovie;
```

### Declaração de Variáveis

```javascript
// ✅ BOM
const MAX_PAGE_SIZE = 100;        // Constantes que nunca mudam
let currentPage = 1;               // Variáveis que podem mudar
const movies = [];                 // Arrays/Objects usam const

// ❌ EVITAR
var movies = [];                   // Não usar var
const page = 1; page = 2;         // Não reatribuir const
```

### Funções

```javascript
// ✅ BOM - Arrow functions para callbacks
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
const filtered = numbers.filter(n => n > 1);

// ✅ BOM - Async/await para operações assíncronas
export async function getAllMovies(page, limit) {
    try {
        const movies = await Movie.find().skip(skip).limit(limit);
        return movies;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

// ✅ BOM - Funções nomeadas para exports
export async function registerMovieHandler(req, res, next) {
    // ...
}

// ❌ EVITAR - Promises diretas quando async/await é possível
export function getAllMovies() {
    return Movie.find().then(movies => {
        return movies;
    }).catch(error => {
        throw error;
    });
}

// ❌ EVITAR - Callbacks quando async/await é possível
export function getAllMovies(callback) {
    Movie.find((error, movies) => {
        if (error) return callback(error);
        callback(null, movies);
    });
}
```

### Destructuring

```javascript
// ✅ BOM - Destructuring de objetos
export async function handler(req, res, next) {
    const { title, director, genre, year } = req.body;
    const { page, limit } = req.query;
    const { id } = req.params;
}

// ✅ BOM - Destructuring em imports
import { createMovie, updateMovie } from '../repository.js';

// ❌ EVITAR
export async function handler(req, res, next) {
    const title = req.body.title;
    const director = req.body.director;
    // ...
}
```

### Template Literals

```javascript
// ✅ BOM
const message = `Movie "${title}" by ${director} created successfully`;
const query = `SELECT * FROM movies WHERE year = ${year}`;

// ❌ EVITAR
const message = 'Movie "' + title + '" by ' + director + ' created successfully';
```

### Spread Operator

```javascript
// ✅ BOM - Cópia de objetos
const updatedMovie = { ...movie, title: newTitle };

// ✅ BOM - Cópia de arrays
const allMovies = [...actionMovies, ...dramaMovies];

// ✅ BOM - Rest parameters
export function createMovie({ title, director, ...otherProps }) {
    // ...
}
```

### Operadores Lógicos

```javascript
// ✅ BOM - Valores default com OR
const page = req.query.page || 1;
const limit = req.query.limit || 10;

// ✅ BOM - Nullish coalescing quando 0 ou '' são valores válidos
const limit = req.query.limit ?? 10;

// ✅ BOM - Optional chaining
const title = req?.body?.title;
```

---

## 🏗️ Estrutura de Código

### Ordem de Imports

```javascript
// 1. Dependências externas (node_modules)
import express from 'express';
import mongoose from 'mongoose';

// 2. Imports internos - camadas superiores primeiro
import { createMovieService } from '../../domain/services/movieService.js';
import { getAllMovies } from '../../infrastructure/repository/movieRepositoryRead.js';

// 3. Utilitários e tipos
import { validMovieData } from '../../domain/utils/validation.js';
import { AppError } from '../../domain/error/customErrors.js';

// 4. Configurações e constantes
import { MAX_PAGE_SIZE } from '../config/constants.js';
```

### Ordem de Exports

```javascript
// 1. Exports nomeados (funções principais)
export async function registerMovieHandler(req, res, next) { }
export async function updateMovieHandler(req, res, next) { }

// 2. Export default (se houver) no final
export default router;
```

### Estrutura de Arquivo

```javascript
// 1. Imports
import express from 'express';
import { Movie } from '../schema/movieSchema.js';

// 2. Constantes do arquivo (se houver)
const DEFAULT_PAGE_SIZE = 10;
const MAX_TITLE_LENGTH = 200;

// 3. Funções auxiliares privadas (se houver)
function formatMovieData(movie) {
    const { _id, ...rest } = movie;
    return { ...rest, id: _id };
}

// 4. Funções exportadas
export async function getAllMovies(page, limit) {
    // ...
}

export async function createMovie(data) {
    // ...
}

// 5. Export default (se houver)
export default router;
```

---

## 🎯 Nomenclatura

### Variáveis e Funções

```javascript
// camelCase para variáveis e funções
const movieTitle = "Inception";
const totalCount = 100;

function calculateTotalPages(count, limit) {
    return Math.ceil(count / limit);
}

async function getAllMovies() { }
```

### Classes e Constructors

```javascript
// PascalCase para classes
class AppError extends Error { }
class NotFoundError extends AppError { }
class MovieService { }
```

### Constantes

```javascript
// UPPER_SNAKE_CASE para constantes verdadeiras
const MAX_PAGE_SIZE = 100;
const DEFAULT_LIMIT = 10;
const API_VERSION = '1.0.0';

// camelCase para configurações que vêm de variáveis de ambiente
const databaseUrl = process.env.MONGODB_URI;
const serverPort = process.env.PORT;
```

### Arquivos

```javascript
// camelCase para arquivos de código
movieController.js
movieService.js
movieRepositoryRead.js

// PascalCase para componentes/classes principais
Movie.js (se fosse um arquivo de classe)

// kebab-case para arquivos de configuração
eslint.config.mjs
babel.config.cjs
```

### Convenções Específicas

```javascript
// Handlers: {action}{Resource}Handler
registerMovieHandler
updateMovieHandler
getAllMoviesHandler

// Services: {action}{Resource}Service
createMovieService
deleteMovieService
findByTitleService

// Repository: {action}By{Field} ou {action}{Resource}
getAllMovies
findByTitle
findByGenre
createMovie

// Validations: valid{What}
validMovieData
validPageNumber
validSearchParams
```

---

## 🎨 Formatação

### Indentação

```javascript
// 4 espaços (não tabs)
export async function handler(req, res, next) {
    const { title } = req.body;
    
    if (!title) {
        return next(new ValidationError('Title is required'));
    }
    
    try {
        const result = await service(title);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
```

### Espaçamento

```javascript
// ✅ BOM - Espaço após keywords
if (condition) { }
for (let i = 0; i < 10; i++) { }
while (condition) { }

// ✅ BOM - Espaço ao redor de operadores
const sum = a + b;
const isValid = x === y;
const result = condition ? true : false;

// ✅ BOM - Sem espaço em chamadas de função
const result = calculateTotal(a, b, c);
const movies = await getAllMovies(page, limit);

// ❌ EVITAR
if(condition){ }
const sum=a+b;
const result = calculateTotal (a, b);
```

### Linha em Branco

```javascript
// ✅ BOM - Linha em branco entre blocos lógicos
export async function handler(req, res, next) {
    const { title, director } = req.body;
    
    const validation = validMovieData(title, director);
    if (!validation.valid) {
        return next(new ValidationError(validation.message));
    }
    
    try {
        const result = await createMovie({ title, director });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

// ❌ EVITAR - Muito compactado
export async function handler(req, res, next) {
    const { title, director } = req.body;
    const validation = validMovieData(title, director);
    if (!validation.valid) {
        return next(new ValidationError(validation.message));
    }
    try {
        const result = await createMovie({ title, director });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}
```

### Comprimento de Linha

```javascript
// Máximo 100 caracteres
// ✅ BOM - Quebra em múltiplas linhas quando necessário
const formattedMovie = {
    id: movie._id,
    title: movie.title,
    director: movie.director,
    genre: movie.genre,
    year: movie.year
};

const result = await Movie
    .find(query)
    .skip(skip)
    .limit(limit)
    .sort({ title: 1 })
    .lean();
```

### Chaves

```javascript
// ✅ BOM - Sempre usar chaves, mesmo para blocos de uma linha
if (condition) {
    return true;
}

if (error) {
    throw new AppError(error.message);
}

// ❌ EVITAR
if (condition) return true;
if (error) throw new AppError(error.message);
```

---

## 🔧 Padrões Específicos do Projeto

### Controllers

```javascript
// Padrão para handlers
export async function {action}{Resource}Handler(req, res, next) {
    // 1. Extrair dados
    const { param1, param2 } = req.body;  // ou req.params, req.query
    
    // 2. Validar
    const validation = validFunction(param1, param2);
    if (!validation.valid) {
        return next(new ValidationError(validation.message));
    }
    
    // 3. Executar lógica (via service)
    try {
        const result = await someService(param1, param2);
        res.status(200).json(result);  // Status apropriado
    } catch (error) {
        next(error);
    }
}
```

### Services

```javascript
// Padrão para services
export async function {action}{Resource}Service(params) {
    try {
        // 1. Chamar repository
        const { data, count } = await repositoryFunction(params);
        
        // 2. Aplicar regras de negócio
        if (!data || data.length === 0) {
            return {
                data: [],
                currentPage: params.page,
                totalCount: 0,
                totalPages: 0
            };
        }
        
        // 3. Formatar dados
        const formatted = data.map(item => {
            const { _id, ...rest } = item;
            return { ...rest, id: _id };
        });
        
        // 4. Retornar com metadados
        return {
            data: formatted,
            currentPage: params.page,
            totalCount: count,
            totalPages: Math.ceil(count / params.limit)
        };
    } catch (error) {
        throw new AppError(error.message || 'Service error', 500);
    }
}
```

### Repositories

```javascript
// Padrão para repositories de leitura
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

// Padrão para repositories de escrita
export async function {action}{Resource}(params) {
    try {
        const instance = new Model(params);
        return await instance.save();
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}
```

### Validations

```javascript
// Padrão para validações
export function valid{What}(param1, param2, param3) {
    if (typeof param1 !== 'string' || param1.trim() === '') {
        return { 
            valid: false, 
            message: 'Param1 should be a valid string' 
        };
    }
    
    if (typeof param2 !== 'number' || param2 < MIN || param2 > MAX) {
        return { 
            valid: false, 
            message: 'Param2 should be a number between MIN and MAX' 
        };
    }
    
    return { valid: true };
}
```

### Error Handling

```javascript
// ✅ BOM - Erros customizados apropriados
if (!movie) {
    throw new NotFoundError('Movie not found');
}

if (!validation.valid) {
    return next(new ValidationError(validation.message));
}

throw new AppError('Unexpected error', 500);

// ❌ EVITAR - Erros genéricos
throw new Error('Movie not found');
res.status(404).json({ error: 'Not found' });
```

---

## 💬 Comentários

### Quando Comentar

```javascript
// ✅ BOM - Comentar regras de negócio não-óbvias
export async function calculateDiscount(price, customer) {
    // Clientes VIP recebem 20% de desconto após 10 compras
    if (customer.isVIP && customer.purchaseCount > 10) {
        return price * 0.8;
    }
    return price;
}

// ✅ BOM - Comentar workarounds ou soluções temporárias
// TODO: Remover após migração para nova API
const fallbackUrl = 'https://old-api.example.com';

// FIXME: Esta validação deve estar no schema
if (!title) {
    throw new ValidationError('Title required');
}

// ❌ EVITAR - Comentar o óbvio
// Incrementa o contador
counter++;

// Retorna os filmes
return movies;
```

### Estilo de Comentários

```javascript
// ✅ BOM - Comentário de linha única
// Esta é a explicação de uma linha

// ✅ BOM - Comentário de múltiplas linhas
/*
 * Esta função calcula o desconto baseado em:
 * 1. Status do cliente (VIP ou regular)
 * 2. Número de compras anteriores
 * 3. Valor total da compra atual
 */

// ✅ BOM - JSDoc para funções exportadas
/**
 * Cria um novo filme no banco de dados
 * @param {Object} movieData - Dados do filme
 * @param {string} movieData.title - Título do filme
 * @param {string} movieData.director - Diretor do filme
 * @param {number} movieData.year - Ano de lançamento
 * @returns {Promise<Object>} O filme criado
 */
export async function createMovie(movieData) {
    // ...
}
```

---

## 🚨 Anti-Padrões

### O Que Evitar

```javascript
// ❌ EVITAR - Magic numbers
if (movies.length > 100) { }
// ✅ FAZER
const MAX_MOVIES_PER_REQUEST = 100;
if (movies.length > MAX_MOVIES_PER_REQUEST) { }

// ❌ EVITAR - Callbacks aninhados (callback hell)
getData((data) => {
    processData(data, (result) => {
        saveResult(result, (saved) => {
            console.log('Done');
        });
    });
});
// ✅ FAZER
const data = await getData();
const result = await processData(data);
const saved = await saveResult(result);

// ❌ EVITAR - Try-catch vazio
try {
    dangerousOperation();
} catch (error) {
    // ignore
}
// ✅ FAZER
try {
    dangerousOperation();
} catch (error) {
    logger.error('Failed to execute dangerous operation', error);
    throw new AppError('Operation failed', 500);
}

// ❌ EVITAR - Retornar undefined implicitamente
export function getMovie(id) {
    if (id) {
        return movies[id];
    }
}
// ✅ FAZER
export function getMovie(id) {
    if (id) {
        return movies[id];
    }
    return null;
}

// ❌ EVITAR - Modificar parâmetros
export function addMovie(movies, movie) {
    movies.push(movie);  // Modifica array original
    return movies;
}
// ✅ FAZER
export function addMovie(movies, movie) {
    return [...movies, movie];  // Retorna novo array
}
```

---

## ✅ Checklist Rápido

Antes de commitar, verifique:

- [ ] Código usa ES6 modules (import/export)
- [ ] Variáveis usam const/let (nunca var)
- [ ] Funções assíncronas usam async/await
- [ ] Nomenclatura segue as convenções
- [ ] Indentação é consistente (4 espaços)
- [ ] Sem código comentado/debug
- [ ] Sem console.logs (exceto em errorHandler)
- [ ] Imports estão organizados
- [ ] Erros são tratados adequadamente
- [ ] Código é auto-explicativo
- [ ] Comentários apenas quando necessário

---

**Lembre-se**: Consistência é mais importante que preferências pessoais. Siga o estilo existente no projeto!

**Versão**: 1.0.0  
**Última atualização**: Novembro 2025
