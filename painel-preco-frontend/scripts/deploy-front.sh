#!/bin/bash

cd /home/euclydes/workstation/painel-preco-backend || exit
docker pull ghcr.io/ttsolutionspi/painel-precos-frontend:latest
docker-compose down app-front
docker-compose rm -vsf app-front
docker-compose up -d app-front
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
#docker system prune --all --force --volumes