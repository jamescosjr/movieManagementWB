# 🔐 Configuração de Secrets do GitHub

## Visão Geral

Este documento lista todos os secrets necessários para a pipeline CI/CD funcionar corretamente.

---

## 📋 Secrets Necessários

### 1. Docker Hub

#### `DOCKER_USERNAME`
- **Descrição**: Seu nome de usuário do Docker Hub
- **Onde obter**: [Docker Hub](https://hub.docker.com/)
- **Exemplo**: `seu-usuario`

#### `DOCKER_PASSWORD`
- **Descrição**: Token de acesso do Docker Hub
- **Onde obter**: 
  1. Acesse [Docker Hub](https://hub.docker.com/)
  2. Account Settings → Security → New Access Token
  3. Copie o token gerado
- **⚠️ Importante**: Use Access Token, não sua senha

---

### 2. VPS (Virtual Private Server)

#### `VPS_HOST`
- **Descrição**: Endereço IP ou domínio da sua VPS
- **Exemplo**: `192.168.1.100` ou `api.seudominio.com`

#### `VPS_USERNAME`
- **Descrição**: Nome de usuário SSH da VPS
- **Exemplo**: `ubuntu`, `root`, ou seu usuário customizado

#### `VPS_SSH_KEY`
- **Descrição**: Chave privada SSH para acesso à VPS
- **Como gerar**:
  ```bash
  # Gerar par de chaves
  ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
  
  # Copiar chave pública para VPS
  ssh-copy-id -i ~/.ssh/github_actions.pub usuario@seu-vps
  
  # Obter chave privada (copiar TODO o conteúdo)
  cat ~/.ssh/github_actions
  ```
- **⚠️ Importante**: Inclua todo o conteúdo, incluindo:
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  [conteúdo da chave]
  -----END OPENSSH PRIVATE KEY-----
  ```

#### `VPS_SSH_PASSPHRASE`
- **Descrição**: Passphrase usada na geração da sua chave privada SSH (se você definiu uma ao criar a chave)
- **Quando preencher**: Somente se sua chave exigir passphrase; se a chave foi gerada com `-N ""` deixe o secret em branco ou não crie.
- **Nome do secret**: `VPS_SSH_PASSPHRASE`
- **Armazenamento**: Exatamente a passphrase (texto puro). Não coloque aspas.
- **Exemplo**: `Minh@PassFraseSegura2025!`


#### `VPS_PORT`
- **Descrição**: Porta SSH da VPS
- **Padrão**: `22`
- **Exemplo**: `22` ou `2222` (se customizado)

---

### 3. Aplicação

#### `APP_PORT`
- **Descrição**: Porta onde a aplicação irá rodar na VPS
- **Padrão**: `3000`
- **Exemplo**: `3000`

#### `MONGODB_URI`
- **Descrição**: String de conexão do MongoDB
- **Padrão (com Docker Compose)**: `mongodb://mongodb:27017/moviesDB`
- **Exemplo (MongoDB Atlas)**:
  ```
  mongodb+srv://usuario:senha@cluster.mongodb.net/moviesDB?retryWrites=true&w=majority
  ```

---

## 🔧 Como Adicionar Secrets no GitHub

### Via Interface Web

1. Acesse seu repositório no GitHub
2. Vá em **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**
5. Preencha:
   - **Name**: Nome do secret (ex: `DOCKER_USERNAME`)
   - **Value**: Valor do secret
6. Clique em **Add secret**
7. Repita para cada secret

### Via GitHub CLI

```bash
# Instalar GitHub CLI (se não tiver)
# https://cli.github.com/

# Autenticar
gh auth login

# Adicionar secrets (com chave COM passphrase)
gh secret set DOCKER_USERNAME
gh secret set DOCKER_PASSWORD
gh secret set VPS_HOST
gh secret set VPS_USERNAME
gh secret set VPS_SSH_KEY < ~/.ssh/github_actions
gh secret set VPS_SSH_PASSPHRASE
gh secret set VPS_PORT
gh secret set APP_PORT
gh secret set MONGODB_URI
```

---

## ✅ Checklist de Configuração

### Antes de Fazer Deploy

- [ ] Docker Hub
  - [ ] `DOCKER_USERNAME` configurado
  - [ ] `DOCKER_PASSWORD` configurado (Access Token)
  - [ ] Testado login: `docker login -u USERNAME -p PASSWORD`

- [ ] VPS
  - [ ] `VPS_HOST` configurado
  - [ ] `VPS_USERNAME` configurado
   - [ ] `VPS_SSH_KEY` configurado (inclui BEGIN/END)
   - [ ] `VPS_SSH_PASSPHRASE` configurado (se a chave tiver passphrase)
  - [ ] `VPS_PORT` configurado
  - [ ] Testado SSH: `ssh -i ~/.ssh/github_actions usuario@vps`
  - [ ] Docker instalado na VPS
  - [ ] Docker Compose instalado na VPS

- [ ] Aplicação
  - [ ] `APP_PORT` configurado
  - [ ] `MONGODB_URI` configurado
  - [ ] Firewall da VPS configurado (porta aberta)

---

## 🧪 Testar Configuração

### 1. Testar Docker Hub

```bash
# Testar login
echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin

# Testar push
docker tag movie-management-api $DOCKER_USERNAME/movie-management-api:test
docker push $DOCKER_USERNAME/movie-management-api:test
```

### 2. Testar SSH

```bash
# Testar conexão SSH
ssh -i ~/.ssh/github_actions usuario@vps-host -p 22

# Testar comandos remotos
ssh -i ~/.ssh/github_actions usuario@vps-host -p 22 "docker --version"
```

### 3. Testar na VPS

```bash
# SSH na VPS
ssh usuario@vps-host

# Verificar Docker
docker --version
docker-compose --version

# Verificar portas
sudo netstat -tulpn | grep :3000

# Verificar firewall
sudo ufw status
```

---

## 🔐 Segurança

### Boas Práticas

1. **Nunca commite secrets**
   ```bash
   # Adicione ao .gitignore
   .env
   .env.*
   !.env.example
   *.pem
   *.key
   ```

2. **Use Access Tokens, não senhas**
   - Docker Hub: Use Access Token
   - GitHub: Use Personal Access Token
   - MongoDB: Use usuários específicos

3. **Rotacione secrets regularmente**
   - A cada 3-6 meses
   - Após saída de membro da equipe
   - Após suspeita de comprometimento

4. **Princípio do menor privilégio**
   - Crie usuários específicos para deploy
   - Não use usuário root
   - Limite permissões SSH

5. **Monitore uso de secrets**
   - Verifique logs de acesso
   - Use alertas de atividades suspeitas

### Exemplo de Usuário SSH Limitado

```bash
# Na VPS, criar usuário específico para deploy
sudo adduser deploy-user
sudo usermod -aG docker deploy-user

# Configurar SSH apenas com chave
sudo nano /etc/ssh/sshd_config
# PasswordAuthentication no
# PubkeyAuthentication yes

# Reiniciar SSH
sudo systemctl restart sshd
```

---

## 🆘 Troubleshooting

### Secret não funciona

1. **Verificar nome do secret**
   - Nomes são case-sensitive
   - Usar exatamente como definido no workflow

2. **Verificar valor**
   - Sem espaços extras
   - Sem quebras de linha desnecessárias
   - Para SSH key: incluir header e footer

3. **Re-adicionar secret**
   - Remover secret existente
   - Adicionar novamente
   - Verificar em nova run

### Erro de autenticação

```bash
# Docker Hub
Error: unauthorized: authentication required

# Solução: Verificar DOCKER_USERNAME e DOCKER_PASSWORD

# SSH
Permission denied (publickey)

# Solução: Verificar VPS_SSH_KEY e se chave pública está na VPS
```

### Pipeline falha mas secrets parecem corretos

1. Verificar logs da action
2. Habilitar debug:
   ```yaml
   # No workflow
   env:
     ACTIONS_STEP_DEBUG: true
     ACTIONS_RUNNER_DEBUG: true
   ```
3. Testar manualmente com mesmos valores

---

## 📚 Recursos

- [GitHub Secrets Documentation](https://docs.github.com/actions/security-guides/encrypted-secrets)
- [Docker Hub Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)
- [SSH Key Generation](https://docs.github.com/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

---

## 📝 Template de Valores

Copie e preencha com seus valores:

```bash
# Docker Hub
DOCKER_USERNAME=seu-usuario-dockerhub
DOCKER_PASSWORD=dckr_pat_xxxxxxxxxxxxxxxxxxxxx

# VPS
VPS_HOST=192.168.1.100
VPS_USERNAME=deploy-user
VPS_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
[sua chave aqui]
-----END OPENSSH PRIVATE KEY-----
VPS_PORT=22
VPS_SSH_PASSPHRASE=minhaPassphraseOuVazioSeNaoTem

# Aplicação
APP_PORT=3000
MONGODB_URI=mongodb://mongodb:27017/moviesDB
```

---

**⚠️ IMPORTANTE**: Guarde este template em local seguro (não no Git)!

**Versão**: 1.1.0  
**Última atualização**: Novembro 2025
**Alterações**: Adicionado suporte/documentação para `VPS_SSH_PASSPHRASE`
