# Переменные
APP_NAME=clover-frontend
PORT=80
SERVER_PATH=server/server.js

.PHONY: restart pull build clean check-port

# Главная команда для полного цикла обновления и перезапуска
restart: pull clean build
	@echo "🚀 Starting app with PM2..."
	# Запускаем через pm2 от обычного пользователя (после setcap)
	pm2 start $(SERVER_PATH) --name $(APP_NAME)
	@echo "✅ Restarted and updated successfully!"

# 1. Затягиваем свежий код из GitHub
pull:
	@echo "📥 Pulling latest changes from git..."
	git pull

# 2. Очистка порта и старых процессов
clean:
	@echo "🧹 Cleaning up..."
	-pm2 delete $(APP_NAME)
	-sudo fuser -k $(PORT)/tcp
	@echo "✨ Port $(PORT) is free."

# 3. Установка зависимостей, аудит и сборка
build:
	@echo "📦 Installing dependencies and auditing..."
	# Если права не позволяют иначе, используем sudo здесь
	sudo npm install
	sudo npm audit fix --force
	@echo "🛠 Building frontend..."
	sudo npm run build

# Проверка состояния порта
check-port:
	sudo lsof -i :$(PORT)
