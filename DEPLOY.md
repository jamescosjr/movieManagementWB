# 🚀 CI/CD e Deploy - Guia Completo

## 📋 Visão Geral

Este projeto possui pipeline completa de CI/CD usando GitHub Actions com:
- ✅ Testes automatizados
- ✅ Build de imagem Docker
- ✅ Push para Docker Hub
- ✅ Deploy automático em VPS
- ✅ Rollback manual

---

## 🔧 Configuração Inicial

### 1. Secrets do GitHub

Configure os seguintes secrets no GitHub (Settings → Secrets and variables → Actions):

#### Docker Hub
```
DOCKER_USERNAME=seu-usuario-dockerhub
DOCKER_PASSWORD=seu-token-dockerhub
```

#### VPS
```
VPS_HOST=ip-ou-dominio-da-vps
VPS_USERNAME=usuario-ssh
VPS_SSH_KEY=sua-chave-privada-ssh
VPS_PORT=22
```

#### Aplicação
```
APP_PORT=3000
MONGODB_URI=mongodb://mongodb:27017/moviesDB
```

### 2. Preparar VPS

#### Instalar Docker e Docker Compose na VPS

```bash
# Conectar na VPS
ssh usuario@seu-vps

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker --version
docker-compose --version

# Logout e login novamente
exit
```

#### Configurar Firewall

```bash
# Abrir porta da aplicação
sudo ufw allow 3000/tcp

# Abrir porta SSH (se não estiver)
sudo ufw allow 22/tcp

# Habilitar firewall
sudo ufw enable
```

#### Criar Diretório da Aplicação

```bash
mkdir -p /home/$USER/movie-management-api
cd /home/$USER/movie-management-api
```

### 3. Gerar Chave SSH para Deploy

```bash
# No seu computador local
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions

# Copiar chave pública para VPS
ssh-copy-id -i ~/.ssh/github_actions.pub usuario@seu-vps

# Obter chave privada (copiar todo o conteúdo)
cat ~/.ssh/github_actions

# Adicionar ao GitHub Secrets como VPS_SSH_KEY
```

---

## 🔄 Pipeline CI/CD

### Workflow Automático

A pipeline é executada automaticamente em:
- ✅ Push para `main` ou `develop`
- ✅ Pull requests para `main`

### Etapas da Pipeline

```
┌──────────────────┐
│   1. TEST        │  Testes e linting
│   ├─ ESLint      │
│   ├─ Jest        │
│   └─ Coverage    │
└────────┬─────────┘
         │
┌────────▼─────────┐
│   2. BUILD       │  Build Docker image
│   ├─ Buildx      │
│   ├─ Tag         │
│   └─ Push        │
└────────┬─────────┘
         │
┌────────▼─────────┐
│   3. DEPLOY      │  Deploy em VPS
│   ├─ SCP files   │
│   ├─ Pull image  │
│   └─ Start app   │
└──────────────────┘
```

### Jobs Detalhados

#### Job 1: Test
- Instala dependências
- Executa ESLint (max 0 warnings)
- Roda testes com cobertura
- Verifica cobertura >= 80%
- Faz upload para Codecov

#### Job 2: Build
- Cria imagem Docker otimizada
- Gera tags automáticas (latest, sha, branch)
- Faz push para Docker Hub
- Usa cache para builds rápidos

#### Job 3: Deploy
- Copia arquivos necessários para VPS
- Faz login no Docker Hub na VPS
- Pull da nova imagem
- Para containers antigos
- Inicia novos containers
- Limpa imagens antigas

---

## 🐳 Docker

### Dockerfile Otimizado

Características:
- ✅ Multi-stage build (reduz tamanho)
- ✅ Usa Alpine Linux (leve)
- ✅ Usuário não-root (segurança)
- ✅ Cache de dependências

### Docker Compose

#### Desenvolvimento (`docker-compose.dev.yml`)
```bash
# Iniciar em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up

# Com rebuild
docker-compose -f docker-compose.dev.yml up --build

# Em background
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar
docker-compose -f docker-compose.dev.yml down
```

#### Produção (`docker-compose.prod.yml`)
```bash
# Iniciar em produção
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f app

# Status
docker-compose -f docker-compose.prod.yml ps

# Parar
docker-compose -f docker-compose.prod.yml down
```

---

## 🚀 Deploy Manual

### Build Local

```bash
# Build da imagem
docker build -t movie-management-api:local .

# Testar localmente
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/moviesDB \
  movie-management-api:local

# Verificar endpoint funcional
curl http://localhost:3000/movies?page=1&limit=1
```

### Deploy na VPS (Manual)

```bash
# 1. Build e push da imagem
docker build -t seu-usuario/movie-management-api:latest .
docker push seu-usuario/movie-management-api:latest

# 2. Na VPS, pull da imagem
ssh usuario@seu-vps
docker pull seu-usuario/movie-management-api:latest

# 3. Iniciar aplicação
cd /home/$USER/movie-management-api
docker-compose -f docker-compose.prod.yml up -d

# 4. Verificar
docker-compose ps
curl http://localhost:3000/movies?page=1&limit=1
```

---

## 🔍 Monitoramento e Logs

### Ver Logs

