# Переменные
APP_NAME=clover-frontend
DEV_PORT=8080
SERVER_PATH=server/server.js

# Папка, которую gateway-nginx раздаёт как статику фронтенда.
# То же значение, что у FRONTEND_DIST_PATH в deployments/docker-compose.yaml
# бэкенд-репозитория (по умолчанию /var/www/clover).
DEPLOY_DIR ?= /var/www/clover

# Имя docker-контейнера nginx-gateway (бэкенд-стек). Используется для reload.
GATEWAY_CONTAINER ?= gateway

.PHONY: help deploy pull install build clean dev reload-nginx check-port restart

help:
	@echo "Цели:"
	@echo "  make deploy        — git pull → npm ci → npm run build → rsync → gateway reload"
	@echo "  make dev           — PM2 dev-сервер (webpack watch + Node proxy)"
	@echo "  make build         — production-сборка в dist/"
	@echo "  make reload-nginx  — горячая перезагрузка gateway-контейнера"
	@echo "  make clean         — остановить PM2 и очистить dist/"
	@echo "  make check-port    — посмотреть, кто слушает $(DEV_PORT)"

# ─────────────────────────────────────────────────────────────────────
# PROD — деплой одной командой
# ─────────────────────────────────────────────────────────────────────
# git pull + npm ci + npm run build + rsync в DEPLOY_DIR + reload gateway.
# Никакого `npm audit fix --force` — он мажорно бьёт версии и ломает сборку.
deploy: pull install build
	@echo "📤 Deploying dist/ to $(DEPLOY_DIR)..."
	@if [ ! -d "$(DEPLOY_DIR)" ]; then \
		echo "ℹ️  Creating $(DEPLOY_DIR) (sudo)"; \
		sudo mkdir -p $(DEPLOY_DIR); \
		sudo chown -R $$(id -u):$$(id -g) $(DEPLOY_DIR); \
	fi
	rsync -a --delete dist/ $(DEPLOY_DIR)/
	@$(MAKE) reload-nginx
	@echo "✅ Frontend deployed."

reload-nginx:
	@echo "🔁 Reloading $(GATEWAY_CONTAINER) nginx..."
	@if docker ps --format '{{.Names}}' | grep -q '^$(GATEWAY_CONTAINER)$$'; then \
		docker exec $(GATEWAY_CONTAINER) nginx -t && docker exec $(GATEWAY_CONTAINER) nginx -s reload; \
	else \
		echo "⚠️  $(GATEWAY_CONTAINER) container is not running — skipped reload"; \
	fi

pull:
	@echo "📥 Pulling latest changes from git..."
	git pull --ff-only

# npm ci — детерминированная установка ровно из package-lock.json.
# Не используем `npm install`, чтобы случайно не сдвинуть версии.
install:
	@echo "📦 Installing dependencies (clean install)..."
	npm ci

build:
	@echo "🛠 Building production bundle..."
	npm run build

# ─────────────────────────────────────────────────────────────────────
# DEV
# ─────────────────────────────────────────────────────────────────────
dev:
	@echo "🚀 Starting dev stack (webpack watch + Node proxy) under PM2..."
	pm2 start npm --name $(APP_NAME) -- start

# Алиас на dev — для совместимости со старым `make restart`.
restart: dev

clean:
	@echo "🧹 Cleaning up..."
	-pm2 delete $(APP_NAME)
	rm -rf dist
	@echo "✨ Clean."

check-port:
	sudo lsof -i :$(DEV_PORT)
