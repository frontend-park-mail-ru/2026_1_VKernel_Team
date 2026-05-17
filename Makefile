# Переменные
APP_NAME=clover-frontend
SERVER_PATH=server/server.js

# Куда копируется dist/ на проде (этот же путь монтируется в gateway-nginx через
# FRONTEND_DIST_PATH в deployments/docker-compose.yaml бэкенд-репозитория).
DEPLOY_DIR ?= /var/www/clover

.PHONY: help dev pull clean install build deploy reload-nginx

help:
	@echo "Цели:"
	@echo "  make dev            — локальный dev-стек (webpack watch + Node-прокси) под PM2"
	@echo "  make build          — production-сборка в dist/ (минификация, gzip, brotli, image-opt)"
	@echo "  make deploy         — pull + install + build + rsync dist → $(DEPLOY_DIR) + reload gateway"
	@echo "  make reload-nginx   — горячая перезагрузка gateway-контейнера"
	@echo "  make clean          — остановить PM2 и очистить dist/"

# ─────────────────────────────────────────────────────────────────────
# DEV — webpack watch + Node-сервер-прокси под PM2 (для разработки на локалке)
# ─────────────────────────────────────────────────────────────────────
dev: install
	@echo "🚀 Starting dev stack (webpack watch + Node proxy) under PM2..."
	pm2 start npm --name $(APP_NAME) -- start

# ─────────────────────────────────────────────────────────────────────
# PROD — собрать статику и положить в общий volume, который читает gateway-nginx
# ─────────────────────────────────────────────────────────────────────
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
	@echo "🔁 Reloading gateway nginx..."
	@if docker ps --format '{{.Names}}' | grep -q '^gateway$$'; then \
		docker exec gateway nginx -t && docker exec gateway nginx -s reload; \
	else \
		echo "⚠️  gateway container is not running — skipped reload"; \
	fi

pull:
	@echo "📥 Pulling latest changes from git..."
	git pull

install:
	@echo "📦 Installing dependencies..."
	npm install

build:
	@echo "🛠 Building production bundle..."
	npm run build:prod

clean:
	@echo "🧹 Cleaning up..."
	-pm2 delete $(APP_NAME)
	rm -rf dist
	@echo "✨ Clean."
