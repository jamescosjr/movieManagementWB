# Diretório para certificados SSL

Após obter certificados SSL (Let's Encrypt, etc), coloque aqui:
- fullchain.pem
- privkey.pem

## Como gerar certificados com Certbot (na VPS):

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot

# Gerar certificado (substitua seu-dominio.com)
sudo certbot certonly --standalone -d seu-dominio.com

# Copiar certificados para o projeto
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem ./nginx/ssl/
sudo chmod 644 ./nginx/ssl/*.pem
```

## Renovação automática:

```bash
# Testar renovação
sudo certbot renew --dry-run

# Configurar cron para renovação automática (já vem configurado no Certbot)
```