```bash
# Logs da aplicação
docker-compose logs -f app

# Logs do MongoDB
docker-compose logs -f mongodb

# Últimas 100 linhas
docker-compose logs --tail=100 app

# Desde tempo específico
docker-compose logs --since 30m app
```

### Status dos Containers

```bash
# Ver containers rodando
docker-compose ps

# Stats de recursos
docker stats movie-api movie-mongodb

# Inspecionar container
docker inspect movie-api
```

### Verificação Básica

```bash
docker-compose ps
curl http://localhost:3000/movies?page=1&limit=1
```

---

## 🔄 Operações Comuns

### Atualizar Aplicação

```bash
# A pipeline faz isso automaticamente, mas manualmente:
cd /home/$USER/movie-management-api
docker-compose pull
docker-compose up -d
docker image prune -f
```

### Reiniciar Aplicação

```bash
# Reiniciar apenas app
docker-compose restart app

# Reiniciar tudo
docker-compose restart

# Recriar containers
docker-compose up -d --force-recreate
```

### Backup do MongoDB

```bash
# Backup
docker exec movie-mongodb mongodump \
  --db moviesDB \
  --out /data/backup

# Copiar backup para host
docker cp movie-mongodb:/data/backup ./backup-$(date +%Y%m%d)

# Restore
docker exec movie-mongodb mongorestore \
  --db moviesDB \
  /data/backup/moviesDB
```

### Limpar Recursos

```bash
# Remover containers parados
docker container prune -f

# Remover imagens não usadas
docker image prune -af

# Remover volumes não usados
docker volume prune -f

# Limpar tudo
docker system prune -af --volumes
```

---

## 🆘 Troubleshooting

### Pipeline Falhou

**1. Testes Falharam**
```bash
# Rodar testes localmente
npm test

# Ver cobertura
npm test -- --coverage

# Verificar linting
npx eslint src/
```

**2. Build Docker Falhou**
```bash
# Build local para debug
docker build -t test .

# Ver logs detalhados
docker build --progress=plain -t test .

# Verificar .dockerignore
cat .dockerignore
```

**3. Deploy Falhou**
```bash
# Verificar conexão SSH
ssh -i ~/.ssh/github_actions usuario@vps

# Ver logs da VPS
ssh usuario@vps
docker-compose logs
```

### Aplicação Não Inicia

**Container fica reiniciando:**
```bash
# Ver logs
docker-compose logs app

# Entrar no container
docker exec -it movie-api sh
```

**Erro de conexão com MongoDB:**
```bash
# Verificar se MongoDB está rodando
docker-compose ps mongodb

# Testar conexão
docker exec movie-api ping mongodb

# Ver logs do MongoDB
docker-compose logs mongodb
```

### Problemas de Rede

```bash
# Verificar network
docker network ls
docker network inspect movie-management-api_app-network

# Recriar network
docker-compose down
docker network prune
docker-compose up -d
```

---

## 🔐 Segurança

### Boas Práticas

1. **Nunca commitar secrets**
   - Use GitHub Secrets
   - Nunca commite .env

2. **Usar usuário não-root**
   - Dockerfile já configurado

3. **Manter imagens atualizadas**
   - Pipeline usa tags específicas
   - Atualizar base images regularmente

4. **HTTPS em produção**
   ```bash
   # Instalar nginx com Let's Encrypt
   sudo apt install nginx certbot python3-certbot-nginx
   sudo certbot --nginx -d seu-dominio.com
   ```

5. **Rate limiting**
   - Configurar no nginx ou usar express-rate-limit

---

## 📊 Monitoramento Avançado

### Adicionar Prometheus (Opcional)

```yaml
# Adicionar ao docker-compose.prod.yml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
```

### Adicionar Grafana (Opcional)

```yaml
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

---

## 📝 Checklist de Deploy

### Antes do Deploy

- [ ] Todos os testes passam localmente
- [ ] Cobertura >= 80%
- [ ] ESLint sem warnings
- [ ] .env.example atualizado
- [ ] Documentação atualizada
- [ ] Secrets configurados no GitHub

### Após Deploy

- [ ] Logs não mostram erros
- [ ] Endpoints respondem corretamente
- [ ] MongoDB conectado
- [ ] Backup configurado

---

## 🔄 Rollback

### Automático via GitHub Actions

```bash
# Trigger workflow de rollback
# Settings → Actions → Workflows → Rollback → Run workflow
```

### Manual

```bash
# Na VPS
cd /home/$USER/movie-management-api

# Parar containers
docker-compose down

# Usar imagem anterior
docker pull seu-usuario/movie-management-api:main-<sha-anterior>

# Atualizar docker-compose.yml com tag anterior
# Ou usar docker run com tag específica

# Iniciar
docker-compose up -d
```

---

## 🎯 Comandos Rápidos

```bash
# Ver status
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Reiniciar app
docker-compose restart app

# Atualizar tudo
docker-compose pull && docker-compose up -d

# Backup MongoDB
docker exec movie-mongodb mongodump --out /backup

# Entrar no container
docker exec -it movie-api sh

# Verificar endpoint
curl http://localhost:3000/movies?page=1&limit=1

# Ver recursos
docker stats
```

---

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker](https://hub.docker.com/_/mongo)

---

**Versão**: 1.1.0  
**Última atualização**: Novembro 2025  
**Mudança**: Removidas referências a health check
