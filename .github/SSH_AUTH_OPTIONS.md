# 🔐 Opções de Autenticação SSH na Pipeline

## Problema Resolvido

A pipeline estava falhando com o erro:
```
ssh: this private key is passphrase protected
ssh: unable to authenticate, attempted methods [none], no supported methods remain
```

## Solução Implementada

A partir da **versão 1.1.0** do CI/CD, você pode escolher entre **duas opções** de autenticação SSH:

---

## Opção 1: SSH Key (Recomendado para Produção) ✅

### Vantagens
- ✅ Mais seguro
- ✅ Não expõe senha
- ✅ Recomendado para produção
- ✅ Permite rotação fácil

### Como Configurar

1. **Gerar chave SSH SEM passphrase**:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""
   ```
   **Importante**: O parâmetro `-N ""` cria a chave SEM passphrase!

2. **Copiar chave pública para VPS**:
   ```bash
   ssh-copy-id -i ~/.ssh/github_actions.pub usuario@seu-vps
   ```

3. **Obter chave privada**:
   ```bash
   cat ~/.ssh/github_actions
   ```

4. **Configurar secret no GitHub**:
   - Nome: `VPS_SSH_KEY`
   - Valor: Todo o conteúdo da chave, incluindo:
     ```
     -----BEGIN OPENSSH PRIVATE KEY-----
     [conteúdo da chave]
     -----END OPENSSH PRIVATE KEY-----
     ```

5. **NÃO configurar** o secret `VPS_PASSWORD`

### Testar
```bash
ssh -i ~/.ssh/github_actions usuario@vps-host -p 22
```

---

## Opção 2: Senha SSH (Mais Simples) 🔑

### Vantagens
- ✅ Mais simples de configurar
- ✅ Não requer gerenciamento de chaves
- ✅ Bom para desenvolvimento/teste

### Desvantagens
- ⚠️ Menos seguro que SSH key
- ⚠️ Senha pode vazar em logs se mal configurada
- ⚠️ Precisa habilitar autenticação por senha no servidor

### Como Configurar

1. **Habilitar autenticação por senha na VPS**:
   ```bash
   # SSH na VPS
   ssh usuario@vps-host
   
   # Editar configuração SSH
   sudo nano /etc/ssh/sshd_config
   
   # Certifique-se que está assim:
   PasswordAuthentication yes
   
   # Reiniciar SSH
   sudo systemctl restart sshd
   ```

2. **Configurar secret no GitHub**:
   - Nome: `VPS_PASSWORD`
   - Valor: Sua senha SSH (use senha forte!)

3. **NÃO configurar** o secret `VPS_SSH_KEY`

### Testar
```bash
ssh usuario@vps-host -p 22
# Digite a senha quando solicitado
```

---

## Como a Pipeline Detecta Qual Método Usar

A pipeline foi atualizada para usar:
- **SSH Key** se o secret `VPS_SSH_KEY` existir
- **Senha** se o secret `VPS_PASSWORD` existir

**Importante**: Configure apenas UM dos dois secrets, não ambos!

---

## Secrets Necessários

### Comum para Ambas Opções
- `VPS_HOST` - IP ou domínio da VPS
- `VPS_USERNAME` - Usuário SSH
- `VPS_PORT` - Porta SSH (padrão: 22)

### Específico para SSH Key
- `VPS_SSH_KEY` - Chave privada (sem passphrase)

### Específico para Senha
- `VPS_PASSWORD` - Senha SSH

---

## Migração de Chave com Passphrase para Sem Passphrase

Se você já tem uma chave SSH com passphrase e quer usar na pipeline:

### Opção A: Remover Passphrase da Chave Existente
```bash
ssh-keygen -p -f ~/.ssh/github_actions
# Digite a passphrase atual
# Pressione Enter (vazio) para nova passphrase
# Pressione Enter novamente para confirmar
```

### Opção B: Gerar Nova Chave Sem Passphrase
```bash
# Gerar nova chave
ssh-keygen -t ed25519 -C "github-actions-new" -f ~/.ssh/github_actions_new -N ""

