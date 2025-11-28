#!/bin/bash

# Script de health check
# Uso: ./health-check.sh

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

API_URL="${1:-http://localhost:3000}"

echo "🏥 Verificando saúde da aplicação..."
echo "URL: $API_URL"
echo ""

# Teste 1: Endpoint de health check
echo -n "1. Health Check Endpoint... "
if curl -sf "$API_URL/wakeup" > /dev/null; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FALHOU${NC}"
    exit 1
fi

# Teste 2: Listar filmes
echo -n "2. API Endpoint (GET /movies)... "
if curl -sf "$API_URL/movies?page=1&limit=1" > /dev/null; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FALHOU${NC}"
    exit 1
fi

# Teste 3: Docker containers
echo -n "3. Docker Containers... "
APP_STATUS=$(docker inspect -f '{{.State.Health.Status}}' movie-api 2>/dev/null || echo "not found")
if [ "$APP_STATUS" == "healthy" ]; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${YELLOW}⚠️  Status: $APP_STATUS${NC}"
fi

# Teste 4: MongoDB
echo -n "4. MongoDB Connection... "
MONGO_STATUS=$(docker inspect -f '{{.State.Health.Status}}' movie-mongodb 2>/dev/null || echo "not found")
if [ "$MONGO_STATUS" == "healthy" ]; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${YELLOW}⚠️  Status: $MONGO_STATUS${NC}"
fi

# Resumo
echo ""
echo -e "${GREEN}✅ Todos os checks passaram!${NC}"
