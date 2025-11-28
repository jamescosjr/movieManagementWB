#!/bin/bash

# Script de deploy manual
# Uso: ./deploy.sh

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configurações (substitua com seus valores)
DOCKER_IMAGE="seu-usuario/movie-management-api"
APP_DIR="/home/$USER/movie-management-api"

echo -e "${GREEN}🚀 Iniciando deploy manual...${NC}"

# Navegar para diretório
cd $APP_DIR

# Pull da nova imagem
echo -e "${GREEN}📥 Baixando nova imagem...${NC}"
docker pull $DOCKER_IMAGE:latest

# Parar containers antigos
echo -e "${YELLOW}⏸️  Parando containers antigos...${NC}"
docker-compose down || true

# Iniciar novos containers
echo -e "${GREEN}▶️  Iniciando novos containers...${NC}"
docker-compose up -d

# Aguardar containers iniciarem
echo -e "${YELLOW}⏳ Aguardando containers iniciarem...${NC}"
sleep 10

echo -e "${GREEN}✅ Deploy concluído (sem health check)${NC}"

# Limpar imagens antigas
echo -e "${GREEN}🧹 Limpando imagens antigas...${NC}"
docker image prune -af

# Status
echo -e "${GREEN}📊 Status dos containers:${NC}"
docker-compose ps
