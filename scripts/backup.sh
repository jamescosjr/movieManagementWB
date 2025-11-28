#!/bin/bash

# Script de backup do MongoDB
# Uso: ./backup.sh

set -e

GREEN='\033[0;32m'
NC='\033[0m'

BACKUP_DIR="/home/$USER/movie-management-api/backups"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="movie-mongodb"

echo -e "${GREEN}💾 Iniciando backup do MongoDB...${NC}"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Fazer dump
echo -e "${GREEN}📦 Criando dump...${NC}"
docker exec $CONTAINER_NAME mongodump \
    --db moviesDB \
    --out /data/backup_$DATE

# Copiar para host
echo -e "${GREEN}📤 Copiando backup...${NC}"
docker cp $CONTAINER_NAME:/data/backup_$DATE $BACKUP_DIR/

# Comprimir
echo -e "${GREEN}🗜️  Comprimindo...${NC}"
cd $BACKUP_DIR
tar -czf backup_$DATE.tar.gz backup_$DATE
rm -rf backup_$DATE

# Limpar backups antigos (manter últimos 7 dias)
echo -e "${GREEN}🧹 Limpando backups antigos...${NC}"
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo -e "${GREEN}✅ Backup concluído: $BACKUP_DIR/backup_$DATE.tar.gz${NC}"
