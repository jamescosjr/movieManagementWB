#!/bin/bash

# Script de configuração inicial da VPS
# Uso: ./setup-vps.sh

set -e

echo "🚀 Configurando VPS para Movie Management API..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está rodando como root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ Este script não deve ser executado como root${NC}"
   exit 1
fi

echo -e "${GREEN}📦 Atualizando sistema...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${GREEN}🐳 Instalando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${YELLOW}⚠️  Você precisa fazer logout e login novamente para usar Docker sem sudo${NC}"
else
    echo -e "${YELLOW}Docker já está instalado${NC}"
fi

echo -e "${GREEN}🔧 Instalando Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo -e "${YELLOW}Docker Compose já está instalado${NC}"
fi

echo -e "${GREEN}🔥 Configurando Firewall...${NC}"
sudo ufw --force enable
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw status

echo -e "${GREEN}📁 Criando diretório da aplicação...${NC}"
mkdir -p /home/$USER/movie-management-api
cd /home/$USER/movie-management-api

echo -e "${GREEN}📝 Criando arquivo .env de exemplo...${NC}"
cat > .env.example << 'EOF'
# Configurações da Aplicação
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb://mongodb:27017/moviesDB

# Docker
DOCKER_IMAGE=seu-usuario/movie-management-api
EOF

echo -e "${GREEN}🔧 Instalando ferramentas úteis...${NC}"
sudo apt install -y \
    curl \
    wget \
    git \
    htop \
    ncdu \
    jq

echo -e "${GREEN}✅ Configuração completa!${NC}"
echo ""
echo "Próximos passos:"
echo "1. Fazer logout e login novamente (para usar Docker sem sudo)"
echo "2. Configurar .env com suas credenciais"
echo "3. Aguardar deploy automático via GitHub Actions"
echo ""
echo "Versões instaladas:"
docker --version
docker-compose --version
