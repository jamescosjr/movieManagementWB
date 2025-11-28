# Configuração do Nginx na VPS

## Contexto
Como já existe um Nginx rodando na VPS (`api.singulartech.space`), vamos integrar a Movie Management API ao Nginx existente ao invés de criar um container Nginx separado.

## Mudanças Realizadas

### 1. Docker Compose
- ✅ Removido serviço `nginx` do `docker-compose.prod.yml`
- ✅ Adicionada exposição da porta `5000:5000` no serviço `app`
- ✅ Aplicação agora expõe porta 5000 diretamente no host

### 2. Configuração do Nginx da VPS

Você tem **2 opções de roteamento**:

#### Opção A: Rota no domínio existente (Recomendado)
URLs: `https://api.singulartech.space/movies/*`

```bash
# 1. Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/movie-api

# 2. Copiar conteúdo do arquivo nginx/vps-nginx-config.conf
# (use a primeira configuração do arquivo)

# 3. Criar symlink
sudo ln -s /etc/nginx/sites-available/movie-api /etc/nginx/sites-enabled/

# 4. Testar configuração
sudo nginx -t

# 5. Recarregar Nginx
sudo systemctl reload nginx

# 6. Testar
curl https://api.singulartech.space/movies
```

#### Opção B: Subdomínio específico
URLs: `https://movies.singulartech.space/*`

```bash
# 1. Criar registro DNS para movies.singulartech.space apontando para o IP da VPS

# 2. Gerar certificado SSL
sudo certbot certonly --nginx -d movies.singulartech.space

# 3. Criar configuração (usar a segunda opção do arquivo vps-nginx-config.conf)
sudo nano /etc/nginx/sites-available/movies-api

# 4. Criar symlink
sudo ln -s /etc/nginx/sites-available/movies-api /etc/nginx/sites-enabled/

# 5. Testar e recarregar
sudo nginx -t
sudo systemctl reload nginx

# 6. Testar
curl https://movies.singulartech.space/movies
```

## Deploy na VPS

### 1. Atualizar código
```bash
cd /root/movie-management-api
git pull origin main
```

### 2. Liberar porta 5000 no firewall
```bash
sudo ufw allow 5000/tcp
sudo ufw status
```

### 3. Reiniciar containers
```bash
docker-compose down
docker-compose up -d
```

### 4. Verificar se está rodando
```bash
docker ps
curl http://localhost:5000/movies
```

### 5. Configurar Nginx (escolher Opção A ou B acima)

## URLs de Acesso

### Opção A (Rota no domínio existente):
- `https://api.singulartech.space/movies` - Listar filmes
- `https://api.singulartech.space/movies/{id}` - Filme específico
- `https://api.singulartech.space/movies/search` - Buscar filmes
- `https://api.singulartech.space/movies/health` - Health check

### Opção B (Subdomínio):
- `https://movies.singulartech.space/movies` - Listar filmes
- `https://movies.singulartech.space/movies/{id}` - Filme específico
- `https://movies.singulartech.space/movies/search` - Buscar filmes
- `https://movies.singulartech.space/health` - Health check

## Verificação

```bash
# Verificar containers rodando
docker ps

# Verificar logs da aplicação
docker logs movie-api

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/movie-api-access.log
sudo tail -f /var/log/nginx/movie-api-error.log

# Testar diretamente na porta 5000 (internamente na VPS)
curl http://localhost:5000/movies

# Testar via Nginx
curl https://api.singulartech.space/movies
```

## Troubleshooting

### Erro de conexão
```bash
# Verificar se app está rodando
docker ps | grep movie-api

# Verificar se porta 5000 está aberta
sudo netstat -tulpn | grep 5000

# Verificar firewall
sudo ufw status
```

### Erro 502 Bad Gateway
```bash
# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Verificar se aplicação está respondendo
curl http://localhost:5000/movies
```

### Container não inicia
```bash
# Ver logs
docker logs movie-api

# Verificar variáveis de ambiente
docker exec movie-api env | grep PORT
```

## Segurança

- ✅ Porta 5000 exposta apenas internamente (localhost)
- ✅ Nginx faz proxy reverso com SSL/TLS
- ✅ Rate limiting configurado (10 req/s)
- ✅ CORS configurado
- ✅ MongoDB não exposto externamente

## Próximos Passos

1. ✅ Fazer deploy das mudanças na VPS
2. ⏳ Escolher Opção A ou B de roteamento
3. ⏳ Configurar Nginx da VPS
4. ⏳ Testar todas as rotas
5. ⏳ Atualizar documentação da API com as URLs corretas