# Copiar para VPS
ssh-copy-id -i ~/.ssh/github_actions_new.pub usuario@vps

# Testar
ssh -i ~/.ssh/github_actions_new usuario@vps

# Se funcionar, atualizar secret no GitHub
cat ~/.ssh/github_actions_new
```

### Opção C: Usar Senha ao Invés de Chave
```bash
# Simplesmente configure VPS_PASSWORD no GitHub e remova VPS_SSH_KEY
```

---

## Troubleshooting

### "ssh: this private key is passphrase protected"
- ❌ Sua chave SSH tem passphrase
- ✅ Solução 1: Gere nova chave sem passphrase (`-N ""`)
- ✅ Solução 2: Remova passphrase da chave existente
- ✅ Solução 3: Use autenticação por senha (`VPS_PASSWORD`)

### "ssh: unable to authenticate"
- ❌ Autenticação falhou
- ✅ Verificar se chave pública está na VPS (`~/.ssh/authorized_keys`)
- ✅ Verificar permissões: `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys`
- ✅ Testar SSH manualmente primeiro

### "Permission denied (publickey)"
- ❌ Chave não autorizada na VPS
- ✅ Copiar chave pública novamente: `ssh-copy-id -i chave.pub usuario@vps`
- ✅ Verificar se arquivo `~/.ssh/authorized_keys` existe na VPS

### "Connection refused"
- ❌ VPS não está aceitando conexões SSH
- ✅ Verificar se VPS_HOST e VPS_PORT estão corretos
- ✅ Verificar firewall da VPS: `sudo ufw status`
- ✅ Verificar se SSH está rodando: `sudo systemctl status sshd`

---

## Recomendações de Segurança

### ✅ Produção
1. Use SSH Key sem passphrase
2. Desabilite autenticação por senha no servidor:
   ```bash
   # /etc/ssh/sshd_config
   PasswordAuthentication no
   PubkeyAuthentication yes
   ```
3. Rotacione chaves a cada 6 meses
4. Use usuário dedicado para deploy (não root)

### ✅ Desenvolvimento/Teste
1. Pode usar senha SSH
2. Use senhas fortes e únicas
3. Considere migrar para SSH keys posteriormente

---

## Checklist de Configuração

### Usando SSH Key
- [ ] Gerar chave SSH sem passphrase (`-N ""`)
- [ ] Copiar chave pública para VPS
- [ ] Testar SSH manualmente
- [ ] Adicionar `VPS_SSH_KEY` no GitHub
- [ ] Verificar que `VPS_PASSWORD` NÃO está configurado
- [ ] Rodar pipeline

### Usando Senha
- [ ] Habilitar `PasswordAuthentication yes` na VPS
- [ ] Reiniciar serviço SSH
- [ ] Testar login com senha
- [ ] Adicionar `VPS_PASSWORD` no GitHub
- [ ] Verificar que `VPS_SSH_KEY` NÃO está configurado
- [ ] Rodar pipeline

---

## Exemplos de Configuração

### GitHub Secrets com SSH Key
```
DOCKER_USERNAME=seu-usuario
DOCKER_PASSWORD=dckr_pat_xxxxx
VPS_HOST=192.168.1.100
VPS_USERNAME=deploy-user
VPS_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
xxxxxxxxxxxxx
-----END OPENSSH PRIVATE KEY-----
VPS_PORT=22
APP_PORT=3000
MONGODB_URI=mongodb://mongodb:27017/moviesDB
```

### GitHub Secrets com Senha
```
DOCKER_USERNAME=seu-usuario
DOCKER_PASSWORD=dckr_pat_xxxxx
VPS_HOST=192.168.1.100
VPS_USERNAME=deploy-user
VPS_PASSWORD=MinhaS€nh@Fort3!
VPS_PORT=22
APP_PORT=3000
MONGODB_URI=mongodb://mongodb:27017/moviesDB
```

---

**Versão**: 1.0.0  
**Criado**: Dezembro 2024  
**Relacionado**: [SECRETS.md](./SECRETS.md)
